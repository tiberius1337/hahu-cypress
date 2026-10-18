import ad from '../fixtures/ad-data.json';

class AdDetailPage {
  visit() {
    cy.visit(ad.path);
  }

  get parkingButton() {
    return cy.get('[data-controller="details--parking-button"]');
  }

  clickParkingButton() {
    this.parkingButton.click();
  }

  get moneyCalculator() {
    return cy.get('iframe[title="Money kalkulátor"]');
  }

  get carVerticalLink() {
    return cy.get('a.btn-carvertical');
  }

  get totalkarLink() {
    return cy.get('a.btn-totalkar');
  }

  get emailButton() {
    return cy.get('#seller-info-sidebar').getByTestId('seller-email');
  }

  get phoneButton() {
    return cy.get('#seller-info-sidebar').getByTestId('seller-phone-number-primary');
  }

  get emailLink() {
    return cy.get('#seller-info-sidebar a[href^="mailto:"]');
  }

  get phoneLink() {
    return cy.get('#seller-info-sidebar a[href^="tel:"]');
  }
}

export default new AdDetailPage();
