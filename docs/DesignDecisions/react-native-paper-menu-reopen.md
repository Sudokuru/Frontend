# React Native Paper native menu reopening failure

Investigated October 29, 2026, while diagnosing the home dashboard's difficulty
selector in Expo Go on iOS.

## Symptoms

The difficulty menu opened normally on the first attempt. After selecting a
difficulty, opening it again made it briefly appear and disappear. Subsequent
presses did not reopen it, even after waiting several seconds.

Diagnostics confirmed that the button continued receiving presses, but the
application's `visible` state remained `true` while the menu was absent. Updating
the difficulty and saving the preference both worked; the failure was in the
menu's internal visibility lifecycle.

## Cause and evidence

The installed `react-native-paper@5.14.5` menu synchronizes its internal `rendered`
state to the `visible` prop before its closing animation finishes. Setting
`rendered` to `false` unmounts the Portal containing the animated menu. This can
cancel the native animation before its completion handler clears `prevRendered`.

The relevant implementation is
`react-native-paper/src/components/Menu/Menu.tsx`:

- The visibility effect sets `rendered` to `false` when `visible` becomes `false`.
- The Portal is mounted only while `rendered` is `true`.
- `hide()` clears `prevRendered` only when the animation reports `finished: true`.
- `updateVisibility()` skips `show()` when `prevRendered` is still `true`.

Temporary diagnostics captured the following sequence on iOS:

1. The first opening animation completed successfully.
2. Selecting a difficulty set `visible` and `rendered` to `false`.
3. The closing animation immediately reported `finished: false`, leaving
   `prevRendered: true`.
4. Approximately one second later, the next press set `visible: true`, but Paper
   started another hide animation while `rendered` was still `false`.
5. Paper skipped showing the menu because `prevRendered` was still `true`.
6. The second hide completed and left `visible: true` with `rendered: false`.
   Further button presses called `setVisible(true)` without changing state.

Waiting before reopening did not repair the stale internal state. This was not
caused by a blocked button, a failed preference save, or the user reopening the
menu too quickly.

## Upstream status

Verified against npm metadata, published source, and GitHub during investigation:

| Version                                  | Contains the Portal lifecycle fix? |
| ---------------------------------------- | ---------------------------------- |
| `5.14.5`, installed during diagnosis     | No                                 |
| `5.15.0`                                 | No                                 |
| `5.15.1`                                 | Yes                                |
| `5.15.3`, latest stable at investigation | Yes                                |

- [PR #4845](https://github.com/callstack/react-native-paper/pull/4845): defers
  unmounting the Portal until the hide animation finishes. Its explanation
  describes the same cancellation and corrupted-state mechanism captured in our
  logs. Merged March 26, 2026.
- [Issue #4807](https://github.com/callstack/react-native-paper/issues/4807): the
  related issue linked by the fix.
- [Release 5.15.1](https://github.com/callstack/react-native-paper/releases/tag/v5.15.1):
  includes the Portal lifecycle fix. Published April 14, 2026.
- [Release 5.15.3](https://github.com/callstack/react-native-paper/releases/tag/v5.15.3):
  the stable release selected for the upgrade.

The upstream reproduction describes Android with the new architecture; our
reproduction was Expo Go on iOS. The observed internal-state failure matches the
upstream explanation.

## Resolution and verification

Upgraded `react-native-paper` from `5.14.5` to `5.15.3` in
`sudokuru/package.json` and the root `package-lock.json`. No application-level
remount workaround was added. Temporary application and dependency diagnostics
were removed.

The user verified the original selection-and-reopening flow in Expo Go after the
upgrade and confirmed that the native issue was resolved.

Added a regression test to `e2e/web/specs/home.spec.ts` that selects a difficulty,
checks the updated label and closed menu, then repeatedly reopens and selects
without reloading. It uses the existing HomePage locators and user-visible
assertions. Playwright covers the browser implementation, including mobile
browser projects; it does not exercise Expo Go's native animations. Native
verification is therefore necessary for this specific failure.
