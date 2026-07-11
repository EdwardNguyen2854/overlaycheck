# Architecture Decision Records

ADRs document significant architectural choices made during development.

## When to write an ADR

Write an ADR when a decision:
- Affects the structure of the codebase in a non-obvious way
- Introduces a new library or pattern
- Changes a core concept (PDF A/B, Position Sets, etc.)
- Has trade-offs that future maintainers should understand

## When NOT to write an ADR

- Routine implementation decisions (component file location, prop naming)
- Bug fixes that don't change design
- Documentation improvements
- Minor refactors with no behavioral change

## Format

Each ADR should have:
1. **Title** with decision phrase
2. **Status** (proposed, accepted, deprecated, superseded)
3. **Context** — what forced this decision
4. **Decision** — what was chosen
5. **Consequences** — what becomes easier/harder
