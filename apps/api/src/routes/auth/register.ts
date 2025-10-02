import { createRoute, z } from "@hono/zod-openapi";
import type { App } from "@/pkg/hono/app";

const route = createRoute({
  tags: ["auth"],
  summary: "Register a new user",
  method: "post",
  path: "/auth/register",
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: z.object({
            name: z.string().min(1).max(100).describe("The user's full name"),
            email: z.email().describe("The user's email address"),
            password: z.string().min(6).max(100).describe("The user's password"),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: "User registered successfully",
      content: {
        "application/json": {
          schema: z.object({
            id: z.uuid().describe("The user's unique identifier"),
            name: z.string().describe("The user's full name"),
            email: z.email().describe("The user's email address"),
            createdAt: z.string().describe("The timestamp when the user was created"),
          }),
        },
      },
    },
  },
});

const registerAuthRegister = (app: App) => {
  app.openapi(route, async (_) => {
    throw new Error("Not implemented");
  });
};

export { registerAuthRegister };
