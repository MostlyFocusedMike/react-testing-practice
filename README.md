## Latest Patterns
heads up, wait for element pattern will soon be replaced:

```js
await waitForElement(() => screen.getByText(/Ervin Howell/));

```
This is technically using getByText as an assertion, which we don't really want. In the future, we will use this pattern:

```js
await waitFor(() => {
    expect(screen.getByText(/Ervin Howell/))).toBeInTheDocument();
});
```
However, currently this doesn't play nice with Create React app, and you must be on the very latest version of several packages. So for now, whatever. But know that you may see the newer pattern soon in the future.