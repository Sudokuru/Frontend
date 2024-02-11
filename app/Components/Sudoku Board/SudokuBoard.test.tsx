import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
  userEvent,
} from "@testing-library/react-native";
import SudokuBoard from "./SudokuBoard";

test("Testing Board Renders", async () => {
  const board = await waitFor(() => render(<SudokuBoard action="StartGame" />));

  expect(board).toBeTruthy();
});

test("Testing Board Renders", async () => {
  const board = await waitFor(() => render(<SudokuBoard action="StartGame" />));

  const emptyCell = screen.queryByTestId("cellr0c0value:0");
  const filledCell = screen.queryByTestId("cellr0c0value:1");

  expect(emptyCell).toBeTruthy();
  expect(filledCell).toBeFalsy();

  await act(async () => {
    await fireEvent.press(emptyCell);
    await fireEvent.changeText(emptyCell, "1");
  });

  const newEmptyCell = screen.queryByTestId("cellr0c0value:0");
  const newFilledCell = screen.queryByTestId("cellr0c0value:1");

  expect(newEmptyCell).toBeTruthy();
  expect(newFilledCell).toBeTruthy();
});
