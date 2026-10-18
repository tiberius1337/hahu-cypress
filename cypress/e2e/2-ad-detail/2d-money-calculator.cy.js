import adDetailPage from '../../pages/AdDetailPage';
import ad from '../../fixtures/ad-data.json';

describe('Money calculator', () => {
  it('shows the calculator with the price of the car', () => {
    cy.acceptCookies();
    adDetailPage.visit();

    adDetailPage.moneyCalculator
      .should('be.visible')
      .and('have.attr', 'src')
      .and('include', 'money.hu')
      .and('include', `price=${ad.price}`);
  });
});
