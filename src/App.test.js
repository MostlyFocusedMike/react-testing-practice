import React from 'react';
import { enableFetchMocks } from 'jest-fetch-mock'
import { render, waitForElement, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { mockUser1, mockUser2 } from './mockData';

enableFetchMocks();

describe('Basic Tests', () => {
    beforeAll(() => {
        // Five months ago jest-fetch-mock 3.0.0 FINALLY added the ability to mock by route,
        // not request order. I highly recommend always mocking by route, since those tests
        // will only succeed if the actual entered url is correct. Request order reliant tests
        // ignore the fetch destination and just mock by fetch order
        const mockUsersRoutes = async (req) => {
            if (req.url.endsWith("1")) return JSON.stringify(mockUser1);
            if (req.url.endsWith("2")) return JSON.stringify(mockUser2);
            return {
                status: 404,
                body: "Not Found"
            }
        };

        // use regex to grab routes dynamically
        const userRoutesUrl = /^https:\/\/jsonplaceholder.typicode.com\/users\/[\d]$/;

        fetch.mockIf(userRoutesUrl, mockUsersRoutes);
    });

    const setup = async () => {
        const utils = render(<App />);

        await waitForElement(() => utils.getByText(/Leanne Graham/))
        const submitButton = screen.getByText(/Submit/)
        const idInput = screen.getByLabelText(/User Id/)
        return {
            container: utils.container,
            submitButton,
            idInput,
        }
    }

    // afterEach(cleanup); // this step is no longer needed

    it('renders at all', async () => {
        await setup();
        const mainHeader = screen.getByText(/React Testing Example/i);
        expect(mainHeader).toBeInTheDocument();
    });

    it('Grabs first user', async () => {
        await setup();
        const username = screen.getByText(/Leanne Graham/);
        expect(username).toBeInTheDocument();
    });

    it('Grabs first user but this time uses a snapshot', async () => {
        const { container } = await setup();
        expect(container.firstChild).toMatchSnapshot();
    });

    it('Successfully submits form to get second user', async () => {
        const { submitButton, idInput } = await setup();

        fireEvent.change(idInput, {
            target: { value: 2 },
        })
        fireEvent.click(submitButton);
        await waitForElement(() => screen.getByText(/Ervin Howell/));
        const oldUsername = screen.queryByText(/Leanne Graham/);
        expect(oldUsername).not.toBeInTheDocument();
    });

    describe('Controlled form does not allow input except integers 1-10', () => {
        const initialValue = '1';
        const tooLowNum = '0';
        const minNum = '1';
        const maxNum = '10';
        const tooHighNum = '11';

        // hmmmmmm, these tests seem awfully similar. Should we combine them or loop?
        // Not necessarily. While some certainly would, tests should be readable and atomic
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

            fireEvent.change(idInput, { target: { value: maxNum }});
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
            fireEvent.change(idInput, { target: { value: "look it's whatever man, strings fail" }});
            expect(idInput.value).toBe(initialValue);
        });
    });
});
