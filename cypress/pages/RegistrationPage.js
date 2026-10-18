class RegistrationPage {
  visit() {
    cy.visit('/regisztracio');
  }

  get nameInput() {
    return cy.get('input[name="name"]');
  }

  get emailInput() {
    return cy.get('input[name="email"]');
  }

  get confirmEmailInput() {
    return cy.get('input[name="confirmEmail"]');
  }

  get postalCodeInput() {
    return cy.get('input[role="combobox"]');
  }

  get passwordInput() {
    return cy.get('input[name="password"]');
  }

  get confirmPasswordInput() {
    return cy.get('input[name="confirmPassword"]');
  }

  get termsCheckbox() {
    return cy.contains('label', 'Elolvastam és elfogadom').find('input[type="checkbox"]');
  }

  get submitButton() {
    return cy.getByTestId('submit-button');
  }

  get nameError() {
    return this.getFieldError(this.nameInput);
  }

  get emailError() {
    return this.getFieldError(this.emailInput);
  }

  get passwordError() {
    return this.getFieldError(this.passwordInput);
  }

  typeName(name) {
    this.nameInput.clear().type(name).blur();
  }

  typeEmail(email) {
    this.emailInput.clear().type(email).blur();
  }

  typePassword(password) {
    this.passwordInput.clear().type(password).blur();
  }

  selectPostalCode(postalCode) {
    this.postalCodeInput.type(postalCode);
    cy.contains('[role="option"]', postalCode).click();
  }

  fillForm(user) {
    this.typeName(user.name);
    this.typeEmail(user.email);
    this.confirmEmailInput.type(user.email);
    this.selectPostalCode(user.postalCode);
    this.typePassword(user.password);
    this.confirmPasswordInput.type(user.password);
  }

  acceptTerms() {
    this.termsCheckbox.check({ force: true });
  }

  submit() {
    this.submitButton.click();
  }

  getFieldError(input) {
    return input.closest('.MuiFormControl-root').find('.MuiFormHelperText-root.Mui-error');
  }
}

export default new RegistrationPage();
