"""Generate static Malay pages from the English pages and reviewed translations.

Run with Python 3 from any directory. No third-party packages are required.
Unknown English copy fails the build rather than silently leaking into Malay pages.
"""
from html import escape
from html.parser import HTMLParser
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
PAGES = (
    "index.html", "about.html", "projects.html", "notes/index.html",
    "notes/alert-to-disposition.html", "notes/ioc-enrichment-workflow.html", "404.html",
)
ORIGIN = "https://iqbalhamdzan.xyz"
VERSION = "20261122"
DATA = json.loads((ROOT / "translations/ms.json").read_text(encoding="utf-8"))
COPY = DATA["text"] | DATA["ui"]
UNCHANGED = set(DATA["unchanged"])


def route(page):
    return "/" + page.removesuffix("index.html") if page.endswith("index.html") else "/" + page


def prepare_english(source, page):
    path = route(page)
    source = re.sub(r"(/assets/(?:style\.css|site\.js|language\.js|translations\.js))\?v=\d+", rf"\1?v={VERSION}", source)
    if '<!-- Language alternatives -->' not in source:
        alternatives = (
            '<!-- Language alternatives -->\n'
            f'<link rel="alternate" hreflang="en" href="{ORIGIN}{path}">\n'
            f'<link rel="alternate" hreflang="ms" href="{ORIGIN}/ms{path}">\n'
            f'<link rel="alternate" hreflang="x-default" href="{ORIGIN}{path}">\n'
            '<meta property="og:locale" content="en_MY">\n'
            '<meta property="og:locale:alternate" content="ms_MY">\n'
            f'<script src="/assets/language.js?v={VERSION}"></script>\n'
            f'<script src="/assets/translations.js?v={VERSION}" defer></script>\n'
        )
        source = source.replace('<script src="/assets/site.js', alternatives + '<script src="/assets/site.js', 1)
    if 'class="language-switch"' not in source:
        switch = (
            '<nav class="language-switch" aria-label="Language">'
            f'<a href="{path}" data-language="en" lang="en" hreflang="en" aria-label="English" aria-current="page">EN</a>'
            f'<a href="/ms{path}" data-language="ms" lang="ms" hreflang="ms" aria-label="Bahasa Melayu">BM</a>'
            '</nav>'
        )
        source = source.replace('<div class="header-actions">', '<div class="header-actions">' + switch, 1)
        source = source.replace(
            '</nav></details>',
            '<button type="button" class="terminal-trigger" data-open-terminal aria-haspopup="dialog" hidden>/ terminal</button></nav></details>', 1,
        )
    return source


class MalayPage(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.missing = set()

    def translate(self, text):
        key = re.sub(r"\s+", " ", text).strip()
        if key in COPY:
            start = re.match(r"\s*", text).group()
            end = re.search(r"\s*$", text).group()
            return start + COPY[key] + end
        if re.search(r"[A-Za-z]", key) and key not in UNCHANGED:
            self.missing.add(key)
        return text

    def start(self, tag, attrs, self_closing=False):
        original = dict(attrs)
        updated = dict(attrs)
        if tag == "html":
            updated["lang"] = "ms"
        for attr in ("aria-label", "placeholder", "title"):
            if attr in updated:
                updated[attr] = self.translate(updated[attr])
        if "data-language" in updated:
            updated.pop("aria-current", None)
            if updated["data-language"] == "ms":
                updated["aria-current"] = "page"
        elif "href" in updated:
            href = updated["href"]
            if href.startswith("/") and not href.startswith(("//", "/assets/")):
                updated["href"] = "/ms" + href
            elif updated.get("rel") == "canonical":
                updated["href"] = href.replace(ORIGIN + "/", ORIGIN + "/ms/", 1)
        if tag == "meta":
            kind = updated.get("property", updated.get("name"))
            if kind in ("description", "og:title", "og:description"):
                updated["content"] = self.translate(updated["content"])
            elif kind == "og:url":
                updated["content"] = updated["content"].replace(ORIGIN + "/", ORIGIN + "/ms/", 1)
            elif kind == "og:locale":
                updated["content"] = "ms_MY"
            elif kind == "og:locale:alternate":
                updated["content"] = "en_MY"
        if updated == original:
            self.parts.append(self.get_starttag_text())
        else:
            rendered = "".join(" " + k + ("" if v is None else '="' + escape(v, quote=True) + '"') for k, v in updated.items())
            self.parts.append("<" + tag + rendered + ("/>" if self_closing else ">"))

    def handle_starttag(self, tag, attrs):
        self.start(tag, attrs)

    def handle_startendtag(self, tag, attrs):
        self.start(tag, attrs, True)

    def handle_endtag(self, tag):
        # HTML parsing adjusts SVG names back to their canonical case.
        self.parts.append("</" + tag + ">")

    def handle_data(self, data):
        self.parts.append(escape(self.translate(data), quote=False))

    def handle_comment(self, data):
        self.parts.append("<!--" + data + "-->")

    def handle_decl(self, decl):
        self.parts.append("<!" + decl + ">")


def main():
    output = {}
    missing = set()
    for page in PAGES:
        source = prepare_english((ROOT / page).read_text(encoding="utf-8"), page)
        parser = MalayPage()
        parser.feed(source)
        parser.close()
        missing.update(parser.missing)
        output[page] = source
        output["ms/" + page] = "".join(parser.parts)
    if missing:
        raise SystemExit("Missing Malay translations:\n" + "\n".join(sorted(missing)))
    output["assets/translations.js"] = (
        "/* Generated by scripts/build-locales.py; edit translations/ms.json. */\n"
        "window.PORTFOLIO_TRANSLATIONS = Object.freeze(" + json.dumps(DATA["ui"], ensure_ascii=False, indent=2) + ");\n"
    )
    for name, content in output.items():
        path = ROOT / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8", newline="\n")
    print(f"Generated {len(PAGES)} Malay pages, language links and interactive translations.")


if __name__ == "__main__":
    main()
