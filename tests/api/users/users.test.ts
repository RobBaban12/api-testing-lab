import request from "supertest";
import app from "../../../src/app";
import { prismaMock } from "../../mocks/prismaMock";

describe("User API", () => {
  it("should create a new user", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    prismaMock.user.findUnique.mockResolvedValue(null);

    const mockUser = {
      id: "mock-user-id",
      name: userData.name,
      email: userData.email,
      password: userData.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.user.create.mockResolvedValue(mockUser);

    const response = await request(app).post("/api/users").send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe(userData.name);
    expect(response.body.email).toBe(userData.email);
    expect(response.body).not.toHaveProperty("password");
  });

  it("should return user by ID", async () => {
    const mockSelectedUser = {
      id: "get-user-id",
      name: "Get User",
      email: "get@example.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.user.findUnique.mockResolvedValue(mockSelectedUser as any);

    const response = await request(app).get(
      `/api/users/${mockSelectedUser.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", mockSelectedUser.id);
    expect(response.body).toHaveProperty("name", mockSelectedUser.name);
    expect(response.body).toHaveProperty("email", mockSelectedUser.email);
    expect(response.body).not.toHaveProperty("password");
  });

  it("should return 400 if email is missing", async () => {
    const userData = {
      name: "Test User",
      password: "password123",
    };

    const response = await request(app).post("/api/users").send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toContain("required");
  });

  it("should return 400 if email is invalid", async () => {
    const userData = {
      name: "Test User",
      email: "invalid-email",
      password: "password123",
    };

    const response = await request(app).post("/api/users").send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toContain("Invalid email");
  });

  it("should return 404 if user is not found", async () => {
    const nonExistentId = "non-existent-id";

    prismaMock.user.findUnique.mockResolvedValue(null);

    const response = await request(app).get(`/api/users/${nonExistentId}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toContain("not found");
  });
});
