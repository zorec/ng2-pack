import { Ng2PackPage } from './app.po';

describe('ng2-pack App', function() {
  let page: Ng2PackPage;

  beforeEach(() => {
    page = new Ng2PackPage();
  });

  it('should display message saying Data Table ', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Data Table');
  });
});
