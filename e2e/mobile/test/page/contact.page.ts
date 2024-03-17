class ContactPage {
  public get title() {
    const selector =
      'new UiSelector().text("Contact Us").className("android.widget.TextView")';
    return $(`android=${selector}`);
  }
}

export default new ContactPage();
