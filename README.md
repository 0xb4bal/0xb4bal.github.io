# portfolio-site

Static hand-built portfolio site (no frameworks, no CDNs, no trackers, no build step). Lives in its own
git repo so the Obsidian vault stays a vault.

## Where it goes

Repo: **`0xb4bal.github.io`** (a *user site* repo — it serves at the domain root).

Using the user-site repo rather than a project repo is deliberate: your existing project site
(`godmode` → `0xb4bal.github.io/godmode`) keeps working under the same domain, and nothing has to be
moved. If you later set a custom domain, set it **only** on this repo, never on a project repo.

The repo must be **public** — on the Free plan, Pages only publishes from public repositories.

## Publish — exact steps

You have `git` but **no `gh` CLI** and no local git repos, so this is the git + personal-access-token route.

```bash
# 0. Preview locally first (absolute paths need a server, not file://)
cd "$HOME/portfolio-site"
python -m http.server 8000        # then open http://localhost:8000

# 1. Git identity + credential storage (one time)
git config --global user.name  "Muhammed Iqbal Hamdzan"
git config --global user.email "your-github-email@example.com"
git config --global credential.helper store

# 2. Create the repo on GitHub (web UI): name it exactly 0xb4bal.github.io, Public, no README
# 3. Init and push (this first push prompts for username + token)
cd "$HOME/portfolio-site"
git init -b main
git add -A
git commit -m "portfolio: initial site"
git remote add origin https://github.com/0xb4bal/0xb4bal.github.io.git
git push -u origin main
```

When it prompts for a password, paste a **personal access token**, not your GitHub password:

1. https://github.com/settings/tokens → *Generate new token (classic)*
2. Scopes: `repo` (add `workflow` only if you later add Actions)
3. Expiry: 90 days is fine. Copy it — it is shown once.

## Turn on Pages

1. Repo → **Settings → Pages**
2. Source: **Deploy from a branch** → Branch: `main` → folder `/ (root)` → **Save**
3. Live in about a minute at `https://0xb4bal.github.io`

## Custom domain

1. Buy/keep the domain, then in **Settings → Pages → Custom domain** enter the apex domain
   (e.g. `yourdomain.com`) and **Save**. GitHub offers to commit a `CNAME` file — accept it.
2. At your registrar / DNS provider, point the apex at GitHub Pages (values verified against the
   GitHub Pages docs, Sep 2026):

   | Type | Name | Value |
   |---|---|---|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | AAAA | `@` | `2606:50c0:8000::153` |
   | AAAA | `@` | `2606:50c0:8001::153` |
   | AAAA | `@` | `2606:50c0:8002::153` |
   | AAAA | `@` | `2606:50c0:8003::153` |
   | CNAME | `www` | `0xb4bal.github.io` |

   The AAAA records are optional (IPv6). Do **not** add wildcard records (`*.yourdomain.com`) —
   GitHub's docs warn against them.
3. Back in **Settings → Pages**, wait for *DNS check successful*, then tick **Enforce HTTPS**.
   Propagation is usually minutes, can be up to 24 hours.

**Subdomain instead of apex?** Then skip the A/AAAA records and just add
`CNAME  portfolio → 0xb4bal.github.io`, and enter `portfolio.yourdomain.com` as the custom domain.

## Editing workflow

```bash
cd "$HOME/portfolio-site"
# edit files
git add -A && git commit -m "what changed" && git push
```

Pages rebuilds automatically. No build step, no dependencies, nothing to install.

## Content rules (non-negotiable)

1. **Nothing derived from employer or client incidents is published here.** Not anonymised, not IOC-free.
   Public content is lab-derived only. Anonymised real cases live in the private interview portfolio
   (`Hermes/10-Security/case-writeup-playbook.md`).
2. Naming your employer as *employment* is fine (it is already on LinkedIn). Naming a **client** is not —
   `about.html` says "a central bank", and that is the level of detail to keep.
3. Before publishing anything incident-flavoured, run the checker:
   `python "$HOME/Hermes/70-Projects/case-writeup-tools/defang.py" check <file>`
4. No invented metrics. If a number appears on the site, it came from a measurement.

## Files

| File | Contents |
|---|---|
| `index.html` | hero, what I do, current focus, daily stack |
| `about.html` | bio, experience, certs, how I work, private case portfolio note |
| `notes/index.html` | detection notes index (one published, rest clearly labelled in-progress) |
| `notes/ioc-enrichment-workflow.html` | the one real note: enrichment order + honest tool limitation |
| `projects.html` | GitHub projects with real repo links |
| `404.html` | not-found page |
| `assets/style.css` | the entire design; one file, no preprocessor |
| `.nojekyll` | stops Jekyll touching the files |

`CNAME` is intentionally **not** in the repo yet — a wrong CNAME breaks the `0xb4bal.github.io` URL.
It gets created by GitHub when you set the custom domain.

## Next steps

- [ ] Push and confirm `https://0xb4bal.github.io` loads
- [ ] Set the custom domain + DNS records, enforce HTTPS
- [ ] GitHub profile: add a bio and set **Website** to the new domain (currently blank — free credibility)
- [ ] LinkedIn: add the site as the profile website; add "Detection Engineering" to Projects only when the
      lab is live and rules exist
- [ ] Add a CV PDF at `/cv.pdf` and link it from `about.html` when you have one
- [ ] Publish note #2 only after the rule exists and has been tested
