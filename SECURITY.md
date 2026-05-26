# Security Policy

## Sensitive Files — Never Commit

The following files must NEVER be committed to git:

| File | Contains |
|------|---------|
| `.env` | API keys and secrets |
| `google-services.json` | Firebase config with project secrets |
| `google-play-key.json` | Google Play service account credentials |
| `*.keystore` / `*.jks` | Android signing keys |
| `*.p12` | Certificate files |

All are listed in `.gitignore`.

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Email: security@snowb.app

We will respond within 48 hours.

## API Key Rotation

If you accidentally commit a secret:
1. Immediately rotate the key in the provider's dashboard
2. Run: `git filter-repo --invert-paths --path .env` to purge history
3. Force push: `git push --force`
