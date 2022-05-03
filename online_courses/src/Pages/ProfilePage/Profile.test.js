import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Profile from './Profile';
import { act } from 'react-dom/test-utils';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();


describe('Profile page', () => {

    let token = { 'logged_in_user': 'dGVzdDp0ZXN0' };

    const studentData = {
        username: 'test_s',
        firstName: 'test',
        lastName: 'test',
        password: 'test',
        userType: 'Student'
    };

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

    it('renders Profile with form', () => {
        fetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve(studentData) }));
        render(<Router><Profile/></Router>);
        expect(screen.getByRole('form'))
            .toBeInTheDocument();
        expect(fetch)
            .toHaveBeenCalledTimes(1);
    });

    it('tests', async () => {
        await fetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve(studentData) }));
        await act(async () => {
            render(<Router><Profile
            /></Router>);
        });

        const submitBtn = screen.getByRole('form').querySelector('button[type="submit"]');
        fireEvent.click(submitBtn);
        const deleteBth = screen.getByRole('form').querySelector('#delete_button');
        fireEvent.click(deleteBth);
        const resetBtn = screen.getByRole('form').querySelector('#reset_button');
        fireEvent.click(resetBtn);
        await expect(fetch)
            .toHaveBeenCalledTimes(5);
    });
});
