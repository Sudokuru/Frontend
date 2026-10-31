# Expo web font loading race

Investigated October 24, 2026, while stabilizing the home dashboard's Playwright tests.

## Symptoms

Some Firefox reloads left Home on its loading spinner. The drag and shortcut-order
assertions passed before reload, but the dashboard never appeared afterward.
Increasing the assertion timeout did not resolve the underlying problem.

Diagnostics showed that Home's data had loaded, while Inter's native
`document.fonts.load()` promise remained pending. The icon font loaded normally.
Eventually the font observer rejected with `12000ms timeout exceeded`; Home only
checked the loaded flag, so the error left it displaying the spinner.

This was not a font file taking 12–15 seconds to download.

## Cause and evidence

The installed `expo-font@57.0.3` web loader adds font declarations as text nodes to
a shared `<style>` element. Firefox reparses the stylesheet when another font is
registered, replacing existing `FontFace` objects. A pending request for an earlier
face can then remain unresolved.

Inter and the navigation icon font can register close together during startup.
In a controlled diagnostic comparison, the original implementation failed on
5 of 8 reloads; a diagnostic variant that preserved font faces passed all 8.
The diagnostic interception was not retained in the application or tests.

The relevant implementation is `expo-font/src/ExpoFontLoader.web.ts`:

- `loadAsync()` re-appends the shared style element to `document.head`.
- `_createWebStyle()` appends a text node for each additional font declaration.

The upstream fix attaches the style element only when it is not already connected
and adds subsequent declarations through `CSSStyleSheet.insertRule()`.

## Upstream status

Verified against npm metadata, published source, and GitHub on October 24, 2026:

| Version                                                   | Contains the stylesheet-preservation fix? |
| --------------------------------------------------------- | ----------------------------------------- |
| `57.0.3`, installed during diagnosis                      | No                                        |
| `57.0.4`, latest release tagged for SDK 57                | No                                        |
| `58.0.10`, latest published release at investigation time | Yes                                       |

- [Issue #52078](https://github.com/expo/expo/issues/52078): multiple web fonts
  remain pending until the 12-second timeout. Closed as fixed.
- [PR #52093](https://github.com/expo/expo/pull/52093): preserves the shared
  stylesheet using `insertRule()`. Merged October 22, 2026.
- [`58.0.10` changelog](https://unpkg.com/expo-font@58.0.10/CHANGELOG.md): the fix
  shipped October 23, 2026.
- [Issue #51335](https://github.com/expo/expo/issues/51335): a related, still-open
  symbols-rendering problem after a font timeout, not the same registration race.

The matching upstream report and PR focus on WebKit with SDK 58. Our reproduction
was Firefox with SDK 57. The stylesheet mechanism matches, but the upgrade must
still be validated against our own failing cases.

## Upgrade direction

Prefer an aligned Expo SDK 58 upgrade with `expo-font@58.0.10` or a later compatible
release. Installing only SDK 57's `57.0.4` does not include this fix. If remaining
on SDK 57, an explicitly maintained backport of the web-loader fix is an alternative.

Do not bypass font readiness, add browser API overrides to the tests, suppress
valid assertions, or increase retries to conceal this race. Keep persistence
checks user-facing: reload and verify visible shortcuts, order, and saved boards.

After upgrading, repeat the existing Firefox reload/order tests and the
Chromium, WebKit, and mobile-viewport regression tests with their normal timeouts.
