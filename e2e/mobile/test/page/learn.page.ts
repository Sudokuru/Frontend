class LearnPage {
  public get title() {
    const selector =
      'new UiSelector().text("Learn new strategies").className("android.widget.TextView")';
    return $(`android=${selector}`);
  }
}

export default new LearnPage();
