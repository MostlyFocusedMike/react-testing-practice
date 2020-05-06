import React from 'react';
import { enableFetchMocks } from 'jest-fetch-mock'
import { render, waitForElement, getByLabelText } from '@testing-library/react';
import App from './App';
enableFetchMocks();

describe('Basic Test', () => {
    // afterEach(cleanup); // this step is no longer needed

    const setup = async () => {
        const thing = JSON.stringify({
            address: 'whatever',
            email: "Sincere@april.biz",
            id: 1,
            name: "Leanne Graham",
            phone: "1-770-736-8031 x56442",
            username: "Bret",
            website: "hildegard.org",
        });

        fetch.mockOnce(thing);
        const utils = render(<App />);

        await waitForElement(() => utils.getByText(/Leanne Graham/))
        return {
            ...utils,
        }
    }

    it('renders at al', async () => {
        const { debug, getByText, inputId } = await setup();
        const mainHeader = getByText(/React Testing Example/i);
        expect(mainHeader).toBeInTheDocument();
    });

    it('Grabs first user', async () => {
        const { debug, getByText } = await setup();
        const linkElement = getByText(/Leanne Graham/i);
        expect(linkElement).toBeInTheDocument();
        debug();
    });
});
