import React from "react";
import { render, screen } from "@testing-library/react";

function Hello({ name }) {
  if (name) {
    return <h1>Hello, {name}!</h1>;
  } else {
    return <span>Hey, stranger</span>;
  }
}

test("Hello", () => {
  const { rerender } = render(<Hello />);
  expect(screen.getByText("Hey, stranger")).toBeVisible();

  rerender(<Hello name="Andrei" />);
  expect(screen.getByRole("heading")).toHaveTextContent("Hello, Andrei!");
});
