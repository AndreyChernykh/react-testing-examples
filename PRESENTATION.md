---
title: Testing React
---

# Testing React

---

<img data-src="./assets/andrei.jpg" width="30%" height="30%">
<img data-src="./assets/logo.png" width="30%" height="30%">

Andrei Chernykh

<p style="font-size: 26px">Senior Software Engineer at Galvanize</p>

---

# Jest & jsdom

Notes:

https://facebook.github.io/jest/
https://github.com/jsdom/jsdom
Jest is a JavaScript test runner that lets you access the DOM via jsdom. While jsdom is only an approximation of how the browser works, it is often good enough for testing React components. Jest provides a great iteration speed combined with powerful features like mocking modules and timers so you can have more control over how the code executes.

jsdom is a pure-JavaScript implementation of many web standards, notably the WHATWG DOM and HTML Standards, for use with Node.js. In general, the goal of the project is to emulate enough of a subset of a web browser to be useful for testing and scraping real-world web applications.

---

# React Testing Library

<img data-src="./assets/octopus.png">

Notes:

https://testing-library.com/react
React Testing Library is a set of helpers that let you test React components without relying on their implementation details. This approach makes refactoring a breeze and also nudges you towards best practices for accessibility. Although it doesn’t provide a way to “shallowly” render a component without its children, a test runner like Jest lets you do this by mocking.

---

# Basic test

```js [1-2|4-8|10-12]
// import React so you can use JSX (React.createElement) in your test
import React from "react";

/**
 * render: lets us render the component (like how React would)
 * screen: Your utility for finding elements the same way the user does
 **/
import { render, screen } from "@testing-library/react";

test("test title", () => {
  // Your tests come here...
});
```

---

# Basic test

```js [4-6|8-15]
import React from "react";
import { render, screen } from "@testing-library/react";

function Hello({ name }) {
  return <h1>Hello, {name}!</h1>;
}

test("Hello", () => {
  render(<Hello name="Andrei" />);
  expect(screen.getByRole("heading")).toHaveTextContent("Hello, Andrei!");
});
```

Notes:

- An example of component rendering with React Testing Library
- Importance of querying by Role or Label (more about that later)
- Matcher `toHaveTextContent` from https://github.com/testing-library/jest-dom

---

# `screen`

```js [|6-7|9-14]
import { render, screen } from "@testing-library/react";

test("example", () => {
  render(<Example />);

  screen.getByRole("alert");
  screen.getByLabelText(/example/i);

  // debug document
  screen.debug();
  // debug single element
  screen.debug(screen.getByText("test"));
  // debug multiple elements
  screen.debug(screen.getAllByText("multi-test"));
});
```

Notes:

- The benefit of using `screen` is you no longer need to keep the render call destructure up-to-date as you add/remove the queries you need. You only need to type `screen`. and let your editor's magic autocomplete take care of the rest.
- For convenience screen also exposes a `debug` method in addition to the queries. This method is essentially a shortcut for `console.log(prettyDOM())`. It supports debugging the document, a single element, or an array of elements.

---

# `rerender`

```js [4-10|12-14|16-17]
import React from "react";
import { render, screen } from "@testing-library/react";

function Hello({ name }) {
  if (name) {
    return <h1>Hello, {name}!</h1>;
  } else {
    return <span>Hey, stranger</span>;
  }
}

test("Shows a different message if `name` is undefined", () => {
  const { rerender } = render(<Hello name="Andrei"/>);
  expect(screen.getByRole("heading")).toHaveTextContent(/Hello, Andrei/i);

  rerender(<Hello />);
  expect(screen.getByText(/Hey, stranger/i)).toBeVisible();
});
```

Notes:

- Adding conditional rendering
- An example of how to re-render a component with the new prop values

---

# Which query should I use?

https://testing-library.com/docs/guide-which-query

### TL;DR

1. Role
2. Label
3. Text
4. AltText / Title
5. TestId
6. custom query selectors

Notes:

