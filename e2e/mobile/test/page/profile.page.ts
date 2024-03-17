class ProfilePage {
  public get title() {
    const selector =
      'new UiSelector().text("Profile").className("android.widget.TextView")';
    return $(`android=${selector}`);
  }
}

export default new ProfilePage();
