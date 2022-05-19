import React from 'react';
import { fireEvent, getAllByRole, getByRole, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import fetchMock from 'jest-fetch-mock';
import Requests from './Requests';
import { act } from 'react-dom/test-utils';

fetchMock.enableMocks();

describe('Requests page', () => {

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

    const studentRequestsData = [
        {
            'courseDescription': 'test_course',
            'courseName': 'test_course',
            'id': 1,
            'lectorUsername': 'test_l',
            'requestStatus': ''
        }
    ];

    const lectorRequestsData = [
        {
            'courseName': 'test_course',
            'id': 2,
            'studentName': 'test_s'
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

    it('tests student requests', async () => {

        await act(async () => {
            await fetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve(studentData) }));
            await fetch.mockImplementationOnce(() => Promise.resolve(JSON.stringify(studentRequestsData)));
            render(<Router><Requests/></Router>);
        });

    });

    it('tests lector requests', async () => {

        await act(async () => {
            await fetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve(lectorData) }));
            await fetch.mockImplementationOnce(() => Promise.resolve(JSON.stringify(lectorRequestsData)));
            render(<Router><Requests/></Router>);
        });
    });
});
