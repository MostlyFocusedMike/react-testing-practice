## A word on snapshots
Snapshots are a neat way to check a big chunk of the DOM all at once. However, they are *notorious* for being ignored by devs, since they will often fail for "trivial" reasons. A perfect example is changing some styling or layout that doesn't actually matter. Since you can update snapshots simply by pressing the "u" key, and the files are generated automatically when you call the `toBe

## waitForElement vs waitFor
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