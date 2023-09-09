import request from "supertest";
import app from "../app.js"
import UserStore from "../models/user.js";
import {jest} from '@jest/globals'

describe("users router", () => {
  beforeEach(() => {
    jest.spyOn(UserStore, "getAll").mockResolvedValue([
      { id: 1, username: "alice" },
      { id: 2, username: "bob" },
    ]);
    jest
      .spyOn(UserStore, "add")
      .mockResolvedValue({ id: 3, username: "charlie" });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("GET /users", () => {
    it("responds with JSON", async () => {
      const response = await request(app)
        .get("/users")
        .set("Accept", "application/json");
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { id: 1, username: "alice" },
        { id: 2, username: "bob" },
      ]);
    });
  });

  describe("POST /users", () => {
    it("responds with JSON", async () => {
      const response = await request(app)
        .post("/users")
        .send({ username: "charlie" })
        .set("Accept", "application/json");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 3, username: "charlie" });
    });

    it("responds with 400 if username is missing", async () => {
      const response = await request(app)
        .post("/users")
        .set("Accept", "application/json");
      expect(response.status).toBe(400);
      expect(response.text).toBe("username is required");
    });
  });

  // afterAll(async () => {
  //   await app.close();
  // });
});
