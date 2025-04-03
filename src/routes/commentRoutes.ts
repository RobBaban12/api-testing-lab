import express from "express";
import prisma from "../../prisma/client";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { content, postId } = req.body;

    if (!content || !postId) {
      return res.status(400).json({ error: "Content and postId are required" });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
      },
    });

    return res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/post/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
    });

    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    return res.status(200).json(comment);
  } catch (error) {
    console.error("Error fetching comment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    await prisma.comment.delete({
      where: { id },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
