import request from "supertest";
import app from "../../../src/app";
import { prismaMock } from "../../mocks/prismaMock";

describe("Post API", () => {
  const mockUser = {
    id: "mock-user-id",
    name: "Test Author",
    email: "author@example.com",
    password: "password123",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it("should create a new post", async () => {
    const postData = {
      title: "Test Post",
      content: "This is a test post content",
      authorId: mockUser.id,
      published: true,
    };

    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    const mockPost = {
      id: "mock-post-id",
      title: postData.title,
      content: postData.content,
      authorId: mockUser.id,
      published: postData.published,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.post.create.mockResolvedValue(mockPost);

    const response = await request(app).post("/api/posts").send(postData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe(postData.title);
    expect(response.body.content).toBe(postData.content);
    expect(response.body.authorId).toBe(mockUser.id);
    expect(response.body.published).toBe(postData.published);
  });

  it("should get post by ID with author and comments", async () => {
    const mockPost = {
      id: "detailed-post-id",
      title: "Detailed Post",
      content: "This is a detailed post",
      authorId: mockUser.id,
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: {
        id: mockUser.id,
        name: mockUser.name,
      },
      comments: [
        {
          id: "comment-id",
          content: "Test comment",
          postId: "detailed-post-id",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    prismaMock.post.findUnique.mockResolvedValue(mockPost as any);

    const response = await request(app).get(`/api/posts/${mockPost.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", mockPost.id);
    expect(response.body).toHaveProperty("author");
    expect(response.body.author.id).toBe(mockUser.id);
    expect(response.body).toHaveProperty("comments");
    expect(response.body.comments).toHaveLength(1);
  });

  it("should return 400 if required fields are missing", async () => {
    const postData = {
      title: "Test Post",
      authorId: mockUser.id,
    };

    const response = await request(app).post("/api/posts").send(postData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toContain("required");
  });

  it("should return 404 if author does not exist", async () => {
    const postData = {
      title: "Test Post",
      content: "This is a test post content",
      authorId: "non-existent-author-id",
      published: true,
    };

    prismaMock.user.findUnique.mockResolvedValue(null);

    const response = await request(app).post("/api/posts").send(postData);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toContain("Author not found");
  });

  it("should return 404 if post is not found", async () => {
    const nonExistentId = "non-existent-id";

    prismaMock.post.findUnique.mockResolvedValue(null);

    const response = await request(app).get(`/api/posts/${nonExistentId}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toContain("not found");
  });
});
