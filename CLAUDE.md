╭─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ Edit file                                                                                                                               │
│ ╭─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮ │
│ │ .claude/CLAUDE.md                                                                                                                   │ │
│ │                                                                                                                                     │ │
│ │   15    │   ├── src/                                                                                                                │ │
│ │   16    │   ├── tests/                                                                                                              │ │
│ │   17    │   ├── public/                                                                                                             │ │
│ │   18 +  │   ├── FrontenOG.md   # Frontend development log                                                                           │ │
│ │   19    │   └── package.json                                                                                                        │ │
│ │   20    ├── backend/           # All backend code and services                                                                      │ │
│ │   21    │   ├── src/                                                                                                                │ │
│ │   22    │   ├── tests/                                                                                                              │ │
│ │   23    │   ├── config/                                                                                                             │ │
│ │   24 +  │   ├── BackendLOG.md   # Backend development log                                                                            │ │
│ │   25    │   └── package.json                                                                                                        │ │
│ │   26 -  ├── docs/              # Documentation only if essential                                                                    │ │
│ │   26 +  ├── docs/              # Project-wide documentation                                                                         │ │
│ │   27 +  │   ├── ARCHITECTURE.md   # System architecture and design decisions                                                        │ │
│ │   28 +  │   └── PLANNING.md       # Project roadmap and planning                                                                    │ │
│ │   29 +  ├── CLAUDE.md          # Project-specific Claude instructions                                                               │ │
│ │   30    ├── .gitignore                                                                                                              │ │
│ │   31    ├── README.md                                                                                                               │ │
│ │   32    └── docker-compose.yml # If using Docker                                                                                    │ │
│ │   33    ```                                                                                                                         │ │
│ │   34                                                                                                                                │ │
│ │   35 +  ### Required Documentation Files                                                                                            │ │
│ │   36 +  Every project MUST include these markdown files:                                                                            │ │
│ │   37 +                                                                                                                              │ │
│ │   38 +  1. **CLAUDE.md** (project root)                                                                                             │ │
│ │   39 +     - Project-specific instructions for Claude                                                                               │ │
│ │   40 +     - Links to other documentation files                                                                                     │ │
│ │   41 +     - Override global standards if needed                                                                                    │ │
│ │   42 +                                                                                                                              │ │
│ │   43 +  2. **docs/ARCHITECTURE.md**                                                                                                 │ │
│ │   44 +     - System design and structure                                                                                            │ │
│ │   45 +     - Technology choices and rationale                                                                                       │ │
│ │   46 +     - Data flow and integrations                                                                                             │ │
│ │   47 +     - Update when making structural changes                                                                                  │ │
│ │   48 +                                                                                                                              │ │
│ │   49 +  3. **docs/PLANNING.md**                                                                                                     │ │
│ │   50 +     - Current sprint goals                                                                                                   │ │
│ │   51 +     - Feature roadmap                                                                                                        │ │
│ │   52 +     - Technical debt tracking                                                                                                │ │
│ │   53 +     - Update at sprint boundaries                                                                                            │ │
│ │   54 +                                                                                                                              │ │
│ │   55 +  4. **frontend/CHANGELOG.md**                                                                                                │ │
│ │   56 +     - Frontend feature additions                                                                                             │ │
│ │   57 +     - UI/UX improvements                                                                                                     │ │
│ │   58 +     - Bug fixes and optimizations                                                                                            │ │
│ │   59 +     - Update after each feature completion                                                                                   │ │
│ │   60 +                                                                                                                              │ │
│ │   61 +  5. **backend/CHANGELOG.md**                                                                                                 │ │
│ │   62 +     - API changes and additions                                                                                              │ │
│ │   63 +     - Database schema updates                                                                                                │ │
│ │   64 +     - Performance improvements                                                                                               │ │
│ │   65 +     - Update after each feature completion                                                                                   │ │
│ │   66 +                                                                                                                              │ │
│ │   67    ### File Organization Rules                                                                                                 │ │
│ │   68    - Keep related files together (components with their tests, styles, and utilities)                                          │ │
│ │   69    - No scattered configuration files - centralize in appropriate directories