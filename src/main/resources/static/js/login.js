import {initializeQuickLogin} from './quick-login.js';

const loginForm = document.getElementById('loginForm');

// Initialize quick login button
initializeQuickLogin({
    form: loginForm,
    emailInput: document.getElementById('email'),
    passwordInput: document.getElementById('password'),
    submitButton: loginForm.querySelector('button[type="submit"]')
});

loginForm.addEventListener('submit', async event => {
    event.preventDefault();
    const message = document.getElementById('message');
    const formData = new URLSearchParams(new FormData(event.currentTarget));
    try {
        const response = await fetch('/user/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: formData
        });
        if (response.ok) location.href = '/materials.html'; else message.textContent = 'Login failed.'
    } catch (error) {
        console.error(error);
        message.textContent = 'Login request failed.'
    }
});
