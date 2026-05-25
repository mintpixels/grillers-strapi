# Agent Notes: Strapi Repo

Canonical full-project repo guide:

```text
/Users/aviswerdlow/coding/grillerspride/Agents.md
```

This repository is `mintpixels/grillers-strapi`. It owns Strapi CMS schemas, content APIs, editorial content, factual product metadata, and Strapi media/assets.

Before editing, run:

```bash
git status --short
git branch --show-current
git remote -v
```

Do not assume this repo is on `main`; local work is often on a feature branch.

Common checks:

```bash
yarn develop
yarn build
yarn start
```

Runtime note:

- Strapi declares Node `>=18 <=22`. Use a compatible Node version before treating build failures as code failures.

Critical contracts:

- Keep content schemas editor-friendly.
- Use draft/publish for launch-sensitive content.
- Customer-facing facts should be stored here when content-managed.
- Store generated recipe/PDP/footer imagery in Strapi assets.
- Do not move structural UX wholesale into the CMS.
- QuickBooks item SKU/name is mutable and may change for seasonal sorting. If Strapi stores or references QuickBooks-backed product metadata, treat QuickBooks `ListID`/item hex (`qbd_list_id`) as the stable identity and SKU as display/search/fallback data only.
- Customer-facing copy should not expose QuickBooks accounting names, list IDs, or seasonal `Y`/`P` sorting prefixes unless the business explicitly wants that wording shown to customers.
