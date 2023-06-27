const loginPage = {
    loginInput: 'input[name="loginName"]',
    loginInputErrorMessage: '.Input_spanError__eDd4-',
    passwordInput: 'input[name="password"]',
    passwordInputErrorMessage: 'label:nth-child(2) > span.Input_msgError__es_bp',
    submitButton: 'button[type="submit"]',
    invalidDataMessage:'div[class^=Login_error_message]',
    resetPassButton: 'button[class*=Login_forgotPasswordButton]',
    resetPassMessage: 'div[class^=Login_warning_message]',
    resetPassLink: 'a[class^=Login_link]'
}

export default loginPage;
