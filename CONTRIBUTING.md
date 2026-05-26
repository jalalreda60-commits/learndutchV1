# Contributing to SnowB German AI

Thank you for considering contributing! 🎉

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/snowb-german-ai`
3. Install dependencies: `npm install`
4. Copy env file: `cp .env.example .env` and fill in values
5. Start dev server: `npm start`

## Development Workflow

```bash
# Before committing, always run:
npm run validate   # type-check + lint + format-check

# Auto-fix lint issues:
npm run lint:fix

# Auto-format code:
npm run format
```

## Pull Request Guidelines

- One feature/fix per PR
- PRs must pass all CI checks (TypeScript, ESLint, tests)
- Add tests for new features when possible
- Follow commit convention: `feat:`, `fix:`, `docs:`, `refactor:`
- Update README if you change behaviour

## Reporting Issues

Use GitHub Issues. Include:
- Device/OS info
- Steps to reproduce
- Expected vs actual behaviour
- Screenshots if relevant

## Code Style

- TypeScript strict mode — no `any` without comment
- Functional components only (no class components)
- Named exports preferred over default exports (except screens/App)
- Theme values from `src/utils/theme.ts` — no hardcoded colors
