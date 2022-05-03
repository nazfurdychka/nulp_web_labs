import React, { useEffect, useState } from 'react';
import './Courses.css';
import Header from '../../Components/Header';
import { decode as base64_decode } from 'base-64';
import { Navigate } from 'react-router-dom';

const Courses = () => {

    const getCoursesLectorBackendUrl = 'http://127.0.0.1:5000/lector/courses';

    const getCoursesStudentBackendUrl = 'http://127.0.0.1:5000/student/courses';

    const getUserBackendUrl = 'http://127.0.0.1:5000/user/';

    const createCourseBackeundUrl = 'http://127.0.0.1:5000/course';

    let username = base64_decode(localStorage.getItem('logged_in_user'))
        .split(':')[0];

    const [coursesData, setCoursesData] = useState(null);

    const [courseData, setCourseData] = useState({
        courseName: '',
        courseDescription: '',
    });

    const [userType, setUserType] = useState('');

    const [userId, setUserId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const headers = new Headers();
            headers.set('Authorization', `Basic ${localStorage.getItem('logged_in_user')}`);
            headers.set('content-type', 'application/json');
            let username = base64_decode(localStorage.getItem('logged_in_user'))
                .split(':')[0];
            const response = await fetch(getUserBackendUrl + username, {
                method: 'GET',
                headers,
            });
            const newData = await response.json();
            setUserType(newData.userType);
            setUserId(newData.id);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (userType !== '') {
            const headers = new Headers();
            headers.set('Authorization', `Basic ${localStorage.getItem('logged_in_user')}`);
            headers.set('content-type', 'application/json');
            if (userType === 'Lector') {
                fetch(getCoursesLectorBackendUrl, {
                    method: 'GET',
                    headers,
                })
                    .then((response) => {
                        if (response.status === 200) {
                            return response.json();
                        }
                    })
                    .then((data) => {
                        setCoursesData(data);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                fetch(getCoursesStudentBackendUrl, {
                    method: 'GET',
                    headers,
                })
                    .then((response) => {
                        if (response.status === 200) {
                            return response.json();
                        }
                    })
                    .then((data) => {
                        setCoursesData(data);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        }
    }, [userType]);

    const addCourseHandler = (course, courseId) => {
        const newCourses = [...coursesData];
        const newCourse = {
            courseName: courseData.courseName,
            courseDescription: courseData.courseDescription,
            id: courseId,
            lectorUsername: username
        };
        newCourses.push(newCourse);
        setCoursesData(newCourses);
    };

    const handleChange = e => {
        setCourseData({
            ...courseData,
            [e.target.name]: e.target.value
        });
    };

    const createCourseButtonHandler = event => {

        const data = {
            courseName: courseData.courseName,
            courseDescription: courseData.courseDescription,
            courseLector: userId,
        };

        event.preventDefault();
        const headers = new Headers();
        headers.set('content-type', 'application/json');
        headers.set('Authorization', `Basic ${localStorage.getItem('logged_in_user')}`);
        setCourseData({
            courseName: '',
            courseDescription: '',
        });
        fetch(createCourseBackeundUrl, {
            method: 'POST',
            body: JSON.stringify(data),
            headers,
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
            })
            .then(async (data) => {
                addCourseHandler(courseData, await data.id);
            });

    };

    const deleteButtonHandler = (event, course) => {
        event.preventDefault();
        const newCourses = [...coursesData];
        const index = coursesData.findIndex((findcourse) => findcourse.id === course.id);
        newCourses.splice(index, 1);
        setCoursesData(newCourses);
        const headers = new Headers();
        headers.set('Authorization', `Basic ${localStorage.getItem('logged_in_user')}`);
        headers.set('content-type', 'application/json');
        fetch('http://127.0.0.1:5000/course/' + course.id, {
            method: 'DELETE',
            headers,
        });
    };

    const renderTableData = () => {
        return coursesData.map((course) => {
            const {
                id,
                courseName,
                courseDescription,
                lectorUsername
            } = course;
            if (userType === 'Lector') {
                return (
                    <tr key={id}>
                        <td>{id}</td>
                        <td>{courseName}</td>
                        <td>{courseDescription}</td>
                        <td>{lectorUsername}</td>
                        <td>
                            <button type="button" id="delete_button"
                                    onClick={(event) => deleteButtonHandler(event, course)}
                                    className="user-profile-button">Delete
                            </button>
                        </td>
                    </tr>
                );
            } else {
                return (
                    <tr key={id}>
                        <td>{id}</td>
                        <td>{courseName}</td>
                        <td>{courseDescription}</td>
                        <td>{lectorUsername}</td>
                    </tr>);
            }
        });
    };

    const renderTableHeader = () => {
        let header = ['Id', 'Course name', 'Description', 'Lector username'];
        if (userType === 'Lector') {
            header.push('Operation');
        }
        return header.map((key, index) => {
            return <th key={index}>{key}</th>;
        });
    };
    if (!localStorage.getItem('logged_in_user')) {
        return <Navigate to="/login"/>;
    }

    let headerMessage = '';
    if (userType === 'Lector') {
        headerMessage = 'Courses managed by you';
    } else {
        headerMessage = 'Courses you enrolled in';
    }

    return (coursesData && <div>
            <Header/>
            <h1 className="table_title">{headerMessage}</h1>
            <table className="table">
                <tbody>
                <tr>{renderTableHeader()}</tr>
                {renderTableData()}
                {userType === 'Lector' && <tr>
                    <td></td>
                    <td>
                        <input type="text" required="required" placeholder="Course name"
                               name="courseName" onChange={handleChange}
                               className="form_input"
                               value={courseData.courseName}></input>
                    </td>
                    <td>
                        <input type="text" required="required" placeholder="Course description"
                               name="courseDescription" onChange={handleChange}
                               className="form_input"
                               value={courseData.courseDescription}></input>
                    </td>
                    <td>{username}</td>
                    <td>
                        <button type="button" data-testid="button"
                                onClick={createCourseButtonHandler}
                                className="user-profile-button">Create course
                        </button>
                    </td>
                </tr>}
                </tbody>
            </table>
        </div>
    );

};

export default Courses;
