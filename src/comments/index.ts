import { Hono } from "hono";
import {
  getComments,
  getCommentById,
  createComment,
  getCommentsByPostId,
} from "./service.js";

const comments = new Hono();

comments.get("/", async (c) => {
  return c.json(await getComments());
});

comments.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "Invalid comment ID" }, 400);

  const comment = await getCommentById(id);
  if (!comment) return c.json({ error: "Comment not found" }, 404);

  return c.json(comment);
});

comments.post("/", async (c) => {
  const body = await c.req.json();

  if (!body.content || !body.postId) {
    return c.json({ error: "Missing fields" }, 400);
  }

  try {
    const comment = await createComment({
      content: body.content,
      postId: Number(body.postId),
    });

    return c.json(comment, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 404);
  }
});

export default comments;