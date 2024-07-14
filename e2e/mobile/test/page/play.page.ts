class PlayPage {
  public get title() {
    const selector =
      'new UiSelector().text("Play a Sudoku game").className("android.widget.TextView")';
    return $(`android=${selector}`);
  }
}

export default new PlayPage();
