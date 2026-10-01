# post-client

Maintenance-only frontend for the server rules. `/rules` is the only page;
`/` and all retired or unknown page URLs redirect to `/rules`.

The rules content lives in `public/rules/rule.md`. The existing Markdown
rendering, table of contents, styles, and layout language selector are retained.
Administrator login, registration, management, and their client API code have
been removed. The rules page does not require an API connection or login.

## Development

Use Node.js 24 LTS (`.nvmrc`; React Router requires at least Node 22.22).

```sh
npm ci
npm run dev
```

Validate changes with `npm run build` and `npm run lint`.
