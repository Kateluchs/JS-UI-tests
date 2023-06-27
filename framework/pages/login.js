const loginPage = {
    loginInput: 'input[name="loginName"]',
    loginInputErrorMessage: '.Input_spanError__eDd4-:nth-child(1)',
    passwordInput: 'input[name="password"]',
    passwordInputErrorMessage: '.Input_spanError__eDd4-:nth-child(2)',
    submitButton: 'button[type="submit"]',
    invalidDataMessage:'div[class^=Login_error_message]',
    resetPassButton: 'button[class^=Login_forgotPasswordButton]',
    resetPassMessage: 'div[class^=Login_warning_message]',
    resetPassLink: 'a[class^=Login_link]'
}

export default loginPage;
