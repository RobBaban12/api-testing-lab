import request from "supertest";
import app from "../../../src/app";
import { prismaMock } from "../../mocks/prismaMock";

describe("Comment API", () => {
  const mockUser = {
    id: "mock-user-id",
    name: "Comment Test Author",
    email: "comment.author@example.com",
    password: "password123",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPost = {
    id: "mock-post-id",
    title: "Test Post for Comments",
    content: "This is a test post for comment tests",
    authorId: mockUser.id,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it("should create a new comment", async () => {
    const commentData = {
      content: "This is a test comment",
      postId: mockPost.id,
    };

    prismaMock.post.findUnique.mockResolvedValue(mockPost);

    const mockComment = {
      id: "mock-comment-id",
      content: commentData.content,
      postId: mockPost.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.comment.create.mockResolvedValue(mockComment);

    const response = await request(app).post("/api/comments").send(commentData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.content).toBe(commentData.content);
    expect(response.body.postId).toBe(mockPost.id);
  });

  it("should get all comments for a post", async () => {
    prismaMock.post.findUnique.mockResolvedValue(mockPost);

    const mockComments = [
      {
        id: "comment-1",
        content: "First comment",
        postId: mockPost.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "comment-2",
        content: "Second comment",
        postId: mockPost.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "comment-3",
        content: "Third comment",
        postId: mockPost.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    prismaMock.comment.findMany.mockResolvedValue(mockComments);

    const response = await request(app).get(
      `/api/comments/post/${mockPost.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);

    const contents = response.body.map((comment: any) => comment.content);
    expect(contents).toContain("First comment");
    expect(contents).toContain("Second comment");
    expect(contents).toContain("Third comment");
  });

  it("should return 400 if content is missing", async () => {
    const commentData = {
      postId: mockPost.id,
    };

    const response = await request(app).post("/api/comments").send(commentData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toContain("required");
  });

  it("should return 404 if post does not exist", async () => {
    const commentData = {
      content: "This is a test comment",
      postId: "non-existent-post-id",
    };

    prismaMock.post.findUnique.mockResolvedValue(null);

    const response = await request(app).post("/api/comments").send(commentData);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toContain("Post not found");
  });

  it("should return 404 if comment is not found", async () => {
    const nonExistentId = "non-existent-id";

    prismaMock.comment.findUnique.mockResolvedValue(null);

    const response = await request(app).get(`/api/comments/${nonExistentId}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toContain("not found");
  });
});
