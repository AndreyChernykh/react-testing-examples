import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

function Counter({ initialValue, onClick }) {
  const [value, setValue] = React.useState(initialValue);

  return (
    <div>
      <div>{`Value: ${value}`}</div>
      <button
        onClick={() => {
          onClick(value + 1);
          setValue((prev) => prev + 1);
        }}
      >
        Increment
      </button>
    </div>
  );
}

test("Increments the value on click", () => {
  const onClick = jest.fn();
  render(<Counter initialValue={3} onClick={onClick} />);

  expect(screen.getByText(/Value: 3/i));
  userEvent.click(screen.getByRole("button"));
  expect(screen.getByText(/Value: 4/i));

  // https://jestjs.io/docs/en/expect#tohavebeencalledwitharg1-arg2-
  expect(onClick).toHaveBeenCalledWith(4);
});
