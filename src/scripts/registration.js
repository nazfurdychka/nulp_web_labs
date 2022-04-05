const backendUrl = 'http://127.0.0.1:5000/auth/register';

const submitButton = document.querySelector('.register_button');
const errorMessage = document.getElementById('error-message');

if (window.localStorage.getItem('logged_in_user')) {
    window.location.href = '../templates/profile.html';
}

function registerUser(userData) {
    const headers = new Headers();
    headers.set('content-type', 'application/json');
    return fetch(backendUrl, {
        method: 'POST',
        body: JSON.stringify(userData),
        headers,
    });
}

function registerButtonHandler(event) {
    event.preventDefault();
    const username = document.getElementById('username');
    const firstName = document.getElementById('first_name');
    const lastName = document.getElementById('last_name');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm_password');
    const userType = document.getElementById('user-type-selector');

    if (password.value !== confirmPassword.value) {
        errorMessage.textContent = 'Password are not the same';
        return;
    }

    const userData = {
        username: username.value,
        firstName: firstName.value,
        lastName: lastName.value,
        password: password.value,
        userType: userType.options[userType.selectedIndex].text,
    };

    registerUser(userData)
        .then(async (response) => {
            if (!response.ok) {
                throw new Error(await response.text());
            }
            return response.text();
        })
        .then(() => {
            window.location.href = '../templates/login.html';
        })
        .catch((error) => {
            console.log(`Fetch error: ${error}`);
            errorMessage.textContent = JSON.parse(error.message).message;
        });
}

submitButton.addEventListener('click', registerButtonHandler);
