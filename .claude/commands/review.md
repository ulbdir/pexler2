---
description: Review code for quality, patterns, bugs, and improvements
---

# Code Review

Review $ARGUMENTS in the context of this project (a Vue 3 + TypeScript pixel art editor).

Evaluate:

1. **Correctness**: Logic errors, edge cases, off-by-one errors
2. **TypeScript**: Proper typing, no unsafe casts, no `any`
3. **Vue patterns**: Correct use of reactivity, composables, lifecycle hooks
4. **Performance**: Unnecessary re-renders, memory leaks, inefficient algorithms
5. **Security**: XSS, injection, unsafe user input handling
6. **Code clarity**: Naming, structure, single responsibility

For each issue found, provide:
- File path and line number
- Severity (bug / warning / suggestion)
- Brief explanation
- Concrete fix

If no arguments are provided, review all recent uncommitted changes using `git diff`.
