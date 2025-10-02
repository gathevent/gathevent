import { serve } from "@hono/node-server";
import { appFactory } from "@/pkg/hono/app";

const app = appFactory();

serve({ fetch: app.fetch, port: 3000 });
