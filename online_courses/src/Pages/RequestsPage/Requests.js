import React, { useEffect, useState } from 'react';
import './Requests.css';
import Header from '../../Components/Header';
import { decode as base64_decode } from 'base-64';
import { Navigate } from 'react-router-dom';

const Requests = () => {

    const getUserBackendUrl = 'http://127.0.0.1:5000/user/';

    const getLectorRequestsBackendUrl = 'http://127.0.0.1:5000/lector/requests';

    const sendStudentRequestBackendUrl = 'http://127.0.0.1:5000/request';

    const acceptRequestBackendUrl = 'http://127.0.0.1:5000/user/acceptrequest/';

    const declineRequestBackendUrl = 'http://127.0.0.1:5000/user/declinerequest/';

    const getAllCoursesBackendUrl = 'http://127.0.0.1:5000/courses';

    const [coursesData, setCoursesData] = useState(null);

    const [requestsData, setRequestsData] = useState(null);

    const emptyString = ' ';

    const lectorUserType = 'Lector';

    const studentUserType = 'Student';

    const [userType, setUserType] = useState(emptyString);

    const [userId, setUserId] = useState(emptyString);

    const headers = () => {
        const headers = new Headers();

        headers.set('Authorization', `Basic ${localStorage.getItem('logged_in_user')}`);

        headers.set('content-type', 'application/json');

        return headers;
    };

    useEffect(() => {
        const fetchData = async () => {
            let username = base64_decode(localStorage.getItem('logged_in_user'))
                .split(':')[0];
            const response = await fetch(getUserBackendUrl + username, {
                method: 'GET',
                headers:headers(),
            });
            const newData = await response.json();
            setUserType(newData.userType);
            setUserId(newData.id);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (userType !== emptyString) {
            if (userType === 'Lector') {
                fetch(getLectorRequestsBackendUrl, {
                    method: 'GET',
                    headers:headers()
                })
                    .then((response) => {
                        if (response.status === 200) {
                            return response.json();
                        }
                    })
                    .then((data) => {
                        setRequestsData(data);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                fetch(getAllCoursesBackendUrl, {
                    method: 'GET',
                    headers:headers()
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

    const requestOperationHandler = (event, request, requestType) => {
        event.preventDefault();
        const newRequests = [...requestsData];
        const index = requestsData.findIndex((searchRequest) => searchRequest.id === request.id);
        newRequests.splice(index, 1);
        setRequestsData(newRequests);
        let url;
        if (requestType === 'Accept') {
            url = acceptRequestBackendUrl;
        } else {
            url = declineRequestBackendUrl;
        }
        fetch(url + request.id, {
            method: 'PUT',
            headers:headers()
        });
    };

    const sendRequestHandler = (event, course) => {
        event.preventDefault();
        const data = {
            studentId: userId,
            requestToCourse: course.id,
        };
        const newCourses = [...coursesData];
        const index = coursesData.findIndex((searchCourse) => searchCourse.id === course.id);
        newCourses[index].requestStatus = 'On hold';
        setCoursesData(newCourses);
        fetch(sendStudentRequestBackendUrl, {
            method: 'POST',
            body: JSON.stringify(data),
            headers:headers()
        })
            .then((response) => {
                if (response.status === 406) {
                    alert('Request was already sent.');
                }
            });
    };

    const renderLectorTableHeader = () => {
        let header = ['Id', 'Course name', 'Student username', 'Operation'];
        return header.map((key, index) => {
            return <th key={index}>{key}</th>;
        });
    };

    const renderStudentTableHeader = () => {
        let header = ['Id', 'Course name', 'Description', 'Lector username', 'Operation', 'Request status'];
        return header.map((key, index) => {
            return <th key={index}>{key}</th>;
        });
    };

    const renderStudentTableData = () => {
        return coursesData.map((course) => {
            const {
                id,
                courseName,
                courseDescription,
                lectorUsername,
                requestStatus,
            } = course;
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{courseName}</td>
                    <td>{courseDescription}</td>
                    <td>{lectorUsername}</td>
                    <td>
                        <button type="button" id="delete_button"
                                onClick={(event) => sendRequestHandler(event, course)}
                                className="user-profile-button">Send Request
                        </button>
                    </td>
                    <td>{requestStatus}</td>
                </tr>
            );
        });
    };

    const renderLectorTableData = () => {
        return requestsData.map((request) => {
            const {
                id,
                courseName,
                studentName
            } = request;
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{courseName}</td>
                    <td>{studentName}</td>
                    <td>
                        <button type="button" data-testid="test"
                                onClick={(event) => requestOperationHandler(event, request, 'Accept')}
                                className="user-profile-button">Accept
                        </button>
                        <button type="button"
                                onClick={(event) => requestOperationHandler(event, request, 'Decline')}
                                className="user-profile-button">Decline
                        </button>
                    </td>
                </tr>
            );
        });
    };

    if (!localStorage.getItem('logged_in_user')) {
        return <Navigate to="/login"/>;
    }

    let headerMessage;
    if (userType === lectorUserType) {
        headerMessage = 'Requests to join';
    } else {
        headerMessage = 'List of courses to join';
    }
    return (<div>
            <Header/>
            <h1 className="table_title">{headerMessage}</h1>
            <table className="table">
                <tbody>
                <tr>{requestsData && userType === lectorUserType && renderLectorTableHeader()}</tr>
                {requestsData && userType === lectorUserType && renderLectorTableData()}
                <tr>{coursesData && userType === studentUserType && renderStudentTableHeader()}</tr>
                {coursesData && userType === studentUserType && renderStudentTableData()}
                </tbody>
            </table>
        </div>
    );

};
export default Requests;
