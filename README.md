# Personal portfolio

Static HTML, CSS and progressive-enhancement JavaScript portfolio for SOC and detection engineering work.

- Site: https://iqbalhamdzan.xyz
- Repository: https://github.com/0xb4bal/0xb4bal.github.io
- Contact: security@iqbalhamdzan.xyz

## Preview locally

From the repository directory, run:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open http://localhost:8000. A local server is needed because the site uses root-relative links.

## Editing and publishing

Create a branch, edit the files, and open a pull request against `main`. Review the
diff for personal information and client details before merging. GitHub Pages publishes
from `main` at the repository root.

Authenticate Git using SSH or a credential manager backed by the operating system's
secure storage. If HTTPS requires a personal access token, use a fine-grained token
limited to this repository, the minimum permissions needed, and a short expiry.
Do not paste credentials into files, remote URLs, or documentation.

The custom domain is declared in `CNAME`. Manage DNS and HTTPS in the hosting settings,
following the [GitHub Pages documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Publication checklist

- Publish only lab-derived security content; exclude employer and client incident data.
- Exclude client identities and combinations of details that could identify a client,
  including posting locations, intermediaries, and precise assignment dates.
- Exclude work schedules, home-network details, private workspace paths, and internal runbooks.
- Exclude passwords, tokens, private keys, credential files, and unpublished documents.
- Inspect every staged file and the complete diff before committing.
- Keep metrics tied to measurements and label unfinished work clearly.
- Treat every file at the repository root as public: Pages packages this directory,
  including this README.
- Prefer pull requests for changes. A written workflow does not enforce review;
  repository rules must be configured separately if a review gate is required.

## Files

| File | Purpose |
|---|---|
| `index.html` | Home page |
| `about.html` | Professional background and contact |
| `projects.html` | Project links |
| `notes/index.html` | Notes index |
| `notes/ioc-enrichment-workflow.html` | Enrichment methodology |
| `404.html` | Not-found page |
| `assets/style.css` | Responsive styling and reduced-motion support |
| `assets/site.js` | Terminal navigation, page search, workflow tabs, and project filters |
| `assets/favicon.svg` | Sunset IH monogram favicon |
| `assets/iqbal-portrait.webp` | Transparent portrait used in the hero card |
| `assets/sunset-skyline.svg` | Original palm and Kuala Lumpur skyline artwork |
| `assets/fonts/` | Self-hosted Bebas Neue display font and OFL license |
| `notes/alert-to-disposition.html` | Investigation methodology |
| `assets/language.js` | EN / BM switch and remembered language choice |
| `assets/translations.js` | Generated Malay strings for dynamic messages |
| `translations/ms.json` | Malay translation dictionary |
| `scripts/build-locales.py` | Generates `ms/` pages and `assets/translations.js` |
| `ms/` | Generated Malay pages |
| `.nojekyll` | Disables Jekyll processing |
| `CNAME` | Custom domain |

No application packages, external scripts, trackers, or build tools are required. Core navigation and content work without JavaScript.

## Interface behaviour

- Press `/` for the portfolio terminal, or Ctrl/Cmd+K or the footer Search button for page search. The terminal accepts only a small set of named navigation and information commands; it never executes input as code or contacts security tools.
- The investigation walkthrough supports arrow keys, Home, and End. Without JavaScript, the full method appears as a readable list.
- Project filters separate SOC automation from personal lab and AI experiments. All projects remain visible without JavaScript.
- Animation respects the system reduced-motion setting. An explicit language preference is stored locally.
- The GTA VI-inspired sunset theme uses original palm and Kuala Lumpur skyline artwork, warm pink and peach accents, and aqua details. The identity card uses Iqbal's portrait with a transparent background; the header and favicon retain the IH monogram.
- Bebas Neue is self-hosted under the SIL Open Font License; its license is included in `assets/fonts/OFL.txt`. The artwork is in `assets/sunset-skyline.svg`. No visitor telemetry, live incident feeds, or external scripts are used.

## English and Bahasa Melayu

English pages retain their existing URLs. Malay pages live under `/ms/`, with an
EN / BM switch on every page. Switching keeps the current page, query and section.
Internal links, search results and terminal navigation stay in the selected language.
An explicit choice is remembered in `localStorage` as `iqbal-language`; a fresh visit
to the English homepage restores Malay when selected. Direct links to other pages
keep the language in their URL. If storage or JavaScript is unavailable, both sets
of static pages and their language links still work.

Edit English copy in the original HTML files and its Malay translation in
`translations/ms.json`, then regenerate and commit the output:

```sh
python scripts/build-locales.py
```

Use natural Malay for navigation and explanations, while retaining familiar English
technical terms and professional titles: SOC Analyst, Blue Team, alert triage,
threat intelligence, detection engineering, endpoint, telemetry, IOC enrichment,
false positive, and API keys. Apply the same terminology to page copy, metadata,
accessible labels, workflow steps, and terminal responses. Keep these reviewed
translations in the dictionary so the generator continues to check coverage.

The generator uses only the Python standard library. It checks every text node,
accessible label and page description, and stops on missing translations. Its
explicit `unchanged` list covers names, product names and literal terminal commands.
The `ui` dictionary also generates `assets/translations.js` for dynamic messages.
Do not edit generated `ms/` pages or `assets/translations.js` directly. Run the
generator again after changing English copy, navigation or metadata.

Commit the generated pages so GitHub Pages can publish without a build step.
Each page has a language tag, canonical URL and reciprocal English/Malay alternate
links. Shared asset URLs remain outside `/ms/`.
