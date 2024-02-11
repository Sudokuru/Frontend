import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react-native";
import SudokuBoard from "./SudokuBoard";

test("Testing Board Renders", async () => {
  const board = await waitFor(() => render(<SudokuBoard action="StartGame" />));

  expect(board).toBeTruthy();
});
