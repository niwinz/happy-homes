# Creating Commits

## Format

```text
<type>(<scope>): <subject>

<body>

<footer>
```

## Types

- `feat` — new feature
- `fix` — bug fix
- `docs` — documentation
- `style` — formatting, no code change
- `refactor` — code restructuring
- `test` — adding or updating tests
- `chore` — maintenance

## Rules

- Subject: imperative mood, lowercase, no period, at most 76 characters.
- Body: explain what and why, not how.
- Every subject, body, and footer line must be 76 characters or fewer.
- Wrap body text at 76 characters. URLs and trailers have no exemption.
- Keep one logical change per commit.

The 76-character limit is a hard rule.

## AI trailer

For AI-assisted work, add:

```text
AI-assisted-by: <model-name>
```

Use the model that made the changes, not the model that creates the commit.
Use only its model name, with no provider prefix. For example:

```text
AI-assisted-by: mimo-v2.5-pro
```

## Commit workflow

1. Commit only the files changed for the approved task.
2. Inspect the diff for secrets, debug output, generated files, and unrelated
   changes before staging.
3. Write the full message to `/tmp/opencode/commit-message`; do not depend on
   terminal wrapping or pass a full body paragraph as one `git commit -m`
   argument.
4. Run
   `./scripts/check-commit --message-file /tmp/opencode/commit-message`, then
   commit with `git commit -F /tmp/opencode/commit-message` only if the check
   passes.
5. Immediately run `./scripts/check-commit --commit HEAD` after the commit.
6. If validation fails, an agent may amend only a commit it created in the
   current session, only while it remains unpushed, and only within the
   approved scope. Reinspect the diff after each amend.
7. Never amend a pushed commit or a commit created by someone else unless the
   user explicitly asks.
