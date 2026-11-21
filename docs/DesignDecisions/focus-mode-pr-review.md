# Focus Mode: PR review guide

## Summary

This change adds two Sudoku variants:

| Display name       | Internal variant | Availability                                 |
| ------------------ | ---------------- | -------------------------------------------- |
| Focus Mode Classic | `focus-classic`  | Always available; not behind Feature Preview |
| Focus Mode Drill   | `focus-drill`    | Requires both Feature Preview and Drill Mode |

Focus provides the strategy name, explanation, and highlighted region without requesting a hint. Unrelated cells form a muted, theme-aware fogged grid: borders remain recognizable, but contents are hidden. A static guidance card occupies that inactive board space. Requesting a hint replaces the explanation there with the action and hint-navigation controls.

Classic, Drill, Focus Classic, and Focus Drill have independent resumable games. Focus Classic has separate accumulated statistics. Drill variants retain per-game statistics only.

**Validation status:** implementation is ready for manual review, not verified as release-ready. Automated tests were explicitly deferred until after manual review. No test cases were added or run.

## Suggested review order

1. [Variant controller](../../sudokuru/app/Components/SudokuBoard/SudokuBoardSharedFunctionsController.ts): policies and variant dispatch.
2. [Focus gameplay](../../sudokuru/app/Components/SudokuBoard/Focus/FocusFunctions.ts): valid applications, progression, and region selection.
3. [Sudoku library patch](../../patches/sudokuru+3.4.0.patch): enumerating alternative strategy applications.
4. [Board integration](../../sudokuru/app/Components/SudokuBoard/SudokuBoard.tsx): state updates, actions, undo, and hints.
5. [Guidance overlay](../../sudokuru/app/Components/SudokuBoard/Focus/FocusGuidance.tsx) and [hint UI](../../sudokuru/app/Components/SudokuBoard/Core/Components/Hint.tsx).
6. Persistence, navigation, and statistics files listed below.

## Final user-facing behavior

### Guidance and layout

- The normal Sudoku board size is preserved. Focus does not reserve additional vertical space for the explanation.
- Relevant regions, hint causes, and incorrect cells remain sharp and exposed. Other cells have muted interiors, suppressed contents, and disabled input. Normal cell/box borders are preserved unchanged: the fog does not fade the grid lines.
- The inactive-area appearance is a **user preference**: Focus Mode Background, chosen on the Profile page below Strategy Hint Order. It offers ten options—Clouds, Dense Fog, and Haze textures each over Light, Classic, and Dark surfaces, plus Plain variants—with **Classic Dense Fog** as the default. The picker shows each option's real appearance as fixed-size swatches (constant border width keeps selection from re-flowing the grid; labels sit below each swatch in theme text color).
- This setting is stored in the profile (`focusBackground`), applies to both Focus variants, and is independent of the app theme. It is added to the profile schema, defaults, and preferences context, with a fallback to the default option for unknown values.
- Plain options fill inactive cells with the option's surface color. Textured options render one continuous, seamless cloud PNG beneath the grid (`Focus/FocusFog.tsx`, `expo-linear-gradient` no longer used) with transparent inactive interiors; the board backing uses the option's surface color. See [the reproducible texture-generation guide](fog-texture-generation.md) for the dependency-free seeded generator behind the assets. The three PNGs are the only files in the app asset directory; the preview page, contact sheet, and provenance manifest are committed review artifacts under `docs/DesignDecisions/fog-textures/`, never app assets.
- The guidance card's surface, border, and text colors follow the **app theme** like the rest of the interface (for example, blue title and black body text on white in Light mode), regardless of the selected focus background.
- The fog uses the actual grid cells, not tiled overlay rectangles or a second board. This preserves the approach used to eliminate mobile border seams without revealing ghosted digits.
- The blur prototype and its `expo-blur` dependency were removed. The final fog effect requires no additional dependency or native rebuild.
- Guidance on the fogged area is a **collapsed strategy card**: the stage title with an expand chevron. Tapping it reveals the strategy description inline; tapping again collapses it (a new focus step re-collapses it). The card is anchored to the top of its area, so expanding grows downward without moving the title or chevron; the whole title row is the press target with extra hit slop. Area selection only needs to fit the title, so the card stays on-board for every region shape and cell size — verified for all 12 strategies at 30–72px cells, including the ring around a centered box focus. Expanded descriptions may extend into fogged cells in cramped shapes; they never move the card.
- Requested hints render **below the board exactly like Classic mode** (action text and stage controls in the classic hint row, starting at stage 4). This keeps the on-board card visually stable and removes all hint-session fit concerns.
- Area selection favors large, wide, readable rectangles. Equal-scoring candidates favor greater width, then proximity to the board center.
- Readability takes precedence over centering. Text is centered within the chosen area.
- Clicking Hint changes the content in that same area; it does not open an additional hint section below the board.

