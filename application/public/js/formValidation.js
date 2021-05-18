const form = document.getElementsByTagName('form')[0];

const formUsername = document.getElementById('username');
const usernameError = document.getElementById('username-error');
let usernameReturnValue = '';

const formEmail = document.getElementById('email');
const emailError = document.getElementById('email-error');
let emailReturnValue = '';

const formPassword = document.getElementById('password');
const passwordError = document.getElementById('password-error');
let passwordReturnValue = '';

const formConfirmPassword = document.getElementById('confirm-password');
const confirmPasswordError = document.getElementById('confirm-password-error');



function validateUsername() {
    let errorMessage = [];
    const startsWithChar = /^[a-z]/i;
    const isAlphanumeric = /^[a-z0-9]+$/i;

    if (!startsWithChar.test(formUsername.value)) {
        errorMessage.push('Username must start with an alphabetic character');
    }
    if (!isAlphanumeric.test(formUsername.value)) {
        errorMessage.push('Username must be alphanumeric');
    }
    if (formUsername.value.length < 3) {
        errorMessage.push('Username must be 3 or more characters long');
    }
    if (formUsername.value.length < 1) {
        errorMessage = ['Please fill in username field'];
    }

    if (errorMessage.length > 1) {
        errorMessage.forEach(function (value, i) {
            if (i == 0)
                usernameReturnValue = value;
            else
                usernameReturnValue += '\n' + value;
        });
    }
    else
        usernameReturnValue = errorMessage;
}

function validateEmail() {
    let errorMessage = [];
    const isValidEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!isValidEmail.test(formEmail.value)) {
        errorMessage.push('Invalid email');
    }
    if (formEmail.value.length < 1) {
        errorMessage = ['Please fill in email field'];
    }

    if (errorMessage.length > 1) {
        errorMessage.forEach(function (value, i) {
            if (i == 0)
                emailReturnValue = value;
            else
                emailReturnValue += '\n' + value;
        });
    }
    else
        emailReturnValue = errorMessage;
}

function validatePassword() {
    let errorMessage = [];
    const hasUpper = /[A-Z]/;
    const hasNum = /[0-9]/;
    const hasSpecial = /[\/*-+!@#$^&*]/;


    if (!hasUpper.test(formPassword.value)) {
        errorMessage.push('Password must have at least 1 uppercase letter');
    }
    if (!hasNum.test(formPassword.value)) {
        errorMessage.push('Password must have at least 1 number');
    }
    if (!hasSpecial.test(formPassword.value)) {
        errorMessage.push('Password must have at least 1 of the following special characters (/ * -+! @ # $ ^ & * )');
    }
    if (formPassword.value.length < 8) {
        errorMessage.push('Password must be 8 or more characters long');
    }
    if (formPassword.value.length < 1) {
        errorMessage = ['Please fill in password field'];
    }

    if (errorMessage.length > 1) {
        errorMessage.forEach(function (value, i) {
            if (i == 0)
                passwordReturnValue = value;
            else
                passwordReturnValue += '\n' + value;
        });
    }
    else
        passwordReturnValue = errorMessage;
}

form.addEventListener('submit', function (event) {
    validateUsername();
    validateEmail();
    validatePassword();

    if (emailReturnValue != '') {
        emailError.textContent = emailReturnValue;

        emailError.className = 'error active';
        event.preventDefault();
    }
    else
        emailError.className = 'error';

    if (usernameReturnValue != '') {
        usernameError.textContent = usernameReturnValue;

        usernameError.className = 'error active';
        event.preventDefault();
    }
    else
        usernameError.className = 'error';

    if (passwordReturnValue != '') {
        passwordError.textContent = passwordReturnValue;

        passwordError.className = 'error active';
        event.preventDefault();
    }
    else
        passwordError.className = 'error';

    if (formConfirmPassword.value != formPassword.value) {
        confirmPasswordError.textContent = 'Passwords need to match';

        confirmPasswordError.className = 'error active';
        event.preventDefault();
    }
    else
        confirmPasswordError.className = 'error';

    usernameReturnValue = '';
    emailReturnValue = '';
    passwordReturnValue = '';
});

form.addEventListener('reset', function (event) {
    emailError.textContent = '';
    emailError.className = 'error';
    usernameError.textContent = '';
    usernameError.className = 'error';
    passwordError.textContent = '';
    passwordError.className = 'error';
    confirmPasswordError.textContent = '';
    confirmPasswordError.className = 'error';

    emailReturnValue = '';
    usernameReturnValue = '';
    passwordReturnValue = '';
});