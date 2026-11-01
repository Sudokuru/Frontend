# Release-note filters expand inline instead of opening popup menus

Decided November 1, 2026, while fixing the release-note date-menu focus race
on `fix/release-notes-date-menu-focus`.

## Context

The five release-note filters (Targets, Categories, Contributors, Start Date,
End Date) were react-native-paper `Menu` popups anchored to buttons in the
FlatList header. Three reliability investigations traced failures to the popup
pattern itself, not to any single bug:

- [Closed-menu mount race](react-native-paper-menu-mount-race.md): mounting a
  closed menu runs a spurious hide that can remove a freshly opened menu, and
  it steals focus to the anchor, scrolling the virtualized list. Fixed by
  backporting upstream PR #5139 through `patch-package`.
- [Date-menu keyboard focus race](release-notes-date-menu-keyboard-focus.md):
  opening animations moved focus between Enter `keydown` and `keyup`, so WebKit
  dropped year activations. Fixed by collapsing the choices into one menu and a
  local, non-upstream patch extension.
- [Menu reopening failure](react-native-paper-menu-reopen.md): fixed by the
  Paper 5.15.3 upgrade.

Quirks that remained were inherent to the popup pattern: an open menu does not
follow its anchor when the list scrolls, switching between the five menus
takes two clicks because the first click only dismisses the previous menu's
fullscreen overlay, and clicks pass through to the page during the close
animation. All fixes lived in `node_modules` through `patch-package`, so any
install that skipped the postinstall hook silently reintroduced the races.

## Decision

Filters now expand inline beneath the filter row, in normal layout flow:

- Only one filter section is expanded at a time (accordion). Expanding a
  section collapses the previous one, and the toggle button reports its state
  through `accessibilityState.expanded`.
- Selecting an option in a multi-select section keeps the section open so
  several chips can be picked in a row. A month selection in a date section
  applies the date and collapses the section.
- Sections stay expanded while the list scrolls; they are list-header content
  and move with it.
- Date sections show year chips and month chips together. The previous
  year → month drill-down existed only to keep the choices inside a single
  Paper menu so opening animations could not compete for keyboard focus;
  inline, the flat layout is simpler and has no animations at all.

`ReleaseNotesFilter` owns the single `expandedFilter` state. Selection state
stays in `ReleaseNotesPage`, unchanged. `MultiSelectFilterMenu` and
`DateFilterMenu` were replaced by `MultiSelectFilterPanel`, `DateFilterPanel`,
and `FilterToggleButton`.

No portals, position measurement, open/close animations, or fullscreen
dismissal overlays are involved, so the documented menu races and the quirks
above no longer apply to this page.

## Behavior preserved

- A year-only change applies the retained month when it exists and is allowed.
- Months that violate the start/end date boundary stay disabled.
- Re-expanding a date section reflects the committed year and month.
- The Clear button, per-filter labels, and selection counters behave as
  before.

## Patch status

The release-notes page no longer uses Paper `Menu`. The local focus/lifecycle
extension that this branch added to `patches/react-native-paper+5.15.3.patch`
was reverted as part of this change. The upstream mount-race backport remains
in the patch and is still required by the home page difficulty selector; see
[the mount-race report](react-native-paper-menu-mount-race.md) for its
removal conditions.

## Regression coverage

`e2e/web/specs/releasenotes.spec.ts` covers expansion and collapse for all
five sections, accordion behavior, multi-select filtering with sections
staying open across selections, inclusive date-range filtering, disabled
boundary months, retained-month year changes, committed values persisting on
re-expansion, and the Clear button. The popup-era Enter-keyboard tests were
retired with the component they guarded: their failure mode
(animation-driven focus changes between `keydown` and `keyup`) cannot occur
without menu animations.
