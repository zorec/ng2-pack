import { browser, element, by } from 'protractor/globals';

export class Ng2PackPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('iw-root h1')).getText();
  }
}
