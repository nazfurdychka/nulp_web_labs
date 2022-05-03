import React from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {

    const navigate = useNavigate();

    const handleLogoutButton = e => {
        e.preventDefault();
        localStorage.removeItem('logged_in_user');
        navigate('/login');
    };

    return (<div className="topnav">

        <Link to="/profile">Profile</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/requests">Joining Requests</Link>
        <Link onClick={handleLogoutButton} to="/login">Logout</Link>

    </div>);

};

export default Header;
