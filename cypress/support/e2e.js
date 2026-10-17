import './commands';

// hasznaltauto.hu loads many third-party scripts (tracking, Google, etc.) that throw errors, so uncaught exceptions are ignored
Cypress.on('uncaught:exception', () => false);
