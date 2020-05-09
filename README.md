# Testing Examples
This repo has an extremely simple app that just gets users from a dummy site in order to run some tests. It shows how to mock fetches by route, how to fire events, and some basic patterns that you'll find helpful. Below are some highlights that may help you in your coding journey.

# What is this "screen" nonsense?
While we used to use `render()` and then destructure the needed values, sometimes we would have to rerender to update the dom. No more. Per [Kent C. Dodds himself](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library):

> The benefit of using screen is you no longer need to keep the render call destructure up-to-date as you add/remove the queries you need. You only need to type screen. and let your editor's magic autocomplete take care of the rest.

This basically means that you can use the setup function to grab convenience methods and wait for any initial fetches to be done, but then in the tests themselves, just use or destructure `screen`. This is really handy becuase now you can just call `screen.debug()` as a one off while developing and delete it when your done.

Be careful though, if you save a screen query to a variable, that variable will always exist, which may not be what you want:

```js
const initialName = screen.getByText(/beth/)
expect(initialName).toBeInTheDocument();

// some action that removes the text beth for bill

const newName = screen.getByText(/bill/);
expect(initialName).not.toBeInTheDocument(); // fails
expect(newName).toBeInTheDocument();
```
That test will fail becuase you saved the query result to a variable instead of searching for it fresh. You can and should save queries to variables for readability, just be careful of events changing the DOM. The solution would be save a new variable after the event or just call the query fresh.

```js
const initialName = screen.getByText(/beth/)
expect(initialName).toBeInTheDocument();

// some action that removes the text beth for bill

const newName = screen.getByText(/bill/);
const removedName = screen.getByText(/beth/)
expect(removedName).not.toBeInTheDocument(); // nice
expect(newName).toBeInTheDocument();
```

## container exception
The one thing you may still need from the `render` function is the `container`, and specifically the `firstChild` property when using snapshots. But that's really it, screen is the new way of doing stuff.

# A word on snapshots
Snapshots are a neat way to check a big chunk of the DOM all at once. The files are generated automatically when you call the `.toMatchSnapshot()` the first time. However, they are *notorious* for being ignored by devs, since they will often fail for "trivial" reasons. A perfect example is changing some styling or layout that doesn't actually matter. Since you can update snapshots simply by pressing the "u" key, a lot of times devs will just update them without really thinking. Personally, I never trust them all that much since sometimes they are updated when they shouldn't and then get committed. But it's good to know how to use them.

# getBy vs findBy vs queryBy
Wow, lots of choices [the Cheat Sheet has more info](https://testing-library.com/docs/react-testing-library/cheatsheet) but on the whole it breaks down to:

## getBy*
This throws an error if no matches are found or more than one match is found. Use this when you are testing for an element you expect to be there right now.

## queryBy
This only returns `null` if no element is found (though it will still throw if multiple matches are found), so use this to confirm an element does not exist. This is really the *only* time you should use it
```js
const gone = queryByText(/Bye/)
expect(gone).not.toBeInTheDocument();
```

## findBy*
This one is interesting because it's really just an async `getBy`, it's the only one that can be awaited. Use this for an element that you are *sure* will be there after a state update or fetch is completed. Use this instead of a `waitFor` if you want to use the element for something. Especially since `waitFor` is a bit odd with Create React App.

```js
// bad
const submitButton = await waitFor(() =>
  screen.getByRole('button', {name: /submit/i}),
)

// good
const submitButton = await screen.findByRole('button', {name: /submit/i})
```

## *all
These methods all have versions like getByAll* or findByAll which are used when you want to pick up more than one element. Again, check out that cheat sheet for more info.

## waitForElement vs waitFor
Heads up, the `waitForElement` pattern will soon be replaced. Currently this pattern is used when you're waiting for some update (like a setState being called after a fetch) and you don't want to continue if it's not done. You don't really care about the element you're waiting for, you're just using it as a marker for the app state. Like this:

```js
await waitForElement(() => screen.getByText(/Ervin Howell/));
```
However, this is technically using `getByText` as an assertion (getBy* throws an error if it finds no match), which we don't really want. In the future, we will use this pattern:

```js
await waitFor(() => {
    expect(screen.getByText(/Ervin Howell/))).toBeInTheDocument();
});
```
However, currently this doesn't play nice with Create React app, and you must be on the very latest version of several packages. So for now, whatever. But know that you may see the newer pattern soon in the future.

## fireEvent vs @testing-library/user-event
In this great article which I will keep linking too becuase you really should read it( https://kentcdodds.com/blog/common-mistakes-with-react-testing-library) Kent talks about a new way to mock user events much closer to how they appear in real life. However, it's still new, so for now I'm just using fireEvent so you see it. To find the section, search `Not using @testing-library/user-event` on the article.
