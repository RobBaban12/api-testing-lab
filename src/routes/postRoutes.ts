import express from "express";
import prisma from "../../prisma/client";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { title, content, authorId, published = false } = req.body;

    if (!isValidPostData(title, content, authorId)) {
      return res
        .status(400)
        .json({ error: "Title, content, and authorId are required" });
    }

    const author = await prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published,
        authorId,
      },
    });

    return res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const isValidPostData = (title: string, content: string, authorId: string) => {
  return !!(title && content && authorId);
};

router.get("/", async (req, res) => {
  try {
    const { published } = req.query;

    const posts = await prisma.post.findMany({
      where:
        published !== undefined
          ? {
              published: published === "true",
            }
          : undefined,
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        comments: true,
      },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, published } = req.body;

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title: title !== undefined ? title : post.title,
        content: content !== undefined ? content : post.content,
        published: published !== undefined ? published : post.published,
      },
    });

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
