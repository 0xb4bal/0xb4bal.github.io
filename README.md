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
| `assets/site.js` | Accessible page search (Ctrl/Cmd+K) |
| `.nojekyll` | Disables Jekyll processing |
| `CNAME` | Custom domain |

No application packages, external scripts, trackers, or build tools are required. Core navigation and content work without JavaScript.
