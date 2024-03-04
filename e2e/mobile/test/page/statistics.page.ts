class StatisticsPage {
  public get title() {
    const selector =
      'new UiSelector().text("Total Game Statistics").className("android.widget.TextView")';
    return $(`android=${selector}`);
  }
}

export default new StatisticsPage();
