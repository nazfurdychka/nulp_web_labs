import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './Login';
import { act } from 'react-dom/test-utils';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

const successResponse = 'Logged In';

describe('Login page', () => {

    it('renders Login page with form', () => {
        render(<Router><Login/></Router>);
        expect(screen.getByRole('form'))
            .toBeInTheDocument();
    });

    it('tests user login', async () => {
        await act(async () => {
            fetch.mockReturnValue(Promise.resolve(new Response(successResponse)));
            render(<Router><Login
            /></Router>);
        });
        expect(screen.getByTestId('welcome_header'))
            .toHaveTextContent('Welcome!');

        const submitBtn = screen.getByRole('form')
            .querySelector('button');
        fireEvent.click(submitBtn);

        const headers = new Headers();
        headers.set('content-type', 'application/json');
        expect(fetch)
            .toHaveBeenCalledWith('http://127.0.0.1:5000/auth/login', {
                'body': '{"username":"","password":""}',
                'headers': headers,
                'method': 'POST'
            });

        await expect(fetch)
            .toHaveBeenCalledTimes(1);
    });
});
