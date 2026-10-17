class ParkingPage {
  visit() {
    cy.visit('/parkolo');
  }

  adTitle(title) {
    return cy.contains('.listing-card__title', title);
  }
}

export default new ParkingPage();
