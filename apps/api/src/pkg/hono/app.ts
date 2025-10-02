import { APP_DESCRIPTION, APP_NAME } from "@gathevent/shared/constants";
import { OpenAPIHono } from "@hono/zod-openapi";
import { prettyJSON } from "hono/pretty-json";

const bootstrapApp = () => {
  const app = new OpenAPIHono();

  app.use(prettyJSON());

  app.doc("/openapi.json", {
    openapi: "3.0.0",
    info: {
      title: APP_NAME,
      description: APP_DESCRIPTION,
      version: "1.0.0",
    },
  });

  return app;
};

export { bootstrapApp };
