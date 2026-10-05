# Contributing

Thanks for your interest in improving Payback Helper Script! This document describes how changes get into `main`.

## Workflow

1. Create a branch from `main` named `<type>/<short-kebab-description>`, e.g. `fix/stuck-loading-state` or `feat/progress-bar`.
2. Make your changes and commit them following the [commit conventions](#commit-messages).
3. Open a pull request against `main` and fill in the PR template.
4. CI must pass and all review conversations must be resolved before merging.
5. PRs are merged with **squash merge** only. The PR title becomes the commit subject on `main`.

`main` is protected: direct pushes, force pushes and branch deletion are disabled for everyone, including admins.

## Commit messages

This project follows [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).

```
<type>(<optional scope>): <subject>

<optional body>

<optional footer(s)>
```

**Types**

| Type       | Use for                                                    |
| ---------- | ---------------------------------------------------------- |
| `feat`     | A new user-facing feature                                  |
| `fix`      | A bug fix                                                  |
| `docs`     | Documentation only (README, CONTRIBUTING, comments)        |
| `style`    | Formatting, whitespace; no behavior change                 |
| `refactor` | Code change that neither fixes a bug nor adds a feature    |
| `perf`     | Performance improvement                                    |
| `test`     | Adding or fixing tests                                     |
| `build`    | Build tooling, dependencies                                |
| `ci`       | CI configuration (`.github/workflows`)                     |
| `chore`    | Repository maintenance that does not fit any type above    |
| `revert`   | Reverting a previous commit                                |

**Scopes** (optional): `activation`, `ui`, `metadata`, `repo`.

**Rules**

- Write in English, in the imperative mood: "add", not "added" or "adds".
- Subject line: at most 72 characters, lowercase first letter, no trailing period.
- Separate the body from the subject with a blank line; explain *what* and *why*, not *how*.
- Mark breaking changes with `!` after the type/scope and a `BREAKING CHANGE:` footer.
- Reference issues in the footer: `Closes #12`.

**Examples**

```
feat(ui): show remaining coupon count on the floating button
fix(activation): wait for MUI loading state to clear before next click
docs: add installation instructions for Violentmonkey
chore(metadata)!: rename script file to payback-helper.user.js
```

## Pull requests

- **Title**: must follow the same Conventional Commits format (checked by CI).
- **Scope**: one logical change per PR; keep unrelated refactors separate.
- **Description**: fill in the template: summary, changes, how you tested it.
- **Testing**: there is no automated browser test, so describe your manual test on `https://www.payback.de/coupons`.

## Versioning

The script uses [Semantic Versioning](https://semver.org/) through the `@version` metadata key. Tampermonkey only offers an update when `@version` increases, so any PR that changes the script's behavior **must** bump it:

- **MAJOR**: breaking change in behavior or a changed `@match` scope
- **MINOR**: new feature
- **PATCH**: bug fix or metadata-only change

Do not change `@name` or `@namespace`: userscript managers use them to identify the script, and changing them makes existing installs appear as a separate script.

## Local checks

```sh
node --check payback-helper.user.js
```
