import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";

function Users() {
  const [users, setUsers] = React.useState(null);

  React.useEffect(() => {
    setTimeout(() => {
      setUsers([{ name: "Arthur", id: 42 }]);
    }, 6000);
  }, []);

  if (!users) {
    return "Loading...";
  }

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Fake timers using Jest
beforeEach(() => {
  jest.useFakeTimers();
});

test("should fetch users", async () => {
  render(<Users />);

  expect(screen.getByText(/Loading/i));

  act(() => jest.advanceTimersByTime(5000));
  // Still not there
  expect(screen.queryByText(/Arthur/i)).not.toBeInTheDocument();

  act(() => jest.advanceTimersByTime(1000));
  // And not it is loaded
  screen.getByText(/Arthur/i);
});

// Running all pending timers and switching to real timers using Jest
afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
