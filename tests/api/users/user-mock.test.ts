import request from "supertest";
import app from "../../../src/app";
import { prismaMock } from "../../mocks/prismaMock";

describe("User API with mocks", () => {
  it("should create a new user", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    const mockUser = {
      id: "mock-uuid",
      name: userData.name,
      email: userData.email,
      password: userData.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.user.findUnique.mockResolvedValue(null);

    prismaMock.user.create.mockResolvedValue(mockUser);

    const response = await request(app).post("/api/users").send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id", mockUser.id);
    expect(response.body.name).toBe(userData.name);
    expect(response.body.email).toBe(userData.email);
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
});
