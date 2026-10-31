# Release-note date menu keyboard focus race

Investigated October 31, 2026. Work continues from `designs/design-5-view` on
`fix/release-notes-date-menu-focus`, independently of the previous PR.

## Symptoms

After the Paper mount fix, the targeted home page and release-note run passed
215 of 217 tests. The remaining failures were the retained-month year-selection
test on WebKit and Mobile Safari:

```text
Expected: Start Date: March 2026
Received: Start Date: March 2025
```

The test selects March 2025, reopens the start-date menu, opens its year choices,
and activates 2026 with Enter. Clicking the year or activating it after the
opening animations settle succeeds. CI passing does not establish that the race
is absent; different execution timing can avoid it.

## Cause and evidence

`DateFilterMenu.tsx` rendered year and month choices as Paper menus nested inside
an outer Paper menu. Each menu independently runs opening animations and focuses
its first focusable element when an opening animation completes.

Browser event diagnostics captured this sequence:

1. The 2026 year option receives focus and Enter `keydown`.
2. The outer menu's opening callback focuses its Close button.
3. Enter `keyup` reaches the Close button rather than the year option.
4. React Native Web's PressResponder does not invoke the year option's `onPress`,
   because the keyup target differs from its recorded keydown responder.
5. The filter correctly retains the previously selected March 2025 value; the
   new year was never activated.

The relevant implementations are Paper's `focusFirstDOMNode()` and opening
animation callback in `Menu/Menu.tsx`, and React Native Web's keyboard responder
in `modules/usePressEvents/PressResponder.js`.

This is not the
[closed-menu mount race](react-native-paper-menu-mount-race.md), whose upstream
backport remains necessary. Here, a genuinely opening menu moves focus away from
an option the user is already activating.

## Controlled version comparison

The diagnostic comparison swapped only Paper's published Menu implementation in
the browser response, keeping the rest of the application and dependencies the
same. It compared `5.14.5` with `5.15.3` plus the existing mount patch, alternating
version order over eight repetitions per condition in Chromium and WebKit.

| Immediate Enter | 5.14.5 Menu | Patched 5.15.3 Menu |
| --------------- | ----------- | ------------------- |
| Chromium        | 8/8 passed  | 8/8 passed          |
| WebKit          | 8/8 passed  | 6/8 passed          |

Both WebKit failures captured the focus change between keydown and keyup. With
a diagnostic 600 ms pause before Enter, patched `5.15.3` passed all 16 trials.
The older Menu's delayed trials instead lost the menu before activation in both
browsers, so they cannot establish healthy behavior for the older version.

The comparison supports an upgrade-related timing regression, but is not a full
application downgrade or proof that the older version never had related races.
No response interception or artificial pauses are retained in the tests.

## Upstream status

A read-only search of Paper issues, PRs, and broader web results did not find an
exact report or confirmed fix for this parent-menu keydown/keyup race.

- [Issue #3940](https://github.com/callstack/react-native-paper/issues/3940):
  a different nested-menu rendering failure. A
  [maintainer comment](https://github.com/callstack/react-native-paper/issues/3940#issuecomment-1612757564)
  explains that Menu was not designed for submenus; sibling menus with separately
  positioned anchors were suggested as a workaround.
- [Issue #4977](https://github.com/callstack/react-native-paper/issues/4977):
  Menu modernization work explicitly lists missing submenu support.
- [PR #2541](https://github.com/callstack/react-native-paper/pull/2541): an open,
  unmerged proposal to make opening and closing focus behavior configurable;
  not a confirmed fix for this failure.
- [PR #5139](https://github.com/callstack/react-native-paper/pull/5139): the
  separate hidden-mount fix already backported locally, not a nested-menu fix.
- [Issue #4754](https://github.com/callstack/react-native-paper/issues/4754) and
  [issue #4763](https://github.com/callstack/react-native-paper/issues/4763):
  related visibility/animation races, but not this keyboard focus sequence.
  [PR #5051](https://github.com/callstack/react-native-paper/pull/5051) proposes
  clearing the rendered flag before hiding; it is unmerged and is not a complete
  fix for the focus race.

Nothing was reported, commented on, or submitted upstream during this work.

## Local correction

### One floating date picker

Use a single Paper Menu with year and month choices expanded inline below their
selector buttons. Only one choice section is open at a time. This removes the
unsupported nested Portal arrangement while keeping floating filters. The other
filter controls are not redesigned, and normal menu animations remain enabled.

An initial application workaround stabilized the anchor through context and
memoization. That workaround was removed in favor of fixing the library's delayed
callbacks. Application components no longer need to preserve anchor identity to
avoid focus being stolen during a selection.

Preserve the existing behavior:

- A year-only change applies the retained month when it exists and is allowed.
- An unavailable month falls back to an available draft month without committing
  an invalid date.
- Disabled months still enforce the start/end date boundaries.
- Choosing a month applies the date and closes the menu.
- Reopening reflects the selected year and month.
- The year choices stay expanded after a selection so keyboard focus remains on
  the activated option; switching to month choices replaces the inline list.
  Closing after a month selection returns focus to the date-filter button.

### Temporary Paper focus/lifecycle patch

`patches/react-native-paper+5.15.3.patch` includes a local extension alongside the
upstream hidden-mount backport. It covers source, CommonJS, and ES module builds.
The local extension is not an upstream-approved fix or a released backport.

- Capture browser focus at the start of each opening, not on each rerender.
- On successful opening completion, focus the first control only if focus has
  not moved since opening and is not already inside the menu. A user's keyboard
  or pointer interaction must take precedence over delayed autofocus.
- Identify each show/hide operation so stale measurements, animation-frame work,
  and completion callbacks cannot change a newer visibility cycle.
- Ignore queued operations that disagree with the current visibility or run
  after unmounting.
- Clear the internal shown flag when hiding begins so a quick reopening can
  start a new show operation. A previous hide callback cannot then remove it or
  restore focus to its trigger.

The hide cleanup remains independent of the animation's `finished` flag, preserving
the native reopening fix. Focus code remains web-only; native platforms still
need manual verification because the lifecycle guards also affect native
animations.

The existing root `postinstall` and explicit CI patch steps apply this combined
patch. We are waiting for compatible upstream releases to cover both the mount
fix and the locally corrected behavior. Reassess each part independently: an
upstream release containing #5139 alone is not sufficient to remove the focus
extension. Do not remove `patch-package` or the CI steps while either fix is still
needed.

## Regression coverage and verification

Keep the original Enter-key test in `e2e/web/specs/releasenotes.spec.ts` unchanged.
Additional coverage checks retained-month end-year selection with Enter and
keyboard month selection, closing, and reopening for both date boundaries. It also
checks normal opening focus, restoring focus after Escape, preserving focus on
the activated year option, and reopening during dismissal. Reuse the existing
page-object locators; do not replace Enter with clicks or add sleeps.

Before the UI change, the original retained-month test failed in all three
repeated WebKit runs. Removing the anchor workaround also reproduced focus loss
after year activation and failure to focus the reopened menu during dismissal.
The initial combined patch passed all six focused WebKit lifecycle/keyboard
checks without the application workaround.

Run the home page and release-note specs across all browser projects, repeat the
keyboard cases, and check the picker manually in Expo Go before merging. The full
application suite remains a separate final check.
