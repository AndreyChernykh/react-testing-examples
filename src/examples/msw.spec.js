import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { server } from "../mocks/server";
import { rest } from "msw";

function Users() {
  const [users, setUsers] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      try {
        const response = await fetch("/users");

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          setError(response);
        }
      } catch (err) {
        setError(err);
      }
    })();
  }, []);

  if (error) {
    return <p role="alert">Oops, failed to fetch!</p>;
  }

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

test("should fetch users", async () => {
  server.use(
    rest.get("/users", (req, res, ctx) => {
      return res(ctx.status(404));
    })
  );

  render(<Users />);

  screen.getByText("Loading...");

  await screen.findByRole("alert", { text: "Oops, failed to fetch!" });
});
