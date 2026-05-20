# Publishing bolsa-de-carga-mcp to npm

## Prerequisites

- An npm account
- You are logged in via `npm login`

## Steps

```bash
# 1. Make sure you're logged in
npm login

# 2. Dry run to verify what will be published
npm publish --dry-run

# 3. Publish
npm publish --access public
```

## Verification

After publishing, verify the package is available:

```bash
npm view bolsa-de-carga-mcp
```

## Version Bumping

Before re-publishing, update the version in `package.json`:

```bash
npm version patch   # 1.0.0 → 1.0.1
npm version minor   # 1.0.0 → 1.1.0
npm version major   # 1.0.0 → 2.0.0
```

Then run `npm publish --access public` again.

## Files Published

Only the files listed in `package.json` → `files` field are published:

- `src/` — source code
- `README.md` — documentation
- `LICENSE` — MIT license
- `.env.example` — environment template

This keeps the published package small and free of development artifacts.
