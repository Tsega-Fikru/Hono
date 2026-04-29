import { db } from "../db";
import { commentsTable } from "../schema";
import { eq } from "drizzle-orm";
import { getPostById } from "../post/service";

export const getComments = () =>
  db.select().from(commentsTable);

export const getCommentById = async (id: number) => {
  const res = await db.select().from(commentsTable).where(eq(commentsTable.id, id));
  return res[0] || null;
};

export const getCommentsByPostId = (postId: number) =>
  db.select().from(commentsTable).where(eq(commentsTable.postId, postId));

export const createComment = async (data: any) => {
  const post = await getPostById(data.postId);
  if (!post) throw new Error("Post not found");

  const res = await db.insert(commentsTable).values(data).returning();
  return res[0];
};