- This is not a full list

---

# `getBy*`

```js []
screen.getByLabelText("Username");
screen.getByRole("button");
...
```

Notes:

- Let's discuss 3 main types of queries. What is the difference. When to use which.
- `getBy*` queries return the first matching node for a query, and throw an error if no elements match or if more than one match is found (use `getAllBy` instead).

---

# `queryBy*`

```js []
screen.queryByLabelText("Username");
screen.queryByRole("button", { name: /Click me/i })
...
```

Notes:

- `queryBy*` queries return the first matching node for a query, and return null if no elements match. This is useful for asserting an element that is not present. This throws if more than one match is found (use `queryAllBy` instead).

---

# `findBy*`

```js []
await screen.findByLabelText("Username");
await screen.findByRole("button", { name: /Click me/i });
...
```

Notes:

- `findBy*` queries return a promise which resolves when an element is found which matches the given query. The promise is rejected if no element is found or if more than one element is found after a default timeout of 1000ms. If you need to find more than one element, then use findAllBy.
- `await`

---

# Matchers

Notes:

- Jest uses "matchers" to let you test values in different ways. This document will introduce some commonly used matchers

---

# Matchers

```js [|12]
test("have all the same properties", () => {
  const can1 = {
    flavor: "grapefruit",
    ounces: 12,
  };

  const can2 = {
    flavor: "grapefruit",
    ounces: 12,
  };

  expect(can1).toEqual(can2);
});
```

Notes:

- Example
- https://jestjs.io/docs/en/expect

---

# `jest-dom`

<img data-src="./assets/owl.png">

https://github.com/testing-library/jest-dom

```js [1-3|]
<div data-testid="zero-opacity" style="opacity: 0">
  Zero Opacity Example
</div>

// my.test.js
expect(getByText("Zero Opacity Example")).not.toBeVisible();
```

Notes:

- The @testing-library/jest-dom library provides a set of custom jest matchers that you can use to extend jest. These will make your tests more declarative, clear to read and to maintain.

---

# `jest-dom`

- toBeDisabled
- toBeEnabled
- toBeEmpty
- toBeEmptyDOMElement
- toBeInTheDocument
- toBeInvalid
- toBeRequired
- toBeValid
- ...

Notes:

- More examples

---

# Events

Notes:

- We've learned how to rerender a component with new props and make a basic assertions.
- Now let's take a look at how we can interact with a component using event

---

# Events

```js []
import { render, fireEvent } from "@testing-library/react";

fireEvent.click(getByText("Submit"));
fireEvent.change(getByLabelText(/username/i), { target: { value: "a" } });
```

Notes:

- `fireEvent` helper provides methods for firing DOM events

---

# Events

```js [3-14|16-18|20-21]
import { render, fireEvent, screen } from "@testing-library/react";

function Counter({ initialValue }) {
  const [value, setValue] = React.useState(initialValue);

  return (
    <div>
      <div>{`Value: ${value}`}</div>
      <button onClick={() => setValue((prev) => prev + 1)}>
        Increment
      </button>
    </div>
  );
}

it("Increments the value on click", () => {
  render(<Counter initialValue={3} />);
  expect(screen.getByText(/Value: 3/i));

  fireEvent.click(screen.getByRole("button", { name: /Increment/i }));
  expect(screen.getByText(/Value: 4/i));
});

```

Notes:

- Let's take a look at this simple counter component
- That how we can use `fireEvent` to interact with the component

---

# `@testing-library/user-event`

<img data-src="./assets/dog.png">

Notes:

- `fireEvent` isn't exactly how the user interacts with your application, but it's close enough for most scenarios.
- Consider fireEvent.click which creates a click event and dispatches that event on the given DOM node. This works properly for most situations when you simply want to test what happens when your element is clicked, but when the user actually clicks your element, these are the events that are typically fired (in order):

fireEvent.mouseOver(element)
fireEvent.mouseMove(element)
fireEvent.mouseDown(element)
element.focus() (if that element is focusable)
fireEvent.mouseUp(element)
fireEvent.click(element)

