import React from "react";
import axios from "axios";
import { render, screen, waitFor } from "@testing-library/react";

jest.mock("axios");

function Users() {
  const [users, setUsers] = React.useState(null);

  React.useEffect(() => {
    axios.get("/users").then((resp) => setUsers(resp.data));
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

test("should fetch users", async () => {
  axios.get.mockResolvedValue({
    data: [{ name: "Arthur", id: 42 }],
  });

  render(<Users />);

  expect(screen.getByText(/Loading/i));

  await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
});
