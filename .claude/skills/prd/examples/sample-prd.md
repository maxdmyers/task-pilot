# PRD: Recurring Availability Overrides

**Date:** 2026-02-25
**Author:** PM Team
**Status:** Draft
**GitHub Issue:** #4521

---

## Problem Statement

Users with recurring schedules (e.g., "every other Friday off") cannot express this in their availability settings. They must manually block time every two weeks, leading to missed updates and double-bookings. Power users with 50+ bookings/week report this as their top pain point.

## Value Proposition

Reduces manual calendar maintenance for recurring schedule holders. Estimated 30% reduction in "availability mismatch" support tickets. Unlocks enterprise use cases (shift workers, academic schedules, medical rotations).

## User Profiles

| Persona | Description | Pain point |
|---------|-------------|------------|
| Shift Worker | Rotates between day/night shifts biweekly | Must manually update availability every cycle |
| Academic Advisor | Office hours change by semester week | Sets incorrect availability, leading to no-shows |

## Goals

- [ ] Support recurring overrides with configurable frequency (daily, weekly, biweekly, monthly)
- [ ] Allow overrides to have start/end dates
- [ ] Surface conflicts between overrides and base availability

## Non-Goals

- Not building a full shift-management system — just availability expression
- Not changing the booking confirmation flow
- Not supporting "every 3rd Tuesday"-style complex recurrence in v1

## Proposed Solution

Add a "Recurring Override" option to the existing availability settings panel. Users define an override pattern (e.g., "unavailable every other Friday") that layers on top of their base availability. Overrides take precedence over base availability.

## User Flows

### Flow 1: Create a recurring override

1. User navigates to Availability Settings
2. Clicks "Add Override" (existing) > selects "Make Recurring" (new)
3. Configures: frequency, days, time range, start/end dates
4. Preview shows next 4 occurrences for verification
5. Saves — override appears in availability timeline with recurring icon

### Flow 2: Resolve a conflict

1. User creates an override that conflicts with an existing booking
2. System shows warning: "This override conflicts with 3 existing bookings"
3. User chooses: keep bookings, cancel bookings, or adjust override

## Success Metrics

| Metric | Current | Target | How measured |
|--------|---------|--------|-------------|
| Availability-related support tickets | 120/mo | 84/mo (-30%) | Zendesk tag |
| Manual availability edits per user/mo | 8.2 | 2.0 | Product analytics |

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Complex recurrence rules cause timezone bugs | High | High | Limit v1 to simple patterns; extensive TZ testing |
| Users create conflicting overrides | Medium | Medium | Conflict detection + resolution flow |

## Dependencies

- Calendar sync service must support override awareness
- Booking engine conflict detection API

## Open Questions

- [ ] Should overrides sync to external calendars (Google, Outlook) as blocked time?
- [ ] Max number of active recurring overrides per user?
- [ ] How do team-level overrides interact with individual ones?