---

# `@testing-library/user-event`

```js []
import userEvent from "@testing-library/user-event";

userEvent.click(element, eventInit, options);
userEvent.type(element, text, [options]);
userEvent.upload(element, file, [{ clickInit, changeInit }]);
userEvent.selectOptions(element, values);
userEvent.tab({ shift, focusTrap });
userEvent.hover(element);
userEvent.paste(element, text, eventInit, options);
```

Notes:

- `user-event` tries to simulate the real events that would happen in the browser as the user interacts with it. For example userEvent.click(checkbox) would change the state of the checkbox.

---

# `@testing-library/user-event`

```js [|9]
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("type", () => {
  render(<textarea />);

  userEvent.type(
    screen.getByRole("textbox"),
    "Hello,{enter}World!"
  );

  expect(screen.getByRole("textbox"))
    .toHaveValue("Hello,\nWorld!");
});
```

Notes:

- An example for `user-event`
- Note `{enter}` and `\n` (https://github.com/testing-library/user-event#special-characters)
- `{backspace}`, `{space}`, `{selectall}`...

---

# ⌛ Waiting...

Notes:

- Some things in react happen asynchronously, so sometimes we need to wait...
- E.g. waiting for http requests, promises, timers.
- There are several Async Utilities that could help us with that.
- https://testing-library.com/docs/dom-testing-library/api-async

---

# ⌛ `waitFor()`

```js [|1|3,5]
import { waitFor } from "@testing-library/react";

test("example", async () => {
  ...
  await waitFor(() => {
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });
  ...
});
```

Notes:

- When in need to wait for any period of time you can use `waitFor`
- `waitFor` can be used with any types of available assertions
- Don't put many things into `waitFor`. Only single assertion. No side-effects.

---

# ⌛ `findBy*`

```js []
// ❌
await waitFor(() => screen.getByText("Hello"));
```

```js []
// ✅
await screen.findByText("Hello");
```

Notes:

- this is a simple combination of `getBy*` queries and `waitFor`. The `findBy*` queries accept the `waitFor` options as the last argument. (i.e. screen.findByText('text', queryOptions, waitForOptions))

---

# ⌛ Timers

```js [2-3|18-21|9-15]
function Debouncer() {
  const [value, setVaue] = React.useState("");
  const [debouncedValue, setDebouncedValue] = React.useState("");

  function handleChange(event) {
    setVaue(event.target.value);
  }

  React.useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedValue(value);
    }, 2000);

    return () => clearTimeout(id); // cleanup
  }, [value]);

  return (
    <div>
      <input value={value} onChange={handleChange} />
      <div>{`Debounced value: ${debouncedValue}`}</div>
    </div>
  );
}
```

---

# ⌛ Timers

```js [|7]
// ❌

it("render the input value after 2000ms delay", async () => {
  render(<Debouncer />);
  userEvent.type(screen.getByRole("textbox"), "Arthur");

  await screen.findByText(/Debounced value: Arthur/i);
});
```

Notes:

- your first instinct may be to use `waitFor` or `find`
- it will only work on the small timeouts and also will make your tests slower

---

# ⌛ Timers

```js []
jest.useFakeTimers();
```

Notes:

- https://jestjs.io/docs/en/timer-mocks
- https://testing-library.com/docs/using-fake-timers
- In some cases, when your code uses timers (setTimeout, setInterval, clearTimeout, clearInterval), your tests may become unpredictable, slow and flaky.
- Jest can swap out timers with functions that allow you to control the passage of time.

---

# ⌛ Timers

```js [|2-4|11-14]
// Fake timers using Jest
beforeEach(() => {
  jest.useFakeTimers();
});

it("render the input value after 2000ms delay", async () => {
  // Test
});

// Running all pending timers and switching to real timers using Jest
afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
```

Notes:

- The common pattern to setup fake timers is usually within the `beforeEach`
- When using fake timers, you need to remember to restore the timers after your test runs.
  The main reason to do that is to prevent 3rd party libraries running after your test finishes (e.g cleanup functions), from being coupled to your fake timers and use real timers instead.
  For that you usually call `useRealTimers` in `afterEach`.
  It's important to also call `runOnlyPendingTimers` before switching to real timers.
  This will ensure you flush all the pending timers before you switch to real timers. If you don't progress the timers and just switch to real timers, the scheduled tasks won't get executed and you'll get an unexpected behavior.

---

# ⌛ Timers

```js [|8|10]
// ✅
// beforeEach()

it("render the input value after 2000ms delay", async () => {
  render(<Debouncer />);
  userEvent.type(screen.getByRole("textbox"), "Arthur");

  act(() => jest.advanceTimersByTime(2001));

  screen.getByText(/Debounced value: Arthur/i);
});

// afterEach()
```

Notes:

- https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning
- The `setUsers` function is happening outside of React's callstack, so it's unsure whether this interaction with the component is properly tested. React Testing Library does not have a utility for jest fake timers and so we need to wrap the timer advancement in `act` ourselves
- https://reactjs.org/docs/testing-recipes.html#act
- When writing UI tests, tasks like rendering, user events, or data fetching can be considered as “units” of interaction with a user interface. `react-dom/test-utils` provides a helper called `act()` that makes sure all updates related to these “units” have been processed and applied to the DOM before you make any assertions:

---

# Mocking callbacks

```js []
function MyButton({ text, onClick }) {
  return (
    <button onClick={onClick} className="super-button">
      {text}
    </button>
  );
}
```

Notes:

- Imagine we have a callback that is triggered when the button is clicked. What could we do to test this interaction?

---

# `jest.fn()`

```js [|1|2|4-5]
const mockWithImplementation = jest.fn((a, b) => a + b);
const emptyMock = jest.fn();

emptyMock.mockReturnValue(42);
console.log(emptyMock()); // 42
```

Notes:

- https://jestjs.io/docs/en/mock-functions
- Mock functions allow you to test the links between code by erasing the actual implementation of a function, capturing calls to the function (and the parameters passed in those calls), capturing instances of constructor functions when instantiated with new, and allowing test-time configuration of return values.

---

# `jest.fn()`

```
.toHaveBeenCalled()
.toHaveBeenCalledTimes(number)
.toHaveBeenCalledWith(arg1, arg2, ...)
.toHaveBeenLastCalledWith(arg1, arg2, ...)
...
```

Notes:

- There are many matchers available in jest

---

# user-event + React

```js [|6|9|11]
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("MyButton", () => {
  const onClickMock = jest.fn();
  render(<MyButton text="Click me" onClick={onClickMock} />);

  userEvent.click(screen.getByRole("button", { name: /Click me/i }));

  expect(onClickMock).toHaveBeenCalledTimes(1);
});
```

Notes:

- An example of `jest.fn()` for callbacks

---

# Mocking modules

```js []
import axios from 'axios';

export default function Users() {
  ...
  React.useEffect(() => {
    axios.get('/users').then(resp => setUsers(resp.data));
  }, []);
  ...
}
```

Notes:

- Sometimes we need to mock some module (e.g. some 3rd party libraries)
- In this example we will mock `axios` - a promise based HTTP client for the browser and node.js
- https://jestjs.io/docs/en/mock-functions#mocking-modules

---

# Mocking modules

```js [|4|7|11]
import axios from "axios";
import Users from "./users";

jest.mock("axios");

test("should fetch users", () => {
  axios.get.mockResolvedValue({ data: [{ name: "Arthur" }] });

  render(<Users />);

  expect(axios.get).toHaveBeenCalledTimes(1);
  ...
});
```

Notes:

- `jest.mock` provides multiple options for mocking a module. You can mock return values, resolved promises, or even an implementation of the mocked module
- https://jestjs.io/docs/en/mock-functions#mocking-modules

---

Don't mock unless you need to.

Notes:

- Mocking sometimes inevitable. It helps us to isolate a unit that we test, and to avoid overcomplicating the test.
- However, by mocking things, we lose some confidence in our tests. What if business logic of the mocked module have changed? We would discover that only later during the acceptance testing phase.
- When testing react, we often write tests that aren't scoped to a single component (unless it is a small reusable UI element, such as a Button). Our goal is to make sure our app's behaviour and business logic is correct.
- So, mocking shouldn't be your default choise.

---

# "Mock Service Worker", aka. `msw`

https://mswjs.io

Notes:

- Mock Service Worker (MSW) is an API mocking library for browser and Node.
- In a nutshell, most solutions provide requests interception on the `application level`, while Mock Service Worker intercepts requests on the `network level`. It also allows you to use the same mock definition not only for testing, but for development and debugging as well.
- https://kentcdodds.com/blog/stop-mocking-fetch

---

# Setup `msw`

```js [|5-9|11]
// server.js
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

const handlers = [
  rest.get("/users", (req, res, ctx) => {
    return res(ctx.json([{ name: "Arthur", id: 42 }]));
  }),
];

export const server = setupServer(...handlers);
```

Notes:

- This configures a request mocking server with the given request handlers.
- To handle a REST API request we need to specify its method, path, and a function that would return the mocked response.
- `msw` can also mock `GraphQL`

---

# Setup `msw`

```js []
// src/setupTests.js
import { server } from './mocks/server.js'
// Establish API mocking before all tests.
beforeAll(() => server.listen())

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished.
afterAll(() => server.close())
```

---

# Testing with `msw`

```js [|4|6]
test("should fetch users", async () => {
  render(<Users />);

  expect(screen.getByText(/Loading/i));

  await screen.findByText(/Arthur/i);
});
```

Notes:

- Imagine that we work with the same `Users` component
- We no longer need to mock anything

---

# Testing with `msw`

```js [2-6|12]
test("should fetch users", async () => {
  server.use(
    rest.get('/users', (req, res, ctx) => {
      return res(ctx.status(404),)
    }),
  )

  render(<Users />);

  expect(screen.getByText(/Loading/i));

  await screen.findByRole("alert", { text: "Oops, failed to fetch!" });
});
```

Notes:

- Alternatively

---

# Testing Hooks

<img data-src="./assets/ram.png">

https://github.com/testing-library/react-hooks-testing-library

---

# Testing Hooks

```js [1|2-5|7-13|15-17|19-21|23-26]
function useDebounce(value, delay = 1000) {
  const [
    debouncedValue,
    setDebouncedValue
  ] = React.useState(value);

  React.useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(id);
  }, [value, delay]);

  function clear() {
    setDebouncedValue("");
  }

  if (debouncedValue === undefined) {
    throw new Error("value is undefined");
  }

  return {
    debouncedValue,
    clear,
  };
}
```

---

# Testing Hooks

```js [1|9-10|11|6-8|14|16-18|20-23|25-28]
import { renderHook, act } from "@testing-library/react-hooks";
import useDebounce from './useDebounce'

test("useDebounce", async () => {
  const {
    result,
    rerender,
    waitForNextUpdate
  } = renderHook(
    ({ value }) => useDebounce(value),
    { initialProps: { value: "Hello" } }
  );

  expect(result.current.debouncedValue).toEqual("Hello");

  rerender({ value: "Goodbye" });
  await waitForNextUpdate();
  expect(result.current.debouncedValue).toEqual("Goodbye");

  act(() => {
    result.current.clear();
  });
  expect(result.current.debouncedValue).toEqual("");

  rerender({ value: undefined });
  // use fake timers instead of waitForNextUpdate
  act(() => jest.advanceTimersByTime(2000));
  expect(result.error).toEqual(Error("value is undefined"));
});

```

---

# Thank you!

https://github.com/AndreyChernykh/react-testing-examples

