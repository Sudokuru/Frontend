# iOS builds and TestFlight

Expo EAS manages signing certificates, provisioning profiles, and the App Store
Connect API key used for uploads. EAS CLI builds locally on a GitHub-hosted macOS
runner using `eas build --local`; it does not use EAS cloud builds. GitHub Actions
authenticates only with an Expo access token. Do not add Apple passwords, signing
files, or API keys to GitHub secrets or this repository.

## One-time setup

### 1. Connect to the existing Expo project

From `sudokuru/`, run:

```sh
npx eas-cli@25.3.0 login
npx eas-cli@25.3.0 whoami
npx eas-cli@25.3.0 project:info
```

The account needs access to the `sudokuru` Expo organization and project
`23c4c607-ead6-4786-9a9c-03f57a97dac7`. Keep the existing project; a new Apple app
does not require a new Expo project.

### 2. Generate signing credentials and the first build

```sh
npx eas-cli@25.3.0 build --platform ios --profile production --local --output ./sudokuru.ipa
```

When prompted, sign in to your Apple Developer account, select the correct Apple
team, and allow EAS to register `com.drasolabs.sudokuru` and generate/manage the
distribution certificate and provisioning profile. Apple login and two-factor
authentication happen locally during this setup, not in GitHub Actions.

EAS maintains build numbers remotely and increments the production iOS build
number for each build. The user-facing version stays in `app.config.ts`; choose
the desired version before the first public App Store release. Check the EAS
build number if you have already uploaded builds to this Apple app, and use
`npx eas-cli@25.3.0 build:version:set --platform ios --profile production` to
initialize it above existing uploads if needed.

The ignored `ios/` and `android/` directories are generated projects, not the
source of truth. EAS generates native projects from the committed Expo config.
Any local native projects generated before the identifier change must also be
regenerated before making local native builds; preserve manual native changes
before doing so.

### 3. Create the app in App Store Connect

In [App Store Connect](https://appstoreconnect.apple.com/), select **Apps → + →
New App**. Choose iOS, name it Sudokuru (subject to availability), select a primary
language, select bundle ID `com.drasolabs.sudokuru`, and choose a unique SKU such
as `sudokuru-ios`.

Under **App Information → General Information**, copy the numeric **Apple ID**.
This is the App Store Connect app ID, not your Apple account email or Team ID.
Accept any outstanding Apple agreements before uploading.

Sudokuru's Apple ID is `6828654853`, configured directly in
`sudokuru/eas.json` as `submit.production.ios.ascAppId`. It is not secret and
does not require a GitHub Actions variable.

### 4. Let Expo manage submission credentials

```sh
npx eas-cli@25.3.0 credentials --platform ios
```

Select `production`, then **App Store Connect: Manage your API Key → Set up your
project to use an API Key for EAS Submit**. Allow Expo to create or associate a key
for this app. The Apple account needs permission to manage API keys; the Apple
Account Holder may need to enable App Store Connect API access first.

Test the first upload interactively:

```sh
npx eas-cli@25.3.0 submit --platform ios --profile production --path ./sudokuru.ipa --no-auto-testflight-setup
```

Select the correct App Store Connect app and complete any remaining credential
prompts. EAS stores the upload credentials so future non-interactive submissions
can reuse them. Do not commit the generated `.ipa` file.

### 5. Configure GitHub

In **Settings → Environments**, create the `testflight` environment and restrict
deployment branches to `main`. Do not require manual reviewers if releases should
run automatically. Add `EXPO_TOKEN` to that environment's secrets. Keep the
existing repository-level token if other Expo jobs use it.

- **Environment secret (`testflight`): `EXPO_TOKEN`** — Expo access token with
  access to the existing project and its credentials.

Generate an access token in [Expo account settings](https://expo.dev/settings/access-tokens).
Prefer a dedicated automation account/token with only the required organization
access. The App Store Connect app ID is already committed in `eas.json`; no
`ASC_APP_ID` GitHub variable is needed. Apple credentials remain managed by Expo.

Protect `main` with required checks and pull requests as appropriate. Workflow
files do not configure branch protection or environment rules; apply those
settings separately in GitHub.

## Automatic releases

The existing **Pipeline** workflow builds iOS locally on its macOS runner and
submits the resulting `.ipa` to TestFlight through EAS Submit after both
`deploy_website_dev` and `deploy_app_dev` succeed on `main`, matching the other
production release jobs. Those dependencies also gate the release on the lint,
unit, TypeScript, CodeQL, web end-to-end tests, report merging, and Android/desktop
builds earlier in the pipeline.
It does not run the iOS release job for pull requests. The existing workflow's
path exclusions still apply (for example, documentation-only pushes do not
trigger a release).

To run it manually, select **Actions → Pipeline → Run workflow → main**. This
also runs the existing pipeline jobs. The iOS job serializes releases and does
not cancel an active release when another push arrives. GitHub may replace older
pending jobs with a newer pending job; it is not a queue of every commit.

GitHub stores the signed `.ipa` for 14 days as the
`sudokuru-ios-<run number>-<attempt>` workflow artifact, then
submits that exact file (not the latest build from another run). It waits for
EAS Submit to finish; follow the submission URL in its logs or the
[Expo dashboard](https://expo.dev/accounts/sudokuru/projects/sudokuru) for details.
App Store Connect then processes the build before it appears in TestFlight. A
successful build alone does not confirm a successful submission. Builds use
GitHub macOS runner minutes rather than EAS cloud build credits.

If only submission fails, download/extract the signed artifact and retry from
`sudokuru/` without rebuilding:

```sh
npx eas-cli@25.3.0 submit --platform ios --profile production --path /path/to/sudokuru.ipa --no-auto-testflight-setup
```

Do not re-upload a build Apple has already accepted with the same version/build
number. Signed artifacts are release material; consider repository access when
retaining them, especially in a public repository.

The submission disables automatic TestFlight setup: it does not create testing
groups or invite testers. In App Store Connect, configure internal TestFlight
testers and automatic distribution as desired. External testing may require Apple's Beta App Review.
The app declares `ITSAppUsesNonExemptEncryption: false` in its iOS configuration,
matching its use of standard platform networking without non-exempt encryption.
This does not disable HTTPS or other platform encryption. Reassess this
declaration if encryption features or dependencies change, and answer any Apple
export-compliance questions accurately. Sevens' LAN discovery permissions are
not needed here. Submission does **not** publish to the App
Store: screenshots, privacy details, age rating, export compliance, and App Review
remain manual steps.

## Identifier change

iOS, Android, and desktop/Tauri now use `com.drasolabs.sudokuru`. Changing the
desktop identifier may affect installer identity and app-data locations; existing
desktop data is not automatically migrated. Android treats this as a separate app:
it cannot update an installed
or published `com.opengamesonline.sudokuru` app or automatically inherit its local
data. If the existing non-interactive Android build cannot find signing
credentials for the new package, run `npx eas-cli@25.3.0 credentials --platform
android` locally and configure EAS-managed credentials before rerunning CI.

## References

- [Sevens local iOS workflow](https://github.com/opengamesonline/sevens/blob/dev/.github/workflows/ios.yml)
- [Expo SDK requirements](https://docs.expo.dev/versions/v57.0.0/)
- [EAS local builds](https://docs.expo.dev/build-reference/local-builds/)
- [EAS Submit for iOS](https://docs.expo.dev/submit/ios/)
