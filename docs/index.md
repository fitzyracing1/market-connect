# market-connect

market-connect is a Base44 app (Vite + React) for idea submission and market connection. Pages: Home, Login, Register, ForgotPassword, ResetPassword, OAuthConsent, Dashboard, SubmissionDetail. The Base44 entities are `IdeaSubmission` and `User`. [marketconnect](https://github.com/fitzyracing1/marketconnect) is a renamed copy for GitHub Pages, and some source files differ between the two.

## Getting started

```bash
npm install
npm install -g base44@latest
base44 dev         # local Base44 backend (+ frontend if site.serveCommand is set in base44/config.jsonc)
npm run dev        # frontend only (vite)
npm run build
npm run lint
```

## Files
`src/` (React app, `src/api/base44Client.js`), `base44/config.jsonc`, `base44/entities/*.jsonc`, plus `AGENTS.md` and `CLAUDE.md` (agent instructions).

The repo has no tests, no CI and no LICENSE file. Copyright (c) 2026 Joshua Almeida
