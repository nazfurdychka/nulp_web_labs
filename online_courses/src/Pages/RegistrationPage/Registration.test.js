import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import fetchMock from 'jest-fetch-mock';
import Registration from './Registration';

fetchMock.enableMocks();

describe('Login page', () => {

    it('renders Login with form', () => {
        render(<Router><Registration/></Router>);
        expect(screen.getByRole('form'))
            .toBeInTheDocument();
    });

    it('logs user in', async () => {
        await act(async () => {
            render(<Router><Registration
            /></Router>);
        });

        const submitBtn = screen.getByRole('form')
            .querySelector('button');
        fireEvent.click(submitBtn);

        const headers = new Headers();
        headers.set('content-type', 'application/json');
        expect(fetch)
            .toHaveBeenCalledWith('http://127.0.0.1:5000/auth/register', {
                'body': '{\"username\":\"\",\"firstName\":\"\",\"lastName\":\"\",\"password\":\"\",\"userType\":\"Student\"}',
                'headers': headers,
                'method': 'POST'
            });

        await expect(fetch)
            .toHaveBeenCalledTimes(1);
    });

});
