import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";

function Counter({ initialValue }) {
  const [value, setValue] = React.useState(initialValue);

  return (
    <div>
      <div>{`Value: ${value}`}</div>
      <button onClick={() => setValue((prev) => prev + 1)}>Increment</button>
    </div>
  );
}

test("Increments the value on click", () => {
  render(<Counter initialValue={3} />);

  expect(screen.getByText(/Value: 3/i));
  fireEvent.click(screen.getByRole("button"));
  expect(screen.getByText(/Value: 4/i));
});
