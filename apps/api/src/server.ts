import { serve } from "@hono/node-server";
import { bootstrapApp } from "@/pkg/hono/app";

const app = bootstrapApp();

serve({ fetch: app.fetch, port: 3000 });