### Hint stages and bookkeeping

The existing hint stages remain numbered 1–5. Focus starts requested hints at **stage 4**:

| State             | Presentation                                                                                                            |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Normal Focus play | Collapsed strategy card (title + expand chevron) on the fogged area; region highlighting; normal controls remain usable |
| Expanded card     | Strategy description inline in the card, under the title; tap again to collapse                                         |
| Hint stage 4      | Classic below-board hint row: action text and exact-action highlighting                                                 |
| Hint stage 5      | Result preview in the hint row, with back, exit, and apply controls                                                     |
| Exit hint         | Restore the pre-hint puzzle; the on-board strategy card is unchanged                                                    |
| Apply hint        | Commit the preview as an undoable action, then evaluate progression/completion                                          |

- Requested hints cannot navigate backward into redundant stages 1–3.
- Persistent guidance does not count as hint usage.
- Requesting Hint increments Classic-style hint counters or sets the Drill-style `hintUsed` flag.
- Undo does not refund mistake or hint counters.
- Opening a hint still uses the existing interaction model: ordinary board editing is disabled until the hint is exited or applied.

### Notes and mistakes

- Both Focus variants force note initialization and automatic note simplification on, regardless of those preferences or their preview gating.
- Focus Drill reuses the existing drill generator's strategy-specific note preparation.
- A move must be consistent with the guided action, not merely with the final Sudoku solution.
- Incorrect entries remain on the board, increment mistakes, and stay exposed/highlighted so they can be corrected.
- Erasing a conflicting Focus cell restores its pre-step cell, including its notes, rather than leaving an originally noted cell empty.
- Givens and previously completed value cells remain protected.
- **Automatic note/value mode switching (default on):** each focus step's action decides the input mode — steps that place a value (for example, Obvious Single) select value mode, and note-based steps select note mode. The switch happens when a step begins (new game, resume, step completion, or undoing across a step boundary); a mid-step manual toggle is preserved until the next step begins. The Focus Mode settings pane provides a **Manual Note/Value Mode** override (default off) that disables the automatic switching for players who want full control.

### Focus Classic: alternative valid actions

The initial implementation accepted only one predetermined application. Manual review exposed a problem: a highlighted box can contain multiple Obvious Singles, and any one of them is a legitimate answer.

The final implementation therefore:

1. Selects a strategy and region.
2. Enumerates applicable instances of that strategy using the patched library.
3. Restricts alternatives to deductions with the required evidence visible in the region, and restricts their explicit placements/removals to that region.
4. Builds and deduplicates target states for those alternatives.
5. Combines their allowed changes for move/conflict validation.
6. Advances when one application is complete and there are no conflicting cells.

Required note changes can be made in any order. Valid partial eliminations from another applicable instance do not need to be undone when one instance completes. Automatic simplification after a placement can also update peers outside the visible region.

Important evidence rules:

- An Obvious Single only needs its own cell as evidence. Its normally injected box highlight is a presentation choice, not a requirement that the whole box be visible.
- Pointing strategies require their relevant groups to be visible.
- Other set strategies require visible causes and an applicable visible group.
- Applications that would make no actual board change are excluded from region-local choices.

### Focus Classic: choosing the next step

After an application completes:

1. Check the current region for strategies earlier in the configured order, then the current strategy.
2. If one is applicable, keep the region unchanged and use the first applicable strategy in that order.
3. Otherwise, use the normal strategy order to determine the next strategy globally.
4. Among applications of that strategy, prefer the region with the most overlapping cells.
5. Break overlap ties using the smallest symmetric average nearest-cell Manhattan distance between regions.
6. Retain enumeration order for any remaining tie.

`AMEND_NOTES` and `SIMPLIFY_NOTES` remain ahead of the configured strategy array. “Earlier priority” means earlier in that array, not necessarily a fixed difficulty classification.

This intentionally allows an Obvious Single exposed by a Hidden Single elimination to interrupt continued Hidden Single work in the same region. It does **not** search lower-priority strategies merely to avoid leaving a region.

