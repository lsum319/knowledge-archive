const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const form = document.getElementById('signupForm');
const checkEmailBtn = document.getElementById('checkEmailBtn');
const emailCheckMessage = document.getElementById('emailCheckMessage');
const passwordMessage = document.getElementById('passwordMessage');
const messageBox = document.getElementById('message');
const successModal = document.getElementById('successModal');
const confirmSignupBtn = document.getElementById('confirmSignupBtn');

let isEmailChecked = false;
let isEmailAvailable = false;

const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

function setMessage(element, text, isError = true) {
    element.textContent = text;
    element.classList.toggle('success', !isError);
    element.classList.toggle('error', isError);
}

function validateEmailFormat(email) {
    return emailPattern.test(email);
}

async function checkDuplicateEmail() {
    const email = emailInput.value.trim();
    emailCheckMessage.textContent = '';
    messageBox.textContent = '';

    if (!email) {
        setMessage(emailCheckMessage, 'Please enter your email.', true);
        return;
    }

    if (!validateEmailFormat(email)) {
        setMessage(emailCheckMessage, 'Please enter a valid email format.', true);
        return;
    }

    try {
        const response = await fetch(`/user/check-email?email=${encodeURIComponent(email)}`);
        const exists = await response.json();

        if (exists) {
            isEmailChecked = true;
            isEmailAvailable = false;
            setMessage(emailCheckMessage, 'This email is already registered.', true);
            return;
        }

        isEmailChecked = true;
        isEmailAvailable = true;
        setMessage(emailCheckMessage, 'This email is available.', false);
    } catch (error) {
        console.error(error);
        isEmailChecked = false;
        isEmailAvailable = false;
        setMessage(emailCheckMessage, 'Unable to verify email. Please try again.', true);
    }
}

function validatePasswordMatch() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!confirmPassword) {
        passwordMessage.textContent = '';
        return false;
    }

    if (password !== confirmPassword) {
        setMessage(passwordMessage, 'Passwords do not match.', true);
        return false;
    }

    setMessage(passwordMessage, 'Passwords match.', false);
    return true;
}

checkEmailBtn.addEventListener('click', checkDuplicateEmail);
emailInput.addEventListener('input', () => {
    isEmailChecked = false;
    isEmailAvailable = false;
    emailCheckMessage.textContent = '';
    messageBox.textContent = '';
});
confirmPasswordInput.addEventListener('input', validatePasswordMatch);

form.addEventListener('submit', async event => {
    event.preventDefault();
    messageBox.textContent = '';

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!email || !validateEmailFormat(email)) {
        setMessage(messageBox, 'Please enter a valid email format.', true);
        return;
    }

    if (!isEmailChecked || !isEmailAvailable) {
        setMessage(messageBox, 'Please check email duplication before signing up.', true);
        return;
    }

    if (password.length < 5 || password.length > 15) {
        setMessage(messageBox, 'Password must be between 5 and 15 characters.', true);
        return;
    }

    if (!confirmPassword || password !== confirmPassword) {
        setMessage(messageBox, 'Please confirm your password correctly.', true);
        return;
    }

    try {
        const response = await fetch('/user/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            successModal.classList.remove('hidden');
            successModal.setAttribute('aria-hidden', 'false');
            return;
        }

        const errorData = await response.json().catch(() => ({ message: 'Sign up failed.' }));
        setMessage(messageBox, errorData.message || 'Sign up failed.', true);
    } catch (error) {
        console.error(error);
        setMessage(messageBox, 'An error occurred while creating the account.', true);
    }
});

confirmSignupBtn.addEventListener('click', () => {
    window.location.href = '/login.html';
});
