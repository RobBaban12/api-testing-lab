import express from "express";
import prisma from "../../prisma/client";

const router = express.Router();

function MissingReq(this: unknown, name: string, email: string, password: string): boolean {
  return !name || !email || !password;
}

router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (MissingReq.call(this, name, email, password)) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
