import adDetailPage from '../../pages/AdDetailPage';
import ad from '../../fixtures/ad-data.json';

describe('Seller contact', () => {
  beforeEach(() => {
    adDetailPage.visit();
    cy.acceptCookies();
  });

  it('reveals the e-mail address', () => {
    adDetailPage.emailButton.should('not.contain.text', ad.sellerEmail).click();
    adDetailPage.emailLink.should('be.visible').and('contain.text', ad.sellerEmail);
  });

  it('reveals the phone number', () => {
    adDetailPage.phoneButton.should('not.contain.text', ad.sellerPhone).click();
    adDetailPage.phoneLink.should('be.visible').and('contain.text', ad.sellerPhone);
  });
});
