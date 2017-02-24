import { Ng2PackPage } from './app.po';

describe('ng2-pack App', () => {
  let page: Ng2PackPage;

  beforeEach(() => {
    page = new Ng2PackPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
