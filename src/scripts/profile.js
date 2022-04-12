const backendUrl = 'http://127.0.0.1:5000/user/';

const errorMessage = document.getElementById('error-message');
const logoutButton = document.getElementById('logout_button');
const saveChangesButton = document.getElementById('save_button');
const resetButton = document.getElementById('reset_button');
const deleteButton = document.getElementById('delete_button');

const currentUser = atob(window.localStorage.getItem('logged_in_user'));

function getCurrentUserCreds() {
    return atob(window.localStorage.getItem('logged_in_user')).split(':');
}

if (!currentUser) {
    window.location.href = '../templates/login.html';
}

function getUser() {
    const headers = new Headers();
    headers.set('Authorization', `Basic ${window.localStorage.getItem('logged_in_user')}`);
    headers.set('content-type', 'application/json');
    fetch(backendUrl + getCurrentUserCreds()[0], {
        method: 'GET',
        headers,
    }).then((response) => {
        if (response.status === 200) {
            return response.json();
        }
    }).then((data) => {
        const firstName = document.getElementById('first_name');
        firstName.value = data.firstName;
        const lastName = document.getElementById('last_name');
        lastName.value = data.lastName;
        const username = document.getElementById('username');
        username.value = data.username;
        const password = document.getElementById('password');
        password.value = '';
        const confirmPassword = document.getElementById('confirm_password');
        confirmPassword.value = '';
    });
}

function deleteUser() {
    const headers = new Headers();
    headers.set('Authorization', `Basic ${window.localStorage.getItem('logged_in_user')}`);
    headers.set('content-type', 'application/json');
    fetch(backendUrl + getCurrentUserCreds()[0], {
        method: 'DELETE',
        headers,
    }).then(() => {
        window.localStorage.removeItem('logged_in_user');
        window.location.href = '../templates/login.html';
    });
}

function updateUser(userData) {
    const headers = new Headers();
    headers.set('Authorization', `Basic ${window.localStorage.getItem('logged_in_user')}`);
    headers.set('content-type', 'application/json');
    return fetch(backendUrl + getCurrentUserCreds()[0], {
        method: 'PUT',
        body: JSON.stringify(userData),
        headers,
    });
}

async function saveButtonHandler(event) {
    event.preventDefault();
    const username = document.getElementById('username');
    const firstName = document.getElementById('first_name');
    const lastName = document.getElementById('last_name');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm_password');
    if (password.value !== '' || confirmPassword.value !== '') {
        if (password.value !== confirmPassword.value) {
            errorMessage.textContent = 'Password are not the same';
            return;
        }
    }
    const userData = {
        username: username.value,
        firstName: firstName.value,
        lastName: lastName.value,
    };

    if (password.value !== '') {
        userData.password = password.value;
    }

    updateUser(userData)
        .then(async (response) => {
            if (!response.ok) {
                throw new Error(await response.text());
            }
            let token;

            if (typeof userData.password !== 'undefined') {
                token = `${userData.username}:${userData.password}`;
            } else {
                token = `${userData.username}:${getCurrentUserCreds()[1]}`;
            }

            const hash = btoa(token);
            window.localStorage.setItem('logged_in_user', hash);
            window.location.href = '../templates/profile.html';

            return response.text();
        })
        .catch((error) => {
            console.log(`Fetch error: ${error}`);
            errorMessage.textContent = JSON.parse(error.message).message;
        });
}

function resetButtonHandler(event) {
    event.preventDefault();
    getUser();
}

function logoutButtonHandler(event) {
    event.preventDefault();
    window.localStorage.removeItem('logged_in_user');
    window.location.href = '../templates/login.html';
}

function deleteButtonHandler(event) {
    event.preventDefault();
    deleteUser();
}

logoutButton.addEventListener('click', logoutButtonHandler);
saveChangesButton.addEventListener('click', saveButtonHandler);
resetButton.addEventListener('click', resetButtonHandler);
deleteButton.addEventListener('click', deleteButtonHandler);
window.addEventListener('load', getUser);
