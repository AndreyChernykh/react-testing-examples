import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";

function useDebounce(value, delay = 1000) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

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

// Fake timers using Jest
beforeEach(() => {
  jest.useFakeTimers();
});

test("useDebounce", async () => {
  const { result, rerender, waitForNextUpdate } = renderHook(
    ({ value }) => useDebounce(value),
    { initialProps: { value: "Hello" } }
  );

  expect(result.current.debouncedValue).toEqual("Hello");

  rerender({ value: "Goodbye" });

  act(() => jest.advanceTimersByTime(2000));

  expect(result.current.debouncedValue).toEqual("Goodbye");

  act(() => {
    result.current.clear();
  });

  expect(result.current.debouncedValue).toEqual("");

  rerender({ value: undefined });

  act(() => jest.advanceTimersByTime(2000));

  expect(result.error).toEqual(Error("value is undefined"));
});

// Running all pending timers and switching to real timers using Jest
afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
