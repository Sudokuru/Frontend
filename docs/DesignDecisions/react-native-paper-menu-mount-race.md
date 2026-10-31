# React Native Paper closed-menu mount race (temporary patch)

Investigated October 31, 2026, after the full Playwright suite reported failures
in the home page's difficulty selector and release-note menus and scrolling.

## Symptoms

The local run had 2,730 tests: 2,673 passed and 57 were unsuccessful. The failures
were concentrated in these areas:

| Failures | Behavior                                              |
| -------- | ----------------------------------------------------- |
| 13       | Opening and selecting the home page difficulty        |
| 37       | Opening or interacting with release-note filter menus |
| 7        | Scrolling to older release-note content               |

Menus could appear briefly and disappear on the first opening after page load.
The application could still have `visible: true` after Paper removed the menu.
Release-note scrolling tests also failed with `Element is not attached to the DOM`.

This is separate from the
[native menu reopening failure](react-native-paper-menu-reopen.md), which was
resolved by upgrading Paper from `5.14.5` to `5.15.3`. That upgrade's native fix
must be preserved.

## Cause and evidence

In `react-native-paper@5.15.3`, `src/components/Menu/Menu.tsx` initializes the
previous visibility flag to `null`, even when the menu mounts with `visible: false`.
The visibility effect treats `null !== false` as a transition and calls `hide()`.
As a result, mounting an already closed menu starts an unnecessary hide animation.

The completion handler clears the internal rendered state and focuses the anchor
button. This has two consequences:

- If the user opens the menu before the initial hide completes, its callback can
  remove the newly opened menu without changing the application's `visible` prop.
- On web, focusing a closed menu's anchor can scroll the page unexpectedly.
  Release notes uses a virtualized FlatList, so jumping back to a filter button
  can unmount the release-note element a scrolling action was using.

Diagnostic browser runs reproduced immediate-opening failures on both the home
page and release notes. Waiting one second before the first interaction avoided
them, but is not a product fix. In Firefox, diagnostics captured Paper focusing
the Targets button while the list was approximately 7,700 pixels down, followed
by a jump to the top and an element-detached failure. WebKit also reproduced the
scrolling failure.

An in-memory diagnostic backport of the initialization fix passed representative
difficulty, filter, and scrolling flows in Chromium, Firefox, and WebKit: nine
checks in total, with no added interaction delays. The diagnostic interception
was not retained in the application or tests.

## Upstream status

Verified against npm metadata, GitHub releases, and tagged source on October 31,
2026:

| Version                                      | Contains the mount fix? |
| -------------------------------------------- | ----------------------- |
| `5.15.3`, installed and latest stable        | No                      |
| `6.0.0-alpha.1`, latest published prerelease | No                      |
| Current upstream `main`                      | Yes                     |

- [Issue #4907](https://github.com/callstack/react-native-paper/issues/4907):
  menu anchors steal focus and cause aggressive scrolling when mounted on web.
- [PR #5139](https://github.com/callstack/react-native-paper/pull/5139): initializes
  previous visibility from `visible` and adds regression coverage for hidden
  mounting and normal focus restoration. Merged October 29, 2026, as
  `4dbf7d606d4353f32208975cd13fa2517a4672ec`.
- [Release 5.15.3](https://github.com/callstack/react-native-paper/releases/tag/v5.15.3):
  does not include the fix.
- [Release 6.0.0-alpha.1](https://github.com/callstack/react-native-paper/releases/tag/v6.0.0-alpha.1):
  published before the fix merged and also does not include it.

We are waiting for upstream to publish a release containing this fix, preferably
a compatible 5.x patch release. The issue being closed and the PR being merged do
not mean the installed npm release contains the correction.

## Temporary resolution

`patches/react-native-paper+5.15.3.patch` backports the upstream initialization
change:

```tsx
const prevVisible = React.useRef(visible);
```

This prevents hiding a menu merely because it mounts closed. Genuine open and
close transitions still animate normally, and genuine closing still restores
focus. The patch does not undo the native Portal lifecycle fix or add
application-level menu remounting.

The patch covers Paper's TypeScript source and its published CommonJS and ES
module builds so Metro and consumers of either compiled entry point agree.

The root `postinstall` script runs `patch-package --error-on-fail`, applying the
patch after normal `npm install` and `npm ci` operations. `patch-package` is a
root dev dependency because it is installation/build tooling. App builds must
install dev dependencies; `npm ci --omit=dev` cannot run this hook. Installations
that deliberately disable scripts must run `npm run postinstall` before starting
or building the application.

GitHub Actions keeps `npm ci --ignore-scripts` and explicitly runs
`npm run postinstall` after each root dependency install in
`.github/workflows/pipeline.yml`. This applies the temporary patch without
enabling dependency lifecycle scripts. The separate changelog-script installation
is unchanged.

After applying or changing the patch, restart Metro with its cache cleared
(`npm start` already uses `--clear`) and reload browser or Expo Go clients.

Do not add sleeps, suppress valid menu assertions, override browser focus APIs
in retained tests, or increase retries to conceal the underlying problem.

## Removal and verification

When a compatible upstream release includes this correction:

1. Verify its published source contains the fix, then update Paper and the lockfile.
2. Remove `patches/react-native-paper+5.15.3.patch`.
3. If no other patches remain, remove the root `postinstall` hook, the explicit
   patch steps and their temporary comments in `.github/workflows/pipeline.yml`,
   and the `patch-package` dependency, then update the lockfile.
4. Verify the change with a fresh dependency installation and cleared Metro cache.
5. Run `e2e/web/specs/home.spec.ts` and `e2e/web/specs/releasenotes.spec.ts` across
   all browser projects, then the full Playwright suite with normal timeouts.
6. Verify repeated difficulty selection and reopening in Expo Go on iOS, preserving
   the original native fix.
