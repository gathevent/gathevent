# Commit Message Instructions

## Overview

This project uses [Conventional Commits](https://www.conventionalcommits.org/) specification for all commit messages. We enforce these rules using commitlint with the `@commitlint/config-conventional` configuration.

## Commit Message Format

Every commit message must follow this structure:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Type (Required)

The type must be one of the following:

- **feat**: A new feature (correlates with MINOR in SemVer)
- **fix**: A bug fix (correlates with PATCH in SemVer)
- **docs**: Documentation changes only
- **style**: Code style changes (formatting, missing semicolons, etc.) that don't affect functionality
- **refactor**: Code changes that neither fix a bug nor add a feature
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **build**: Changes to build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify source or test files
- **revert**: Reverting a previous commit

### Scope (Optional)

A scope provides additional context about which part of the codebase is affected. It should be a noun in parentheses:

```
feat(api): add new endpoint
fix(parser): handle edge case
docs(readme): update installation steps
```

### Description (Required)

- Use imperative, present tense: "add" not "added" or "adds"
- Don't capitalize the first letter
- No period (.) at the end
- Keep it concise but descriptive

### Body (Optional)

- Separated from description by one blank line
- Use to explain what and why, not how
- Can be multiple paragraphs
- Wrap at 72 characters

### Footer (Optional)

- Separated from body by one blank line
- Use for breaking changes, issue references, etc.
- Format: `Token: value` or `Token #value`

## Breaking Changes

Breaking changes must be indicated in one of two ways:

1. **Using `!` after type/scope:**

   ```
   feat!: remove deprecated API endpoint
   feat(api)!: change response format
   ```

2. **Using BREAKING CHANGE footer:**

   ```
   feat: update authentication flow

   BREAKING CHANGE: API tokens must now include version prefix
   ```

Breaking changes correlate with MAJOR version bumps in SemVer.

## Examples

### Simple feature

```
feat: add user authentication
```

### Bug fix with scope

```
fix(auth): prevent token expiration edge case
```

### Feature with body

```
feat(api): add pagination to user endpoints

Implement cursor-based pagination for better performance
with large datasets. Default page size is 20 items.
```

### Breaking change with body and footer

```
feat(api)!: restructure error response format

Error responses now follow RFC 7807 Problem Details format
for better consistency and debugging.

BREAKING CHANGE: Error response structure has changed from
{ error: string } to { type, title, status, detail }
```

### Documentation update

```
docs: update API authentication examples
```

### Multiple footers

```
fix: prevent race condition in request handling

Introduce request ID tracking and dismiss outdated responses.
Remove obsolete timeout mitigations.

Reviewed-by: Jane Doe
Refs: #123
```

### Revert commit

```
revert: remove experimental feature

Refs: 676104e
```

## AI Assistant Instructions

When writing commit messages:

1. **Always** use the conventional commit format
2. **Choose the most specific type** that describes your changes
3. **Add a scope** when changes affect a specific module or component
4. **Use imperative mood** in descriptions (e.g., "add" not "added")
5. **Keep descriptions under 72 characters** when possible
6. **Add a body** for complex changes that need explanation
7. **Mark breaking changes** with `!` or `BREAKING CHANGE:` footer
8. **Reference issues** in footers using `Refs: #123` or `Closes: #123`
9. **Make atomic commits** - one logical change per commit

## Common Mistakes to Avoid

❌ `Added new feature` (wrong tense)  
✅ `feat: add new feature`

❌ `fix: Fixed the bug.` (capitalized, has period)  
✅ `fix: resolve memory leak in cache`

❌ `updated docs` (missing type)  
✅ `docs: update installation guide`

❌ `feat!changed API` (missing space after colon)  
✅ `feat!: change API response structure`

## Validation

All commits are validated using commitlint. Commits that don't follow this specification will be rejected.
