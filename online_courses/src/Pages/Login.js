import React, { useState } from 'react';

import './Login.css';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { encode as base64_encode } from 'base-64';

const Login = () => {

    const backendUrl = 'http://127.0.0.1:5000/auth/login';

    const navigation = useNavigate();

    const [errorMessage, setErrorMessage] = useState('');

    const [userData, setUserData] = useState({
        username: '',
        password: ''
    });

    const handleChange = e => {
        console.log(e);
        setErrorMessage(null);
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };


    const loginButtonHandler = event => {
        event.preventDefault();

        const hash = base64_encode(`${userData.username}:${userData.password}`);
        const headers = new Headers();
        headers.set('content-type', 'application/json');
        fetch(backendUrl, {
            method: 'POST',
            body: JSON.stringify(userData),
            headers,
        })
            .then(async (response) => {
                if (response.status !== 200) {
                    throw new Error(await response.text());
                }
                return response.text();
            })
            .then(() => {
                window.localStorage.setItem('logged_in_user', hash);
                navigation('/profile');
            })
            .catch((error) => {
                let errorMessage = JSON.parse(error.message).message;
                setErrorMessage(errorMessage);
            });
    };

    if (localStorage.getItem('logged_in_user')) {
        return <Navigate to="/"/>;
    }

    return (<div className="wrapper">

        <form className="login_form" onSubmit={loginButtonHandler}>
            <div className="form_header">Welcome!</div>

            <div className="form_input">
                <h3>Enter username:</h3>
                <input className="field_input" type="text" placeholder="Username" name="username"
                       onChange={handleChange}/>
            </div>

            <div className="form_input">
                <h3>Enter password:</h3>
                <input className="field_input" type="password" name="password"
                       placeholder="Password" onChange={handleChange}/>
            </div>
            {errorMessage && <div id="error-message">{errorMessage}</div>}
            <button className="login_button" type="submit">Sign in</button>
            <div className="form_footer">New member here?   <Link to="/registration">Sign up!</Link></div>
        </form>
    </div>);

};

export default Login;
