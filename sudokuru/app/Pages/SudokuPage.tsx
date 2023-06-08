import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import SudokuBoard from "../Components/Sudoku Board/SudokuBoard";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Header from "../Components/Header";
import Alert from "react-native-awesome-alerts";
import { useTheme } from "react-native-paper";
import EndGameModal from "../Components/Sudoku Board/EndGameModal";
import { rgba } from "polished";
import { PreferencesContext } from "../Contexts/PreferencesContext";
import { convertLessonsToStrategies } from "../Functions/ContextParsing/learnedLessons";

// startGame - https://www.npmjs.com/package/sudokuru#:~:text=sudokuru.Puzzles%3B-,Puzzles.startGame(),-Description%3A%20Returns%20puzzle

const SudokuPage = ({ route, navigation }: any) => {
  const { learnedLessons } = React.useContext(PreferencesContext);
  const cloneLearnedLessons = [...learnedLessons];

  const { gameType } = route.params;
  const { difficulty } = route.params;

  const theme = useTheme();

  const [gameResultsVisible, setGameResultsVisible] = React.useState(false);

  const [gameResultScore, setGameResultScore] = React.useState(0);
  const [gameResultTime, setGameResultTime] = React.useState(0);
  const [gameResultNumHintsUsed, setGameResultNumHintsUsed] = React.useState(0);
  const [gameResultNumWrongCellsPlayed, setGameResultNumWrongCellsPlayed] =
    React.useState(0);
  const [gameResultPuzzleDifficulty, setGameResultPuzzleDifficulty] =
    React.useState(0);

  const showGameResults = (
    score: number,
    time: number,
    numHintsUsed: number,
    numWrongCellsPlayed: number,
    puzzleDifficulty: number
  ) => {
    setGameResultScore(score);
    setGameResultTime(time);
    setGameResultNumHintsUsed(numHintsUsed);
    setGameResultNumWrongCellsPlayed(numWrongCellsPlayed);
    setGameResultPuzzleDifficulty(puzzleDifficulty);
  };

  // we show the game results if time does not equal zero and on score change
  useEffect(() => {
    if (gameResultTime != 0) {
      setGameResultsVisible(true);
    }
  }, [gameResultTime]);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Header page={"Sudoku"} />
        <View style={homeScreenStyles.home}>
          <View style={styles.statisticsTitle}>
            {/* The game now required the info about it to be rendered, which is given in generateGame() */}
            <SudokuBoard
              gameType={gameType}
              difficulty={difficulty}
              strategies={convertLessonsToStrategies(cloneLearnedLessons)}
              navigation={navigation}
              showGameResults={showGameResults}
            />
            <StatusBar style="auto" />
          </View>
        </View>
        <Alert
          show={gameResultsVisible}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          customView={
            <EndGameModal
              score={gameResultScore}
              time={gameResultTime}
              numHintsUsed={gameResultNumHintsUsed}
              numWrongCellsPlayed={gameResultNumWrongCellsPlayed}
              difficulty={gameResultPuzzleDifficulty}
            ></EndGameModal>
          }
          alertContainerStyle={{
            backgroundColor: rgba(theme.colors.background, 0.3),
          }}
          overlayStyle={{ backgroundColor: "transparent" }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  statisticsTitle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

const homeScreenStyles = StyleSheet.create({
  home: {
    display: "flex",
    flexDirection: "row",
  },
});

export default SudokuPage;
