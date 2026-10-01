# React + TypeScript + Vite

## Pure-text files

Put `.txt` and `.cfg` files in `public/pureTextFiles`. Files named `example.txt`
and `config.cfg` are available at `/pureText/example` and `/pureText/config`.
The route prefix is case-insensitive, so `/puretext/config` is also valid. The
extension may also be included in the URL. These URLs bypass the React page
layout and authenticated routes, and display the file contents as plain text.
If neither supported file exists, the normal React 404 page is displayed. When
both extensions exist for the same name, `.txt` takes priority.

In production, `functions/_middleware.js` handles these routes in Cloudflare
Pages before the SPA fallback and returns the file bytes with
`Content-Type: text/plain; charset=utf-8`. The local Vite server does not run
Cloudflare Pages Functions, so use a Pages-compatible local runtime when
testing the raw HTTP response locally.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## CommonServerAPI connection

Use Node.js 24 LTS (`nvm use`; React Router requires at least Node 22.22).
Run `npm ci`, `npm test`, `npm run build`, and `npm run lint` to validate changes.

Development requests default to `http://localhost:8787`; production requests default
to `https://api.246801357.xyz`. Set `VITE_API_BASE_URL` in `.env.local` before
starting Vite or building to override this URL. Use `localhost` consistently on both
local services. The API must allow the frontend origin with credentialed CORS;
production frontend and API should be HTTPS and same-site for the SameSite cookie.

Administrator sessions use the API's HttpOnly `post_auth_token` cookie. All API
requests include credentials; `/server` restores the session using
`GET /post/admin/current`. Old localStorage JWT values are ignored. Network errors
allow retry, while missing/expired sessions return to login. Logout clears the
server cookie before leaving the protected page.

Registration sends `{ email, password }`, checks the boolean availability in the
API response's `data`, and verifies `{ email, token }` through the existing
`/server/register/username/:username/:otp` email-link route. Both 200 and 201
verification responses are supported, and React StrictMode does not submit the
one-time token twice.
