import adDetailPage from '../../pages/AdDetailPage';

describe('Partner links', () => {
  beforeEach(() => {
    adDetailPage.visit();
    cy.acceptCookies();
  });

  it('opens carVertical in a new tab', () => {
    adDetailPage.carVerticalLink
      .should('be.visible')
      .and('have.attr', 'target', '_blank')
      .and('have.attr', 'href')
      .and('include', 'carvertical.com');
  });

  it('opens Totalkár in a new tab', () => {
    adDetailPage.totalkarLink
      .should('be.visible')
      .and('have.attr', 'target', '_blank')
      .and('have.attr', 'href')
      .and('include', 'totalkar.totalcar.hu');
  });
});
