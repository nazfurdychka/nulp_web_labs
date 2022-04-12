const backendUrl = 'http://127.0.0.1:5000/auth/login';
const submitButton = document.querySelector('.login_button');
const errorMessage = document.getElementById('error-message');

if (window.localStorage.getItem('logged_in_user')) {
    window.location.href = '../templates/profile.html';
}

function loginUser(userData) {
    const headers = new Headers();
    headers.set('content-type', 'application/json');
    return fetch(backendUrl, {
        method: 'POST',
        body: JSON.stringify(userData),
        headers,
    });
}

async function loginButtonHandler(event) {
    event.preventDefault();
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    const userData = {
        username: username.value,
        password: password.value,
    };

    const hash = btoa(`${username.value}:${password.value}`);
    loginUser(userData)
        .then(async (response) => {
            if (response.status !== 200) {
                throw new Error(await response.text());
            }
            return response.text();
        })
        .then(() => {
            window.localStorage.setItem('logged_in_user', hash);
            window.location.href = '../templates/profile.html';
        })
        .catch((error) => {
            console.log(`Fetch error: ${error}`);
            errorMessage.textContent = JSON.parse(error.message).message;
        });
}

submitButton.addEventListener('click', loginButtonHandler);
