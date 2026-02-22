import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { doesBoardHaveConflict, wrapDigit } from "./SudokuBoardFunctions";
import { BoardObjectProps, GameVariant } from "../../Functions/LocalDatabase";

interface UseKeyboardHotkeysProps {
  boardType: GameVariant;
  navigation: any;
  boardMethods: any;
  setSudokuBoard: (board: BoardObjectProps) => void;
}

/**
 * Custom hook for managing keyboard hotkey refs and event listener
 * Creates refs for all keyboard-accessible game functions and state,
 * and sets up the global keyboard event listener that uses these refs
 */
export const useKeyboardHotkeys = ({
  boardType,
  navigation,
  boardMethods,
  setSudokuBoard,
}: UseKeyboardHotkeysProps) => {
  const undoRef = useRef<any>(null);
  const toggleNoteModeRef = useRef<any>(null);
  const getHintRef = useRef<any>(null);
  const resetRef = useRef<any>(null);
  const updateCellEntryRef = useRef<any>(null);
  const eraseSelectedRef = useRef<any>(null);
  const updateHintStageRef = useRef<any>(null);
  const sudokuBoardRef = useRef<any>(null);
  const sudokuHintRef = useRef<any>(null);

  /**
   * When a user presses a key down, do the desired action via window.addEventListener
   * Uses refs to access current state and function implementations
   * @param event keyboard event
   * @returns void
   */
  const handleWindowKeyDown = (event: KeyboardEvent) => {
    if (!sudokuBoardRef.current) return;

    const inputValue = event.key;
    const board = sudokuBoardRef.current;
    const hint = sudokuHintRef.current;

    switch (inputValue) {
      case "u":
      case "U":
        if (board.actionHistory.length !== 0) {
          undoRef.current?.();
        }
        return;
      case "p":
      case "P":
        boardMethods[boardType].handlePause(board, navigation);
        return;
      case "t":
      case "T":
      case "n":
      case "N":
        toggleNoteModeRef.current?.();
        return;
      case "H":
      case "h":
        if (
          !doesBoardHaveConflict(
            board,
            boardMethods[boardType].doesCellHaveConflict,
          )
        ) {
          if (hint) {
            updateHintStageRef.current?.(
              1,
              boardMethods[boardType].finishSudokuGame,
            );
          } else {
            getHintRef.current?.();
          }
        }
        return;
      case "R":
      case "r":
        if (boardMethods[boardType].hasResetActionButton() === true) {
          resetRef.current?.();
        }
        return;
      default:
        break;
    }

    if (board.selectedCells.length === 0) {
      return;
    }

    if (/^[1-9]$/.test(inputValue)) {
      updateCellEntryRef.current?.(parseInt(inputValue, 10));
      return;
    }

    switch (inputValue) {
      case "Delete":
      case "Backspace":
      case "0":
      case "e":
      case "E":
        if (boardMethods[boardType].hasEraseActionButton() === true) {
          eraseSelectedRef.current?.();
        }
        break;
    }

    for (let i = 0; i < board.selectedCells.length; i++) {
      let newCol = board.selectedCells[i].c;
      let newRow = board.selectedCells[i].r;
      switch (inputValue) {
        case "ArrowLeft":
        case "a":
        case "A":
          newCol = wrapDigit(newCol - 1);
          break;
        case "ArrowRight":
        case "d":
        case "D":
          newCol = wrapDigit(newCol + 1);
          break;
        case "ArrowUp":
        case "w":
        case "W":
          newRow = wrapDigit(newRow - 1);
          break;
        case "ArrowDown":
        case "s":
        case "S":
          newRow = wrapDigit(newRow + 1);
          break;
        default:
          return;
      }
      board.selectedCells[i] = { r: newRow, c: newCol };
    }
    setSudokuBoard({
      ...board,
      selectedCells: board.selectedCells,
    });
  };

  // Setup keyboard event listeners for web platform using window.addEventListener
  // This allows hotkeys to work without requiring board focus
  useEffect(() => {
    if (Platform.OS !== "web") return;

    window.addEventListener("keydown", handleWindowKeyDown);
    return () => window.removeEventListener("keydown", handleWindowKeyDown);
  }, []);

  return {
    undoRef,
    toggleNoteModeRef,
    getHintRef,
    resetRef,
    updateCellEntryRef,
    eraseSelectedRef,
    updateHintStageRef,
    sudokuBoardRef,
    sudokuHintRef,
  };
};
