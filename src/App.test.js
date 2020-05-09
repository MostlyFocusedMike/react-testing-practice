import React from 'react';
import { enableFetchMocks } from 'jest-fetch-mock'
import { render, screen, fireEvent, waitForElement } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { mockUser1, mockUser2 } from './mockData';

enableFetchMocks(); // mocks the fetch method for the test

describe('Basic Tests', () => {
    beforeAll(() => {
        // Five months ago jest-fetch-mock 3.0.0 FINALLY added the ability to mock by route,
        // not request order. I *highly* recommend mocking by route, since tests will
        // only succeed if the actual fetched url is correct. Fetches that are mocked
        // by order ignore the fetch destination so some bugs can sneak through.

        // use regex to grab routes dynamically
        const userRoutesUrl = /^https:\/\/jsonplaceholder.typicode.com\/users\/[\d]$/;

        const mockUsersRoutes = async (req) => {
            if (req.url.endsWith(mockUser1.id)) return JSON.stringify(mockUser1);
            if (req.url.endsWith(mockUser2.id)) return JSON.stringify(mockUser2);
            return {
                status: 404,
                body: "Not Found"
            }
        };

        fetch.mockIf(userRoutesUrl, mockUsersRoutes);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const setup = async () => {
        const { container } = render(<App />);

        await waitForElement(() => screen.getByText(mockUser1.name))
        const submitButton = screen.getByText(/Submit/)
        const idInput = screen.getByLabelText(/User Id/)
        return {
            container,
            submitButton,
            idInput,
        };
    };

    // afterEach(() => {
    //     cleanup() // this step is no longer needed
    // });

    it('renders at all', async () => {
        await setup();
        const mainHeader = screen.getByText(/React Testing Example/i);
        expect(mainHeader).toBeInTheDocument();
    });

    it('Grabs first user', async () => {
        await setup();
        expect(screen.getByText(mockUser1.name)).toBeInTheDocument();
    });

    it('Grabs first user but this time uses a snapshot', async () => {
        const { container } = await setup();
        expect(container.firstChild).toMatchSnapshot();
    });

    it('Successfully submits form to get second user', async () => {
        const { submitButton, idInput } = await setup();

        fireEvent.change(idInput, {
            target: { value: 2 },
        });
        fireEvent.click(submitButton);

        const newname = await screen.findByText(mockUser2.name);
        expect(newname).toBeInTheDocument();
        const initialName = screen.queryByText(mockUser1.name);

        expect(initialName).not.toBeInTheDocument();
    });

    it('Throws an alert when trying to use an empty id', async () => {
        const { submitButton } = await setup();
        // how to mock globals
        global.alert = jest.fn();

        fireEvent.click(submitButton);
        expect(global.alert).toHaveBeenCalledTimes(1);
        expect(global.alert).toHaveBeenCalledWith('Enter an id!');
    });

    describe('Controlled input does not allow values except integers 1-10', () => {
        const initialValue = '';
        const tooLowNum = '0';
        const minNum = '1';
        const maxNum = '10';
        const tooHighNum = '11';

        // hmmmmmm, these tests seem awfully similar. Should we combine them or loop?
        // Not necessarily. While some devs certainly would, tests should be readable and atomic
        // (that means non reliant on any other tests being run). So looping or combining
        // might not help those two goals. But! Others may disagree, and that's ok, just be
        // consistent with your design choices and you'll be alright
        it('accepts 1 as lowest id', async () => {
            const { idInput } = await setup();

            fireEvent.change(idInput, { target: { value: minNum }});
            expect(idInput.value).toBe(minNum);
        });

        it('accepts 10 as the maximum', async () => {
            const { idInput } = await setup();
            // this is the userEvent way to do it
            await userEvent.type(idInput, maxNum);
            expect(idInput.value).toBe(maxNum);
        });

        it('rejects lower than 1 and more than 10', async () => {
            const { idInput } = await setup();

            fireEvent.change(idInput, { target: { value: tooLowNum }});
            expect(idInput.value).toBe(initialValue);

            fireEvent.change(idInput, { target: { value: tooHighNum }});
            expect(idInput.value).toBe(initialValue);
        });

        it('rejects strings', async () => {
            const { idInput } = await setup();

            fireEvent.change(idInput, { target: { value: 'a' }});
            expect(idInput.value).toBe(initialValue);
            fireEvent.change(idInput, { target: { value: 'a?' }});
            expect(idInput.value).toBe(initialValue);
            fireEvent.change(idInput, { target: { value: "look it's whatever, strings fail" }});
            expect(idInput.value).toBe(initialValue);
        });
    });
});
