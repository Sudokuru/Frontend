import { test } from "../fixture";
import {
  IDENTICAL_VALUE_COLOR_RGB,
  NOT_HIGHLIGHTED_COLOR_RGB,
  NOT_SELECTED_CONFLICT_COLOR_RGB,
  PEER_SELECTED_COLOR_RGB,
  SELECTED_COLOR_RGB,
  SELECTED_CONFLICT_COLOR_RGB,
} from "../../../app/Styling/HighlightColors";
import { SudokuBoardComponent } from "../components/sudoku-board.component";
import { HeaderComponent } from "../components/header.component";
import { ProfilePage } from "../page/profile.page";
import { HomePage } from "../page/home.page";

test.describe("board highlighting", () => {
  test("should render correctly when a cell is selected", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cellHasColor(7, 6, NOT_SELECTED_CONFLICT_COLOR_RGB);
    await sudokuBoard.cellHasColor(7, 7, NOT_HIGHLIGHTED_COLOR_RGB);
    await sudokuBoard.cell[7][7].click();

    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      {
        condition: (row, column) => row === 7 && column === 6,
        color: NOT_SELECTED_CONFLICT_COLOR_RGB,
      },
      {
        condition: (row, column) => row === 7 && column === 7,
        color: SELECTED_COLOR_RGB,
      },
      { condition: (row, column) => row === 7, color: PEER_SELECTED_COLOR_RGB },
      {
        condition: (row, column) => column === 7 && row !== 7,
        color: PEER_SELECTED_COLOR_RGB,
      },
      {
        condition: (row, column) => row > 5 && column > 5,
        color: PEER_SELECTED_COLOR_RGB,
      },
      { condition: (row, column) => true, color: NOT_HIGHLIGHTED_COLOR_RGB },
    ]);
  });

  test("should render correctly when cell is unselected", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cellHasColor(7, 6, NOT_SELECTED_CONFLICT_COLOR_RGB);
    await sudokuBoard.cellHasColor(7, 7, NOT_HIGHLIGHTED_COLOR_RGB);
    await sudokuBoard.cell[7][7].click();
    await sudokuBoard.cell[7][7].click();

    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      {
        condition: (row, column) => row === 7 && column === 6,
        color: NOT_SELECTED_CONFLICT_COLOR_RGB,
      },
      { condition: (row, column) => true, color: NOT_HIGHLIGHTED_COLOR_RGB },
    ]);
  });

  test("should render correctly when cell value is entered", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[7][7].click();
    await sudokuBoard.cell[7][7].press("1");

    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      {
        condition: (row, column) =>
          (row === 0 && column === 0) ||
          (row === 1 && column === 8) ||
          (row === 2 && column === 4) ||
          (row === 3 && column === 3) ||
          (row === 4 && column === 1) ||
          (row === 5 && column === 6) ||
          (row === 6 && column === 2) ||
          (row === 7 && column === 5) ||
          (row === 8 && column === 7),
        color: IDENTICAL_VALUE_COLOR_RGB,
      },
      {
        condition: (row, column) => row === 7 && column === 6,
        color: NOT_SELECTED_CONFLICT_COLOR_RGB,
      },
      {
        condition: (row, column) => row === 7 && column === 7,
        color: SELECTED_CONFLICT_COLOR_RGB,
      },
      {
        condition: (row, column) =>
          row === 7 || column == 7 || (row > 5 && column > 5),
        color: PEER_SELECTED_COLOR_RGB,
      },
      { condition: (row, column) => true, color: NOT_HIGHLIGHTED_COLOR_RGB },
    ]);
  });

  test("Selecting invalid cell should update highlighting of cell correctly", async ({
    resumeGame,
  }) => {
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[7][6].click();
    await sudokuBoard.cellHasColor(7, 6, SELECTED_CONFLICT_COLOR_RGB);
  });

  test("disable identical values", async ({ resumeGame }) => {
    const headerComponent = new HeaderComponent(resumeGame);
    await headerComponent.profile.last().click();
    const profilePage = new ProfilePage(resumeGame);
    await profilePage.identicalValuesSwitchEnabled.click();
    await headerComponent.home.last().click();
    const homePage = new HomePage(resumeGame);
    await homePage.playSudoku.click();
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[7][7].click();
    await sudokuBoard.cell[7][7].press("2");
    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      {
        condition: (row, column) => row === 7 && column === 6,
        color: NOT_SELECTED_CONFLICT_COLOR_RGB,
      },
      {
        condition: (row, column) => row === 7 && column === 7,
        color: SELECTED_COLOR_RGB,
      },
      {
        condition: (row, column) =>
          row === 7 || column == 7 || (row > 5 && column > 5),
        color: PEER_SELECTED_COLOR_RGB,
      },
      { condition: (row, column) => true, color: NOT_HIGHLIGHTED_COLOR_RGB },
    ]);
  });

  test("disable box", async ({ resumeGame }) => {
    const headerComponent = new HeaderComponent(resumeGame);
    await headerComponent.profile.last().click();
    const profilePage = new ProfilePage(resumeGame);
    await profilePage.highlightBoxSwitchEnabled.click();
    await headerComponent.home.last().click();
    const homePage = new HomePage(resumeGame);
    await homePage.playSudoku.click();
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[7][7].click();
    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      {
        condition: (row, column) => row === 7 && column === 6,
        color: NOT_SELECTED_CONFLICT_COLOR_RGB,
      },
      {
        condition: (row, column) => row === 7 && column === 7,
        color: SELECTED_COLOR_RGB,
      },
      {
        condition: (row, column) => row === 7 || column == 7,
        color: PEER_SELECTED_COLOR_RGB,
      },
      { condition: (row, column) => true, color: NOT_HIGHLIGHTED_COLOR_RGB },
    ]);
  });

  test("disable rows", async ({ resumeGame }) => {
    const headerComponent = new HeaderComponent(resumeGame);
    await headerComponent.profile.last().click();
    const profilePage = new ProfilePage(resumeGame);
    await profilePage.highlightRowSwitchEnabled.click();
    await headerComponent.home.last().click();
    const homePage = new HomePage(resumeGame);
    await homePage.playSudoku.click();
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[7][7].click();
    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      {
        condition: (row, column) => row === 7 && column === 6,
        color: NOT_SELECTED_CONFLICT_COLOR_RGB,
      },
      {
        condition: (row, column) => row === 7 && column === 7,
        color: SELECTED_COLOR_RGB,
      },
      {
        condition: (row, column) => column == 7 || (row > 5 && column > 5),
        color: PEER_SELECTED_COLOR_RGB,
      },
      { condition: (row, column) => true, color: NOT_HIGHLIGHTED_COLOR_RGB },
    ]);
  });

  test("disable column", async ({ resumeGame }) => {
    const headerComponent = new HeaderComponent(resumeGame);
    await headerComponent.profile.last().click();
    const profilePage = new ProfilePage(resumeGame);
    await profilePage.highlightColumnSwitchEnabled.click();
    await headerComponent.home.last().click();
    const homePage = new HomePage(resumeGame);
    await homePage.playSudoku.click();
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[7][7].click();
    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      {
        condition: (row, column) => row === 7 && column === 6,
        color: NOT_SELECTED_CONFLICT_COLOR_RGB,
      },
      {
        condition: (row, column) => row === 7 && column === 7,
        color: SELECTED_COLOR_RGB,
      },
      {
        condition: (row, column) => row === 7 || (row > 5 && column > 5),
        color: PEER_SELECTED_COLOR_RGB,
      },
      { condition: (row, column) => true, color: NOT_HIGHLIGHTED_COLOR_RGB },
    ]);
  });

  test("disable all", async ({ resumeGame }) => {
    const headerComponent = new HeaderComponent(resumeGame);
    await headerComponent.profile.last().click();
    const profilePage = new ProfilePage(resumeGame);
    await profilePage.highlightColumnSwitchEnabled.click();
    await profilePage.highlightBoxSwitchEnabled.click();
    await profilePage.highlightRowSwitchEnabled.click();
    await headerComponent.home.last().click();
    const homePage = new HomePage(resumeGame);
    await homePage.playSudoku.click();
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[7][7].click();
    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      {
        condition: (row, column) => row === 7 && column === 6,
        color: NOT_SELECTED_CONFLICT_COLOR_RGB,
      },
      {
        condition: (row, column) => row === 7 && column === 7,
        color: SELECTED_COLOR_RGB,
      },
      { condition: (row, column) => true, color: NOT_HIGHLIGHTED_COLOR_RGB },
    ]);
  });

  test("disable rows and columns", async ({ resumeGame }) => {
    const headerComponent = new HeaderComponent(resumeGame);
    await headerComponent.profile.last().click();
    const profilePage = new ProfilePage(resumeGame);
    await profilePage.highlightRowSwitchEnabled.click();
    await profilePage.highlightColumnSwitchEnabled.click();
    await headerComponent.home.last().click();
    const homePage = new HomePage(resumeGame);
    await homePage.playSudoku.click();
    const sudokuBoard = new SudokuBoardComponent(resumeGame);
    await sudokuBoard.cell[7][7].click();
    await sudokuBoard.isSudokuBoardHighlightedCorrectly([
      {
        condition: (row, column) => row === 7 && column === 6,
        color: NOT_SELECTED_CONFLICT_COLOR_RGB,
      },
      {
        condition: (row, column) => row === 7 && column === 7,
        color: SELECTED_COLOR_RGB,
      },
      {
        condition: (row, column) => row > 5 && column > 5,
        color: PEER_SELECTED_COLOR_RGB,
      },
      { condition: (row, column) => true, color: NOT_HIGHLIGHTED_COLOR_RGB },
    ]);
  });
});
