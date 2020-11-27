import { setupServer } from "msw/node";
import { rest } from "msw";

export const handlers = [
  rest.get("/users", (req, res, ctx) => {
    return res(ctx.json([{ name: "Arthur", id: 42 }]));
  }),
];

// This configures a request mocking server with the given request handlers.
export const server = setupServer(...handlers);
