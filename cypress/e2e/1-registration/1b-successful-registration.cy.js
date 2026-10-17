import registrationPage from '../../pages/RegistrationPage';
import userData from '../../fixtures/user-data.json';

// unique e-mail on every run: alekosz.tibor+<timestamp>@gmail.com
const user = { ...userData, email: userData.email.replace('@', `+${Date.now()}@`) };

describe('Successful registration', () => {
  beforeEach(() => {
    registrationPage.visit();
    cy.acceptCookies();
  });

  it('registers a new user with valid data', () => {
    registrationPage.fillForm(user);
    registrationPage.acceptTerms();
    registrationPage.submit();

    cy.contains('Sikeres regisztráció!').should('be.visible');
  });
});
