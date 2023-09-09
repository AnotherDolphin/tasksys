import request from "supertest";
import app from "../app.js";
import TaskStore from "../models/task.js";
import { jest } from "@jest/globals";

describe("Task API", () => {
  describe("Create Task", () => {
    it("should create a new task", async () => {
      const taskStore = new TaskStore();
      const taskStoreMock = jest.spyOn(taskStore, "add").mockResolvedValue({
        id: 2,
        title: "Test task",
        description: "Test task very long long description",
        status: "ToDo",
        created_by: 3,
      });

      const res = await request(app).post("/tasks").send({
        title: "Test task",
        description: "Test task very long long description",
        user: 3,
      })

      expect(res.statusCode).toEqual(201);
      expect(res.body.title).toEqual("Test task");
      taskStoreMock.mockRestore();
    });
  });

  describe("Update Task Status", () => {
    it("should update a task status", async () => {
      const res = await request(app).put("/tasks/2/status").send({
        status: "Done",
        user: 3,
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual("Done");
    });
  });

  describe("Reassign Task", () => {
    it("should reassign a task to another user", async () => {
      const res = await request(app).put("/tasks/2/assign").send({
        user: 2,
        newUser: 3,
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body.assigned_to).toEqual(3);
    });
  });

  describe("Invalid ID", () => {
    it("should return 404 for invalid id", async () => {
      const res = await request(app).get("/tasks/9999");
      expect(res.statusCode).toEqual(404);
    });
  });
});

// it('should return 422 for invalid id', async () => {
//   const res = await request(app)
//     .get('/tasks/9999')
//   expect(res.statusCode).toEqual(422);
// });
