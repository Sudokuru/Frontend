# Release-note date menu keyboard focus race (resolved by inline filters)

Investigated October 31, 2026 🎃. Work continues from `designs/design-5-view` on
`fix/release-notes-date-menu-focus`, independently of the previous PR.

> **Resolution (November 1, 2026):** the release-note filters no longer use
> Paper menus at all; they expand inline beneath the filter row. See
> [release-notes-inline-filters.md](release-notes-inline-filters.md). The
> temporary focus/lifecycle patch extension described below was reverted with
> that change, along with the `.gitattributes` whitespace exemption and the
> pipeline-comment edits that accompanied it, and the Enter-key regression
> tests were retired. The upstream mount-race backport remains patched for the
> home page difficulty selector. This report is kept as the record of the
> investigation.

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

## Interim correction (reverted November 1, 2026)

The branch first kept the floating menus and addressed the race in two steps,
both superseded by the inline redesign:

1. **One floating date picker.** A single Paper Menu with year and month choices
   expanded inline below their selector buttons, only one choice section open at
   a time. This removed the unsupported nested Portal arrangement while keeping
   floating filters.
2. **Temporary Paper focus/lifecycle patch.** `patches/react-native-paper+5.15.3.patch`
   carried a local extension alongside the upstream hidden-mount backport:
   capturing browser focus at the start of each opening, focusing the first
   control only if focus had not moved and was not already inside the menu,
   identifying each show/hide operation so stale callbacks could not affect a
   newer cycle, ignoring queued operations that disagreed with current
   visibility or ran after unmounting, and clearing the internal shown flag when
   hiding began. The hide cleanup remained independent of the animation's
   `finished` flag.

When the release-note filters moved to inline sections, the page stopped using
`Menu` entirely, this failure mode became unreachable on the page, and the
extension was reverted from the patch file. The extension was never an
upstream-approved fix; nothing needs to be reassessed upstream for its removal.
The remaining patch content is solely the mount-race backport, which the home
page difficulty selector still requires.

## Regression coverage (retired with the popup UI)

The branch added Enter-key coverage for retained-month year selection and
keyboard month selection, closing, and reopening for both date boundaries,
plus checks for opening focus, restoring focus after Escape, preserving focus
on the activated year option, and reopening during dismissal. That coverage
guarded the patched menu animations; with no menus and no animations on the
page, the equivalent user-visible guarantees (retained month on year-only
change, boundary-disabled months, committed values on re-expansion) are covered
by plain-interaction tests in `e2e/web/specs/releasenotes.spec.ts`. See
[release-notes-inline-filters.md](release-notes-inline-filters.md).
