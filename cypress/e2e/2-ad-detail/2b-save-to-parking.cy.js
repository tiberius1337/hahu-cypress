import adDetailPage from '../../pages/AdDetailPage';
import parkingPage from '../../pages/ParkingPage';
import ad from '../../fixtures/ad-data.json';

describe('Parking', () => {
  it('adds the ad to the parking', () => {
    cy.acceptCookies();
    cy.intercept('POST', '/api/parkolo').as('saveToParking');

    adDetailPage.visit();
    adDetailPage.parkingButton.should('contain.text', 'Parkolóba rakom');

    adDetailPage.clickParkingButton();
    cy.get('#loginModal').should('be.visible');
    cy.login();

    cy.wait('@saveToParking');
    cy.contains('.toast-body', 'A jármű parkolóba helyezése sikeres.').should('be.visible');
    adDetailPage.parkingButton.should('contain.text', 'Kiveszem a parkolóból');

    parkingPage.visit();
    parkingPage.adTitle(ad.title).should('be.visible');

    adDetailPage.visit();
    adDetailPage.clickParkingButton();
    adDetailPage.parkingButton.should('contain.text', 'Parkolóba rakom');
  });
});
