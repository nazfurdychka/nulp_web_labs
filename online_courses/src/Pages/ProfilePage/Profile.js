import React, { useEffect, useState } from 'react';

import './Profile.css';
import { Navigate, useNavigate } from 'react-router-dom';
import { encode as base64_encode } from 'base-64';
import Header from '../../Components/Header';
import { decode as base64_decode } from 'base-64';

const Profile = () => {

    const backendUrl = 'http://127.0.0.1:5000/user/';

    const navigation = useNavigate();

    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [loggedInUser, setLoggedInUser] = useState(
        localStorage.getItem('logged_in_user')
    );

    const [errorMessage, setErrorMessage] = useState('');

    function getUser() {
        let username = base64_decode(loggedInUser)
            .split(':')[0];
        const headers = new Headers();
        headers.set('Authorization', `Basic ${localStorage.getItem('logged_in_user')}`);
        headers.set('content-type', 'application/json');
        fetch(backendUrl + username, {
            method: 'GET',
            headers,
        })
            .then(async (response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(await response.text());
                }
            })
            .then((data) => {
                setUserData({
                    ...userData,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    username: data.username,
                    password: base64_decode(loggedInUser)
                        .split(':')[1],
                    confirmPassword: base64_decode(loggedInUser)
                        .split(':')[1],
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        getUser();
    }, []);

    const handleChange = e => {
        setErrorMessage(null);
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    const deleteButtonHandler = event => {
        event.preventDefault();

        const username = base64_decode(loggedInUser)
            .split(':')[0];
        const headers = new Headers();
        headers.set('Authorization', `Basic ${localStorage.getItem('logged_in_user')}`);
        headers.set('content-type', 'application/json');
        fetch(backendUrl + username, {
            method: 'DELETE',
            headers,
        })
            .then(() => {
                window.localStorage.removeItem('logged_in_user');
                setLoggedInUser(null);
                navigation('/login');
            })
            .catch((error) => {
                let errorMessage = JSON.parse(error.message).message;
                setErrorMessage(errorMessage);
            });
    };

    const saveButtonHandler = event => {
        event.preventDefault();
        const username = base64_decode(loggedInUser)
            .split(':')[0];
        setErrorMessage(null);

        if (userData.password !== userData.confirmPassword) {
            setErrorMessage('Password are not the same');
            return;

        }

        const data = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            username: userData.username,
            password: userData.password,
        };

        const headers = new Headers();
        headers.set('content-type', 'application/json');
        headers.set('Authorization', `Basic ${localStorage.getItem('logged_in_user')}`);
        fetch(backendUrl + username, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers,
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(await response.text());
                }
                const hash = base64_encode(`${data.username}:${data.password}`);
                localStorage.setItem('logged_in_user', hash);
                setLoggedInUser(hash);
                navigation('/profile');
            })
            .catch((error) => {
                let errorMessage = JSON.parse(error.message).message;
                setErrorMessage(errorMessage);
            });
    };

    if (!localStorage.getItem('logged_in_user')) {
        return <Navigate to="/login"/>;
    }

    return (<div className="root-wrapper">
            <Header/>

            <div className="wrapper">
                <div className="user-image">
                    <img className="user_profile_img" src={require('../../img/profile-image.jpg')} alt="Profile image"/>
                </div>
                <form className="user-profile-form" name="form">
                    <h3>First name:</h3>
                    <input type="text" className="user_profile__input" name="firstName"
                           onChange={handleChange} value={userData.firstName}/>
                    <h3>Second name:</h3>
                    <input type="text" className="user_profile__input" name="lastName"
                           onChange={handleChange} value={userData.lastName}/>
                    <h3>Username:</h3>
                    <input type="text" className="user_profile__input" name="username"
                           onChange={handleChange} value={userData.username}/>
                    <h3>Password:</h3>
                    <input type="password" className="user_profile__input" name="password"
                           onChange={handleChange}/>
                    <h3>Confirm password:</h3>
                    <input type="password" className="user_profile__input"
                           name="confirmPassword" onChange={handleChange}/>
                    {errorMessage && <div id="error-message">{errorMessage}</div>}
                    <div className="button-wrapper">
                        <button type="submit" id="save_button" onClick={saveButtonHandler}
                                className="user-profile-button">Save Changes
                        </button>
                        <button type="button" id="reset_button" onClick={getUser}
                                className="user-profile-button">Reset Changes
                        </button>
                        <button type="button" id="delete_button" onClick={deleteButtonHandler}
                                className="user-profile-button">Delete Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

};

export default Profile;
