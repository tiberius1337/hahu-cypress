import registrationPage from '../../pages/RegistrationPage';
import errors from '../../fixtures/registration-errors.json';

describe('Registration error messages', () => {
  beforeEach(() => {
    cy.acceptCookies();
    registrationPage.visit();
  });

  context('Name field', () => {
    it('shows an error when the name is too short', () => {
      registrationPage.typeName('Ab');
      registrationPage.nameError.should('have.text', errors.nameTooShort);
    });

    it('shows an error when the name contains special characters', () => {
      registrationPage.typeName('Teszt@Elek');
      registrationPage.nameError.should('have.text', errors.nameSpecialChars);
    });

    it('shows an error when the name is too long', () => {
      registrationPage.typeName('a'.repeat(256));
      registrationPage.nameError.should('have.text', errors.nameTooLong);
    });
  });

  context('E-mail field', () => {
    it('shows an error when the e-mail address is invalid', () => {
      registrationPage.typeEmail('teszt@');
      registrationPage.emailError.should('have.text', errors.emailInvalid);
    });

    it('shows an error when the e-mail address is already registered', () => {
      cy.env(['loginEmail']).then(({ loginEmail }) => {
        registrationPage.typeEmail(loginEmail);
      });
      registrationPage.emailError.should('have.text', errors.emailTaken);
    });
  });

  context('Password field', () => {
    it('shows an error when the password is too short', () => {
      registrationPage.typePassword('Abcd123');
      registrationPage.passwordError.should('have.text', errors.passwordTooShort);
    });

    it('shows an error when the password is too long', () => {
      registrationPage.typePassword('a'.repeat(256));
      registrationPage.passwordError.should('have.text', errors.passwordTooLong);
    });
  });
});
