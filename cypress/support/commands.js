// Select element by data-testid
Cypress.Commands.add('getByTestId', { prevSubject: 'optional' }, (subject, id) => {
  const selector = `[data-testid="${id}"]`;
  return subject ? cy.wrap(subject).find(selector) : cy.get(selector);
});

// Login flow
Cypress.Commands.add('login', () => {
  cy.env(['loginEmail', 'loginPassword']).then(({ loginEmail, loginPassword }) => {
    cy.getByTestId('loginform-username').find('input').type(loginEmail);
    cy.getByTestId('loginform-password').find('input').type(loginPassword, { log: false });
    cy.getByTestId('loginform-submit').click();
  });
});

// Didomi accept, cached in a session
Cypress.Commands.add('acceptCookies', () => {
  cy.session(
    'didomi-consent',
    () => {
      cy.visit('/');
      cy.get('#didomi-notice-agree-button').click();
      cy.get('#didomi-popup').should('not.exist');
    },
    {
      validate() {
        cy.getCookie('euconsent-v2').should('exist');
      },
      cacheAcrossSpecs: true,
    },
  );
});