### Focus Drill

- Guidance and the completion target stay tied to the original drill solution.
- Classic's alternative-application progression and region-selection policy do not replace the Drill target.
- Reset restores the initial drill puzzle while retaining its focus guidance.
- New-game, change-strategy, pause, and resume flows retain Focus Drill selection.

### Keyboard navigation and undo

- Arrow keys and WASD use variant-provided navigation.
- Focus skips masked cells while preserving movement along the same row/column and wraparound behavior.
- If the current selection becomes hidden after a region change, undo, or loading a saved game, it is relocated to a nearest exposed cell.
- Duplicate selections created by relocation/navigation are removed.
- The foreground masking and keyboard navigation use the same exposed-cell policy.
- Focus disables peer and identical-value selection highlights: the visible region already conveys the relevant peers and identical values are mostly masked, so the tints only add noise. The selected cell, hint causes, and mistake highlighting are unchanged; Classic and Drill keep their profile-configurable highlights.
- Undo remains based on user actions, not hint stages. Automatic note simplification belongs to the placement action that caused it.
- Focus step history records the action-history index at which each step started. Undoing past that index restores the preceding step and its guidance.

## Architecture and implementation map

Paths in this section are relative to `sudokuru/app/` unless otherwise noted.

| File                                                                     | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Components/SudokuBoard/SudokuBoardSharedFunctionsController.ts`         | Adds both variants and shared Focus policies; dispatches generation, validation, hint stages, notes, navigation, selection repair, pause/results, and statistics behavior. Exposes route-to-variant helpers.                                                                                                                                                                                                                                                                                                                                        |
| `Components/SudokuBoard/SudokuBoard.tsx`                                 | Broadens board prop types, invokes variant policies, renders the overlay and embedded hints, prepares updated boards after actions/undo/hint application, and saves undo/reset changes. Board state is still committed here through `setSudokuBoard()`.                                                                                                                                                                                                                                                                                             |
| `Components/SudokuBoard/Focus/FocusFunctions.ts`                         | Creates/hydrates focus steps, enumerates and merges valid alternatives, validates partial actions, chooses requested action hints, checks application completion, and selects subsequent regions. Also maps each step's action to the note/value input mode and applies it on step changes. Helpers return new board/state objects.                                                                                                                                                                                                                 |
| `Components/SudokuBoard/Focus/FocusNavigationFunctions.ts`               | Implements visible-cell navigation, nearest exposed selection recovery, and selection deduplication.                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `Components/SudokuBoard/Focus/FocusGuidance.tsx`                         | Chooses a readable rectangle over the inactive grid and renders a static explanation/hint card, with a below-board position when no rectangle fits.                                                                                                                                                                                                                                                                                                                                                                                                 |
| `Components/SudokuBoard/Focus/FocusAppearance.ts`                        | Supplies app-theme guidance card colors (surface, mixed border) using the existing `polished` dependency. Inactive-cell interiors no longer read from the app theme.                                                                                                                                                                                                                                                                                                                                                                                |
| `Components/SudokuBoard/Focus/FocusFog.tsx`                              | Renders the selected background option: one seamless cloud PNG beneath the grid, or nothing for Plain options.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `Functions/FocusBackgrounds.ts`                                          | Defines the ten background options (style × surface), their fog colors, texture assets, default (`dense-classic`), and unknown-value fallback.                                                                                                                                                                                                                                                                                                                                                                                                      |
| `Components/SudokuBoard/Core/Components/Hint.tsx`                        | Adds a configurable first stage and optional title so Focus hints skip redundant stages without duplicating the on-board strategy card. The hint presentation itself is the classic one for all variants.                                                                                                                                                                                                                                                                                                                                           |
| `Components/SudokuBoard/Core/Components/RenderCell.tsx`                  | Uses variant-provided display guidance and masking without blocking passive-guidance input; fills Plain masked cells with the selected option's surface color and leaves textured masked cells transparent.                                                                                                                                                                                                                                                                                                                                         |
| `Components/SudokuBoard/Core/Components/Cell.tsx`                        | Supports masked cells with muted interiors, suppressed contents, disabled input, and excluded accessibility focus. Their original cell and box borders are retained.                                                                                                                                                                                                                                                                                                                                                                                |
| `Components/SudokuBoard/Core/Functions/RenderCellFunctions.ts`           | Exports the region-membership helper and preserves conflict highlighting during passive guidance. The region helper accepts just the hint fields it reads.                                                                                                                                                                                                                                                                                                                                                                                          |
| `Components/SudokuBoard/Core/Functions/HintFunctions.ts`                 | Adds the frontend conversion wrapper for all-applicable hints and allows Classic hint bookkeeping to use a supplied hint instead of recomputing one.                                                                                                                                                                                                                                                                                                                                                                                                |
| `Components/SudokuBoard/Core/Functions/HintPreviewFunctions.ts`          | Extracts immutable preview/application logic from the board; handles note amendment, placements, removals, and optional peer simplification. Shared by normal hints and Focus target construction.                                                                                                                                                                                                                                                                                                                                                  |
| `Components/SudokuBoard/Core/Functions/useKeyboardHotkeys.ts`            | Delegates directional selection to the variant controller; types the controller map instead of using `any` for it.                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `Components/SudokuBoard/Core/Functions/BoardLayoutContext.ts`            | Provides optional extra layout height to board sizing. Current variants all use zero; the earlier explanation-space reservation is no longer enabled.                                                                                                                                                                                                                                                                                                                                                                                               |
| `Components/SudokuBoard/Core/Functions/BoardFunctions.ts`                | Reads layout reservation, accepts a statistics storage key when finishing a game, and explicitly returns ordinary Classic play to its normal selection.                                                                                                                                                                                                                                                                                                                                                                                             |
| `Components/SudokuBoard/Drill/Functions/BoardFunctions.ts`               | Explicitly returns ordinary Drill play to its normal selection. Focus routing is overridden in the controller.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `Components/SudokuBoard/Core/Components/EndGameModal.tsx`                | Supports Focus Classic result labeling and preserves Focus selection on new-game/change-difficulty actions.                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `Components/SudokuBoard/Drill/Components/EndGameModal.tsx`               | Supports the equivalent Focus Drill result and navigation behavior.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `Functions/LocalDatabase.ts`                                             | Extends variant types, defines persisted focus steps/application targets, and adds Focus save-validation schemas.                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `Api/Puzzles.ts`                                                         | Adds independent Focus save loaders and an optional statistics key for completed games. Existing variant-derived save keys are reused.                                                                                                                                                                                                                                                                                                                                                                                                              |
| `Api/Statistics.ts`                                                      | Supports separate statistics keys and includes Focus Classic totals in global statistics deletion.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `SudokuModes/SudokuModeRegistry.ts`                                      | Adds Focus catalogue/shortcut/resume descriptors and availability rules: direct Focus difficulty shortcuts and per-strategy Focus Drill shortcuts, with shortcut-library categories split per variant (Classic, Focus Mode Classic, Classic Drill, Focus Mode Drill) instead of the former mixed Difficulties/Strategies sections; no standalone Focus activity cards. Ordinary routes explicitly use `focus: "false"`; Focus routes use `focus: "true"`. Adds per-mode `section` grouping so each game's variant page lists only its own variants. |
| `Components/Profile/FocusBackgroundPicker.tsx`                           | Fixed-size swatch cards for all ten Focus backgrounds; constant border width prevents selection re-flow, and labels render below each swatch in theme text color.                                                                                                                                                                                                                                                                                                                                                                                   |
| `Components/Profile/ProfilePanel.tsx`                                    | Adds the Focus Mode pane below Strategy Hint Order: the Manual Note/Value Mode override toggle plus the background picker.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `Contexts/PreferencesContext.ts` / `Contexts/InitializeContext.ts`       | Add the `focusBackground` and `focusManualNoteValueMode` settings and their update callbacks.                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `Api/Profile.ts` / `Api/Puzzle.Types.ts`                                 | Persist and default `focusBackground`, filling it for existing stored profiles.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `Pages/ModeVariantsPage.tsx`                                             | The first page of each entry: the Play shortcut and sidebar entry open it with only Classic / Focus Mode Classic; the Drill shortcut and sidebar entry open it with only Classic Drill / Focus Mode Drill (hidden without both Drill gates). Choosing a variant navigates to the corresponding list page.                                                                                                                                                                                                                                           |
| `Components/GameModeChoices.tsx`                                         | Shared choice-card list used by the variant page.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `Navigation/DrawerNavigator.tsx` / `Components/NavigationSideBar.tsx`    | Register the variant page; the sidebar Play and Drill entries open it directly for their game. The former PlayModesPage ("Choose a game") screen is removed.                                                                                                                                                                                                                                                                                                                                                                                        |
| `Pages/PlayPage.tsx` / `Pages/DrillPage.tsx`                             | The Classic/Focus segmented toggles are removed. Each page shows its variant as a subheading and loads the matching resume slot. Drill selection also checks existing Drill gates.                                                                                                                                                                                                                                                                                                                                                                  |
| `Components/Home/DifficultyPanel.tsx` / `Components/Home/DrillPanel.tsx` | Forward the chosen Focus selection when starting games; Drill's panel also selects the matching resume loader.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `Pages/SudokuPage.tsx` / `Pages/DrillGame.tsx`                           | Resolve route selection through controller helpers. Drill game access checks Feature Preview and Drill Mode.                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `Pages/StatisticsPage.tsx`                                               | Adds the Classic/Focus Classic statistics selector and reloads totals when selection changes. Reloading is guarded: re-clicking the selected segment is a no-op, and a load-generation counter ensures only the newest request commits results or clears loading. Deleting statistics keeps the confirm modal open until refreshed totals commit, as before.                                                                                                                                                                                        |

The Statistics-page Classic/Focus selector keeps explicit readable selected/unselected theme colors, responsive widths, and a minimum width for the longer Focus label. These address the contrast and label-truncation issues found during manual review. The former Play/Drill segmented toggles were removed entirely in favor of the variant page flow.

Shared-board changes also include an additional conflict check before completing a game after a user entry and restricting automatic simplification to moves reported as correct by the variant. These paths deserve regression review for ordinary Classic and Drill as well.

## Sudoku library patch

File: [`patches/sudokuru+3.4.0.patch`](../../patches/sudokuru+3.4.0.patch).

The existing public `getHint()` returns one application. The internal `Solver.getAllHints()` is designed around strategy/drill selection and does not enumerate every occurrence. Neither was sufficient for accepting equivalent valid moves in Focus.

The patch adds:

- Public `getApplicableHints(board, notes, strategies?, solution?)` and an `ApplicableHint` type.
- Solver and Strategy methods that enumerate applications of the requested strategies without applying them or enforcing Drill's uniqueness rules.
- Enumeration of note maintenance, obvious/hidden sets, and pointing pairs/triplets using the library's existing deduction routines.
- Independent candidate objects and deduplication of equivalent emitted hints.
- Optional per-note pointing checks so enumeration does not stop after the first pointing pattern in a box.
- A note-preserving amendment-check option so enumeration does not clear a candidate cell's notes as a side effect of checking whether repair is needed.
- Public exports, compiled JavaScript, and declaration updates alongside TypeScript sources.

Existing `getHint()` and Drill uniqueness APIs remain available. The new public API defaults to the supported public strategy array when no strategies are supplied.

The repository already runs `patch-package --error-on-fail` during `postinstall`; no new installation hook or library version bump was introduced. Both source and `dist` changes must remain in the patch because the installed package's entry point is `dist/index.js`.

## Persistence and compatibility

| Data                 | Storage key                 |
| -------------------- | --------------------------- |
| Classic game         | `active_classic_game`       |
| Drill game           | `active_drill_game`         |
| Focus Classic game   | `active_focus-classic_game` |
| Focus Drill game     | `active_focus-drill_game`   |
| Classic totals       | `statistics`                |
| Focus Classic totals | `focus_classic_statistics`  |

- Existing Classic and Drill storage schemas/keys remain separate and do not require migration.
- Focus schemas extend the corresponding ordinary schema with a Focus variant literal and required `focus` state.
- Each focus step stores its start action index, hint payload, pre-step puzzle, and target puzzle. Classic steps can additionally store alternative application hints and targets.
- `applications` is optional in the schema so earlier Focus prototype saves remain readable. Missing applications are constructed when Classic focus state is prepared, including on resume.
- Resume also repairs selections that are now masked.
- Focus Classic reuses Classic scoring and metrics, but reads/writes its own totals.
- Statistics deletion clears **both** totals sets, regardless of which selector is currently active; existing lesson/tutorial reset behavior remains.
- There are no backend or server data changes.

## Design revisions reflected in the final code

These earlier approaches are **not** the final behavior:

- Reserving explanation space below the board: replaced because it shrank the board.
- Rendering requested hint content below the board: replaced with embedded content/controls in the blackout area; **subsequently reverted** — hints returned to the classic below-board presentation after hint sessions could not reliably fit short fogged bands (Pointing Pair/Triplet never fit; several strategies needed ≥49px cells).
- On-board cards showing the full strategy explanation: replaced with a collapsed title-plus-chevron card whose description expands inline, so the card fits every region shape and cell size and pressing Hint no longer restyles or relocates anything on the board.
- Strongly prioritizing center position: replaced because it selected narrow, hard-to-read text areas. Width/readability now win.
- Tiling separate blackout rectangles above cells: replaced with black rendering in the actual grid cells and a black board backing to address mobile border seams.
- Pure-black inactive areas: subsequently replaced with the theme-tinted blur prototype. The single blurred background and transparent foreground masks avoid reintroducing tiled overlay seams.
- Theme-tinted blur: subsequently replaced with a fogged grid because the blur appeared too similar to a solid surface. Inactive contents are now fully hidden while grid structure remains visible; the duplicate background board and blur dependency were removed.
- Scrollable guidance: replaced with a static card that is sized for its content and moves below the board only if there is insufficient unused grid space.
- Up-front reservation of hint controls in area sizing: the phantom wrap margins and early button reservation rejected bands that could hold the passive summary (a centered box focus fell below the board). Sizing now fits the collapsed title-only card, which fits every band at every cell size.
- Hint controls stacked below the embedded content: replaced with exit/back on the left and next/apply on the right of the stage title, which keeps hint sessions short enough to stay in the same fogged band instead of relocating below the board. Superseded by returning hints to the classic below-board presentation.
- Guidance card colors tied to the selected background option: replaced with app-theme card colors after the default dark background option under the Light app theme produced black text on a dark surface. The background option only affects inactive cells.
- Fixed theme fog colors: replaced with the user-selectable Focus Mode Background preference, covering textures and plain fills independent of the app theme.
- Accepting only one predetermined Classic application: replaced with library-backed alternatives.
- Always continuing the same strategy before considering earlier strategies: revised so newly available earlier-priority deductions in the same region take precedence.
- Putting Focus Classic behind Feature Preview: requested temporarily, then withdrawn before implementation. Focus Classic remains ungated.
- Swiping between information and controls: discussed as an alternative, but not implemented.

## Review attention and remaining validation

The following are review targets, not claims of completed testing:

- **Deduction correctness:** alternative application enumeration, evidence visibility, merged allowed changes, orderless note removal, and avoiding false mistakes for equivalent actions.
- **Step transitions:** Hidden Single to Obvious Single, region continuity, priority ordering, overlap/distance tie-breaking, and transitions after applying a hint.
- **Undo/resume:** restoring a preceding focus step, retaining partial progress and counters, independent save slots, and loading older Focus saves.
- **Hint presentation:** action/preview/back/exit/apply inside the overlay, restoring the explanation, readable controls, and no redundant stages or duplicate hint sections.
- **Navigation:** directional wrapping, skipped masked cells, region-change relocation, and multiselection. Navigation follows exposed cells on the same row/column; disconnected exposed cells merit particular review.
- **Layout:** long strategy names/descriptions, small viewports, all themes, readable non-scrollable cards, preserved sharp grid boundaries, and avoiding overlays on evidence or mistakes. Check below-board card placement when no unused rectangle fits, including access to the controls on short screens. Fit selection estimates line wrapping rather than measuring rendered text.
- **Background preference:** all ten options across every app theme (card text remains app-theme colored), texture scaling/seams at various board sizes, storage migration for existing profiles, and the swatch picker's layout at narrow widths.
- **Storage/performance:** Classic steps retain full puzzle snapshots for alternative applications and history. Check save size and enumeration cost on difficult/long games and native storage limits.
- **Shared regressions:** ordinary Classic/Drill previews, input locking, simplification, completion, save/undo/reset behavior, and navigation after results.
- **Statistics:** no hint charge for passive guidance, separation of totals, unchanged scoring formula, and deletion of both sets of totals.
- **Availability:** Focus Classic without Feature Preview; both Drill gates for Focus Drill, including direct page/game access.
- **Native/accessibility:** the overlay and embedded controls have not received a complete native-device or accessibility review.

Checks run successfully during implementation:

```sh
npm run tsc
npm run lint
git diff --check
npx patch-package --error-on-fail
```

The changed application files were formatted with Prettier. The patched library sources were compiled to refresh the corresponding distributed JavaScript/declarations before generating the patch.

**No automated tests were added or run.** Passing the checks above verifies types, lint, whitespace, and patch application—not gameplay correctness or visual behavior. Manual acceptance review and subsequent regression coverage remain pending.
