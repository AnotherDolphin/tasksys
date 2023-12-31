import request from "supertest";
import app from "../app.js";
import TaskStore from "../models/task.js";

describe("Task API", () => {
  const taskStore = new TaskStore();
  let testTask;

  describe("Create Task", () => {
    it("should create a new task", async () => {
      const res = await request(app).post("/tasks").send({
        title: "Test task",
        description: "Test task very long long description",
        user: 3,
      });

      testTask = res.body;
      expect(res.statusCode).toEqual(201);
      expect(res.body.title).toEqual("Test task");
    });
  });

  describe("Get All Tasks", () => {
    it("should return an array of tasks", async () => {
      const res = await request(app).get("/tasks");
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("Update Task Status", () => {
    it("should update a task status", async () => {
      const res = await request(app).put(`/tasks/${testTask.id}/status`).send({
        status: "InProgress",
        user: 3,
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual("InProgress");
    });
  });

  describe("Reassign Task", () => {
    it("should reassign a task to another user", async () => {
      const res = await request(app).put(`/tasks/${testTask.id}/assign`).send({
        user: 3,
        newUser: 2,
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body.assigned_to).toEqual(2);
    });
  });

  describe("Try to reassign task to the same user", () => {
    it("should return 422", async () => {
      const res = await request(app).put(`/tasks/${testTask.id}/assign`).send({
        user: 3,
        newUser: 2,
      });
      expect(res.statusCode).toEqual(422);
    });
  });

  describe("Get Task by ID", () => {
    it("should return a task", async () => {
      const res = await request(app).get(`/tasks/${testTask.id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.title).toEqual("Test task");
    });
  });

  describe("Invalid ID", () => {
    it("should return 404 for invalid id", async () => {
      const res = await request(app).get("/tasks/9999");
      expect(res.statusCode).toEqual(404);
    });
  });

  describe("Delete Task", () => {
    it("should delete a task", async () => {
      const res = await request(app).delete(`/tasks/${testTask.id}`);
      expect(res.statusCode).toEqual(200);
    });
  });

  describe("Try to update task with wrong user", () => {
    it("should return 401", async () => {
      const res = await request(app).post("/tasks").send({
        title: "Test task",
        description: "Test task very long long description",
        user: 3,
      });
      const task = res.body;
      const res2 = await request(app).put(`/tasks/${task.id}/status`).send({
        status: "InProgress",
        user: 2,
      });
      expect(res2.statusCode).toEqual(401);
      await request(app).delete(`/tasks/${task.id}`);
    });
  });
});
