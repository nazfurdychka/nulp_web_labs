import React from 'react';
import { fireEvent, getByRole, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import fetchMock from 'jest-fetch-mock';
import Courses from './Courses';
import { act } from 'react-dom/test-utils';

fetchMock.enableMocks();

describe('Courses page', () => {

    let token = { 'logged_in_user': 'dGVzdDp0ZXN0' };

    const studentData = {
        username: 'test_s',
        firstName: 'test',
        lastName: 'test',
        password: 'test',
        userType: 'Student'
    };

    const lectorData = {
        username: 'test_l',
        firstName: 'test',
        lastName: 'test',
        password: 'test',
        userType: 'Lector'
    };

    const coursesData = [
        {
            'courseDescription': 'test_course',
            'courseName': 'test_course',
            'id': 1,
            'lectorUsername': 'l'
        }
    ];

    const lectorCoursesData = [
        {
            "courseDescription": "test_course",
            "courseName": "test_course",
            "id": 1,
            "lectorUsername": "l"
        },
        {
            "courseDescription": "test_course",
            "courseName": "test_course",
            "id": 2,
            "lectorUsername": "l"
        }
    ];

    beforeAll(() => {
        global.Storage.prototype.setItem = jest.fn((key, value) => {
            token[key] = value;
        });
        global.Storage.prototype.getItem = jest.fn((key) => token[key]);
    });

    afterAll(() => {
        global.Storage.prototype.setItem.mockReset();
        global.Storage.prototype.getItem.mockReset();
    });

    it('tests student courses', async () => {

        await act(async () => {
            await fetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve(studentData) }));
            await fetch.mockImplementationOnce(() => Promise.resolve(JSON.stringify(coursesData)));
            render(<Router><Courses/></Router>);
        });

    });

    it('tests lector courses', async () => {

        await act(async () => {
            await fetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve(lectorData) }));
            await fetch.mockImplementationOnce(() => Promise.resolve(JSON.stringify(lectorCoursesData)));
            render(<Router><Courses/></Router>);
        });
    });
});
