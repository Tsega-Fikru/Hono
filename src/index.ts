import "dotenv/config";
import { Hono } from "hono";
import { serve } from "@hono/node-server";

import users from "./users";
import posts from "./post";
import comments from "./comments";

const app = new Hono();

app.get("/", (c) => c.json({ message: "API running" }));

app.route("/users", users);
app.route("/posts", posts);
app.route("/comments", comments);
app.get("/", (c) => {
  return c.json({ message: "API running" });
});

serve({
  fetch: app.fetch,
  port: 3000,
});