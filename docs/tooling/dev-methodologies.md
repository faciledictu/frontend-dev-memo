---
sidebar_position: 5
description:
  SDLC stages, Waterfall vs Agile, Scrum roles and events, Kanban, Scrum vs
  Kanban
---

# Development Methodologies

The **SDLC** (software development life cycle) is the sequence of stages a
product goes through: planning, requirements, design, implementation, testing,
deployment, maintenance. **Waterfall** goes through them once, in order, which
suits fixed and well-known requirements. **Agile** repeats them in short
iterations and adapts the plan to feedback. **Scrum** and **Kanban** are the two
most common ways to practice Agile: Scrum works in fixed-length **sprints** with
defined roles and events, Kanban is a **continuous flow** of tasks on a board
with limits on work in progress.

## Details

### Waterfall vs Agile

|              | Waterfall                                    | Agile                                                |
| ------------ | -------------------------------------------- | ---------------------------------------------------- |
| Process      | Stages in sequence, each completed once      | Short iterations, each through all stages            |
| Requirements | Fixed up front                               | Change between iterations                            |
| Feedback     | At the end                                   | After every iteration                                |
| Testing      | A late separate stage                        | Continuous, from the start ("shift left")            |
| Strengths    | Predictable plan, budget and documentation   | Adapts to change, early value, issues found early    |
| Weaknesses   | Changes are expensive, problems surface late | Scope is harder to fix, needs constant collaboration |

**Shift-left testing** means moving testing earlier in the cycle: defects found
during development are cheaper to fix than after release.

### Scrum

Per the Scrum Guide (2020 edition):

- **Roles** (accountabilities): **Product Owner** (orders the Product Backlog,
  maximizes value), **Scrum Master** (helps the team follow Scrum, removes
  impediments), **Developers** (build the increment).
- **Events**: the **Sprint** (up to a month, usually 2 weeks) contains **Sprint
  Planning**, the **Daily Scrum** (15 minutes), the **Sprint Review** (the
  increment shown to stakeholders) and the **Sprint Retrospective** (how to work
  better).
- **Artifacts**: Product Backlog, Sprint Backlog, Increment.
- Estimation is not prescribed by the guide; teams often use **story points**
  (relative effort) and planning poker.

### Kanban

- A board with columns for workflow stages (To Do → In Progress → Review →
  Done).
- **WIP limits**: a column can hold only N tasks, so the team finishes work
  before starting new work.
- No fixed iterations or roles; tasks are pulled when there is capacity.
- Measured by **lead time** (request to done) and **cycle time** (start to
  done).

### Scrum vs Kanban

|             | Scrum                                   | Kanban                                       |
| ----------- | --------------------------------------- | -------------------------------------------- |
| Cadence     | Fixed sprints                           | Continuous flow                              |
| Roles       | Product Owner, Scrum Master, Developers | Not prescribed                               |
| Changes     | Not into a running sprint (as a rule)   | Any time, by reordering the queue            |
| Limits work | By sprint capacity                      | By WIP limits per column                     |
| Fits        | Product development with planning       | Support, operations, a stream of small tasks |

## Follow-up Questions

- What is velocity? The amount of work (in story points) a team completes per
  sprint; used to plan the next sprints, not to compare teams.
- What is the Definition of Done? A shared checklist an increment must meet:
  reviewed, tested, documented, deployed to staging.

## Common Mistakes

- Calling Agile a methodology: it is a set of values and principles (the Agile
  Manifesto); Scrum and Kanban are ways to apply them.
- "Development Team" and "ceremonies": the 2020 Scrum Guide says Developers and
  events.

## See Also

- [CI/CD](./ci-cd.md)
- [Code Review](./code-review.md)
