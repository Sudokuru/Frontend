class DrillPage {
  public get title() {
    const selector =
      'new UiSelector().text("Train with a strategy").className("android.widget.TextView")';
    return $(`android=${selector}`);
  }
}

export default new DrillPage();
