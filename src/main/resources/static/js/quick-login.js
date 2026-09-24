const testAccount = {
    email: 'test@test.com',
    password: 'testtest'
};

export const initializeQuickLogin = ({form, emailInput, passwordInput, submitButton}) => {
    const quickLoginButton = document.createElement('button');
    quickLoginButton.type = 'button';
    quickLoginButton.className = 'button quickLogin';
    quickLoginButton.textContent = 'Login with test account';
    quickLoginButton.addEventListener('click', () => {
        emailInput.value = testAccount.email;
        passwordInput.value = testAccount.password;
        form.requestSubmit();
    });
    submitButton.after(quickLoginButton);
};
