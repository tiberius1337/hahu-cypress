// Login flow
Cypress.Commands.add('login', () => {
  cy.env(['loginEmail', 'loginPassword']).then(({ loginEmail, loginPassword }) => {
    cy.get('[data-testid="loginform-username"] input').type(loginEmail);
    cy.get('[data-testid="loginform-password"] input').type(loginPassword, { log: false });
    cy.get('[data-testid="loginform-submit"]').click();
  });
});

// Didomi accept
Cypress.Commands.add('acceptCookies', () => {
  cy.get('#didomi-notice-agree-button').click();
  cy.get('#didomi-popup').should('not.exist');
});
