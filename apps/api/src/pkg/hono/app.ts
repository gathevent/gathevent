import { APP_DESCRIPTION, APP_NAME } from "@gathevent/shared/constants";
import { OpenAPIHono } from "@hono/zod-openapi";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { requestId } from "hono/request-id";
import { handleError, handleNotFound } from "../errors/http";

const appFactory = () => {
  const app = new OpenAPIHono();

  app.use(requestId());
  app.use(prettyJSON());
  app.use(logger());

  app.notFound(handleNotFound);
  app.onError(handleError);

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

export { appFactory };
