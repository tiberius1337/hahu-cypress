import registrationPage from '../../pages/RegistrationPage';

describe('Registration error messages', () => {
  beforeEach(() => {
    registrationPage.visit();
    cy.acceptCookies();
  });

  context('Name field', () => {
    it('shows an error when the name is too short', () => {
      registrationPage.typeName('Ab');
      registrationPage.nameError.should('have.text', 'A névnek minimum 3 karakternek kell lennie.');
    });

    it('shows an error when the name contains special characters', () => {
      registrationPage.typeName('Teszt@Elek');
      registrationPage.nameError.should(
        'have.text',
        'A név nem tartalmazhat különleges karaktereket.',
      );
    });

    it('shows an error when the name is too long', () => {
      registrationPage.typeName('a'.repeat(256));
      registrationPage.nameError.should('have.text', 'A név maximum 255 karakter lehet.');
    });
  });

  context('E-mail field', () => {
    it('shows an error when the e-mail address is invalid', () => {
      registrationPage.typeEmail('teszt@');
      registrationPage.emailError.should('have.text', 'Nem megfelelő e-mail cím.');
    });

    it('shows an error when the e-mail address is already registered', () => {
      cy.env(['loginEmail']).then(({ loginEmail }) => {
        registrationPage.typeEmail(loginEmail);
      });
      registrationPage.emailError.should(
        'have.text',
        'A megadott e-mail cím már használatban van.',
      );
    });
  });

  context('Password field', () => {
    it('shows an error when the password is too short', () => {
      registrationPage.typePassword('Abcd123');
      registrationPage.passwordError.should(
        'have.text',
        'A jelszónak minimum 8 karakternek kell lennie.',
      );
    });

    it('shows an error when the password is too long', () => {
      registrationPage.typePassword('a'.repeat(256));
      registrationPage.passwordError.should('have.text', 'A jelszó maximum 255 karakter lehet.');
    });
  });
});
