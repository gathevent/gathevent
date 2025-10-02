import { serve } from "@hono/node-server";
import { appFactory } from "@/pkg/hono/app";
import { registerAuthRegister } from "@/routes/auth/register";

const app = appFactory();

registerAuthRegister(app);

serve({ fetch: app.fetch, port: 3000 });
