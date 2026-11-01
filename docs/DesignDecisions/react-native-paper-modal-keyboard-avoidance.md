# React Native Paper Modal keyboard avoidance (component-level fix)

Investigated October 31, 2026 🎃, after review of the home page redesign (#406)
reported that the shortcut library sheet is obscured by the software keyboard on
iPhone, with the report manually verified on device.

## Symptoms

With the shortcut library open and the on-screen keyboard raised by its search
field, the bottom-aligned sheet stays docked behind the keyboard. On a short
result list, such as a single search match, the input and the result are both
obscured, so the feature is unusable without dismissing the keyboard first.

Two related problems were reported on the same interaction:

- The sheet does not move for the keyboard at all on iPhone.
- Tapping a visible result only dismissed the keyboard, because the results
  list used the default `keyboardShouldPersistTaps='never'`, so the press never
  reached `addShortcut`.

This is separate from the
[closed-menu mount race](react-native-paper-menu-mount-race.md), which is
resolved by a temporary Paper patch.

## Cause and evidence

`HomeShortcutLibrary` renders the sheet through Paper's `Portal`/`Modal`.
Neither component reacts to the software keyboard: Paper's `Modal` does not
subscribe to keyboard events or pad its wrapper, so a bottom-aligned sheet
stays wherever it docked.

On Android this historically appeared to work because the system resized the
window when the keyboard appeared (`adjustResize`). Edge-to-edge mode, enforced
since Android 15 and used by this app on Expo SDK 58, reports the keyboard as
an inset the application must handle, so the keyboard now covers modals there
too. On iOS the window is never resized, so it never worked.

The tap problem is React Native's default `ScrollView` behavior:
`keyboardShouldPersistTaps='never'` consumes the first tap on scrollable
children to dismiss the keyboard before any child can handle it.

## Upstream status

Verified against Paper's issue tracker on October 31, 2026 🎃:

- [Issue #4218](https://github.com/callstack/react-native-paper/issues/4218):
  modals on iOS do not respond to the on-screen keyboard. Open since December
  2023, labeled `bug`, still unresolved.
- [Issue #2172](https://github.com/callstack/react-native-paper/issues/2172):
  proposal to add a keyboard-avoidance option to `Modal`. Closed as stale in
  March 2021 without a decision.
- [Issue #5021](https://github.com/callstack/react-native-paper/issues/5021):
  the Android variant, opened 2026, caused by edge-to-edge mode removing the
  system window resize.
- [PR #5045](https://github.com/callstack/react-native-paper/pull/5045): pads
  Paper's `Modal` wrapper by the keyboard overlap, fixing #4218 and #5021.
  Open and unmerged, with no approving review yet.
- [PR #5023](https://github.com/callstack/react-native-paper/pull/5023): an
  earlier `KeyboardAvoidingView`-based approach, closed. A similar community
  patch shared in #4218 was later reported to break with long modal content,
  which overflows the top of the screen.

## Resolution

The keyboard is handled in the component rather than by patching Paper:

- `HomeShortcutLibrary` subscribes to `keyboardWillShow`/`keyboardWillHide` on
  iOS and `keyboardDidShow`/`keyboardDidHide` on Android — the same event
  selection as PR #5045 — and lifts the sheet by the keyboard height through
  the modal's bottom margin while shrinking its `maxHeight` so the top of the
  sheet stays on screen. The events never fire on web, so the layout is
  unchanged there.
- The results list sets `keyboardShouldPersistTaps='handled'` so presses reach
  `addShortcut` while the keyboard is open, while taps on empty space still
  dismiss it.

## Why not patch Paper

The existing `react-native-paper+5.15.3.patch` backports a fix that upstream
has already merged, so it disappears with the next Paper release. A keyboard
patch would be the opposite: upstream has not converged on an approach in
years, the leading PR is unmerged, and the one approach tried in the wild has
a documented failure with long content. A patch would also change behavior for
every `Modal` and `Dialog` in the app rather than just this sheet, and would
encode this app's layout decisions into a generic third-party component.

## Removal and adoption

When a Paper release includes PR #5045:

1. Verify the published source contains the fix, then update Paper and the
   lockfile.
2. Remove the keyboard tracking, bottom margin, and `maxHeight` adjustments
   from `HomeShortcutLibrary`, keeping `keyboardShouldPersistTaps='handled'`
   unless Paper's change also covers tap-through behavior.
3. Verify on iPhone and Android that the sheet clears the keyboard with short
   and long result lists, and that adding a result with the keyboard open
   still works on the first tap.
