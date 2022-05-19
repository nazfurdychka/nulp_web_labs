import React, { useState } from 'react';

import './Registration.css';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const Registration = () => {

    const defaultSelectorValue = 'Choose user type';

    const backendUrl = 'http://127.0.0.1:5000/auth/register';

    const navigation = useNavigate();

    const [errorMessage, setErrorMessage] = useState('');

    const [userData, setUserData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        userType: 'Student',
    });

    const handleChange = e => {
        setErrorMessage(null);
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };
    const handleSelectorChange = e => {
        setErrorMessage(null);
        setUserData({
            ...userData,
            userType: e.target.options[e.target.value - 1].text
        });
    };

    const registerButtonHandler = event => {
        event.preventDefault();
        if (userData.userType === defaultSelectorValue) {
            setErrorMessage('You should choose user type');
            return;
        }

        if (userData.password !== userData.confirmPassword) {
            setErrorMessage('Password are not the same');
            return;
        }

        const headers = new Headers();
        headers.set('content-type', 'application/json');
        fetch(backendUrl, {
            method: 'POST',
            body: JSON.stringify(
                {
                    username: userData.username,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    password: userData.password,
                    userType: userData.userType
                }
            ),
            headers,
        })
            .then(async (response) => {
                if (response.status !== 200) {
                    throw new Error(await response.text());
                }
                return response.text();
            })
            .then(() => {
                navigation('/login');
            })
            .catch((error) => {
                let errorMessage = JSON.parse(error.message).message;
                setErrorMessage(errorMessage);
            });
    };

    if (localStorage.getItem('logged_in_user')) {
        return <Navigate to="/profile"/>;
    }

    return (<div className="wrapper">
        <form className="register_form" name = "form" onSubmit={registerButtonHandler}>
            <div className="form_header">Registration</div>
            <div className="row_input">
                <div className="form_input">
                    <h3>Enter first name:</h3>
                    <input className="field_input" type="text" name="firstName"
                           placeholder="First name" required onChange={handleChange}/>
                </div>
                <div className="form_input">
                    <h3>Enter last name:</h3>
                    <input className="field_input" type="text" name="lastName"
                           placeholder="Last name" required onChange={handleChange}/>
                </div>
            </div>
            <div className="row_input">
                <div className="form_input">
                    <h3>Enter username:</h3>
                    <input className="field_input" type="text" name="username"
                           placeholder="Username"
                           required onChange={handleChange}/>
                </div>
                <div className="selector">
                    <h3>Choose a user type:</h3>
                    <div className="custom-select">
                        <select className="user-type" name="userType" id="user-type-selector" data-testid="select"
                                onChange={handleSelectorChange}>
                            <option value="1">Student</option>
                            <option value="2">Lector</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="row_input">
                <div className="form_input">
                    <h3>Enter password:</h3>
                    <input className="field_input" type="password" name="password"
                           placeholder="Password" onChange={handleChange}/>
                </div>
                <div className="form_input">
                    <h3>Confirm password:</h3>
                    <input className="field_input" type="password" name="confirmPassword"
                           placeholder="Confirm password" onChange={handleChange}/>
                </div>
            </div>
            {errorMessage && <div id="error-message">{errorMessage}</div>}
            <button className="register_button" type="submit">Sign up</button>
            <div className="form_footer">Already registered? <Link to="/login">Log in!</Link></div>
        </form>

    </div>);

};

export default Registration;
