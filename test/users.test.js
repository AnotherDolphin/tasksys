import request from "supertest";
import app from "../app.js";
import UserStore from "../models/user.js";

describe("users router", () => {
  const userStore = new UserStore();
  let testUser;

  describe("POST /users", () => {
    it("should create a new user", async () => {
      const res = await request(app).post("/users").send({
        username: "testinguser",
      });
      testUser = res.body;
      expect(res.statusCode).toEqual(200);
      expect(res.body.username).toEqual("testinguser");
    });
  });

  describe("POST /users", () => {
    it("should reject same username", async () => {
      const res = await request(app).post("/users").send({
        username: "testinguser",
      });
      expect(res.statusCode).toEqual(422);
    });
  });

  describe("GET /users", () => {
    it("should fetch all users", async () => {
      const res = await request(app).get("/users");
      expect(res.statusCode).toEqual(200);
    });
  });

  describe("GET /users/:username", () => {
    it("should fetch a user by username", async () => {
      const res = await request(app).get(`/users/${testUser.username}`);
      expect(res.statusCode).toEqual(200);
      // expect(res.body.username).toEqual(testUser.username);
    });
  });

  describe("GET /users/:username", () => {
    it("should return 404 for invalid username", async () => {
      const res = await request(app).get("/users/invalid");
      expect(res.statusCode).toEqual(404);
    });
  });

  afterAll(async () => {
    await userStore.delete(testUser.id);
  });
});
