import client from "../db-client.js";

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
class TaskStore {
  async getAll() {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM tasks";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getById(id) {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM tasks WHERE id=$1";
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async add(title, description, created_by) {
    try {
      const conn = await client.connect();
      const sql =
        "INSERT INTO tasks (title, description, created_by) VALUES ($1, $2, $3) RETURNING *";
      const result = await conn.query(sql, [title, description, created_by]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async updateStatus(taskId, newStatus, userId) {
    try {
      const conn = await client.connect();
      await conn.query("BEGIN");
      const find = await conn.query("SELECT * FROM tasks WHERE id = $1", [
        taskId,
      ]);
      const task = find.rows[0];
      if (!task) throw new Error(`Cannot find task with id ${taskId}`);
      if (task.status === newStatus) {
        throw new CustomError(`Task is already ${newStatus}`, 422);
      }

      // Update task status and updated_by fields
      const updateTaskSql =
        "UPDATE tasks SET status = $1, updated_by = $2 WHERE id = $3 RETURNING *";
      const updateTaskResult = await conn.query(updateTaskSql, [
        newStatus,
        userId,
        taskId,
      ]);
      const updatedTask = updateTaskResult.rows[0];

      // Insert record into status_updates table
      const insertStatusUpdatesSql =
        "INSERT INTO status_updates (from_status, to_status) VALUES ($1, $2) RETURNING id";
      const insertStatusUpdate = await conn.query(insertStatusUpdatesSql, [
        task.status,
        newStatus,
      ]);
      const statusUpdateId = insertStatusUpdate.rows[0].id;

      // Insert record into changes table
      const insertChangesSql =
        "INSERT INTO changes (task_id, user_id, status_update_id) VALUES ($1, $2, $3) RETURNING *";
      const change = await conn.query(insertChangesSql, [
        taskId,
        userId,
        statusUpdateId,
      ]);

      await conn.query("COMMIT");
      conn.release();

      return updatedTask;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  }

  reassignTask = async (taskId, userId, newUserId) => {
    const conn = await client.connect();
    try {
      await conn.query("BEGIN");

      const taskQuery = "SELECT * FROM tasks WHERE id = $1";
      const taskResult = await conn.query(taskQuery, [taskId]);
      const task = taskResult.rows[0];
      if (!task) throw new Error(`Cannot find task with id ${taskId}`);
      if (task.assigned_to === newUserId) {
        throw new CustomError(
          `Task is already assigned to user with id ${newUserId}`,
          422
        );
      }

      // Update task assigned_to and updated_by fields
      const updateTaskSql =
        "UPDATE tasks SET assigned_to = $1, updated_by = $2 WHERE id = $3 RETURNING *";
      const updateTask = await conn.query(updateTaskSql, [
        newUserId,
        userId,
        taskId,
      ]);
      const updatedTask = updateTask.rows[0];

      // Insert record into reassignments table
      const reassignmentQuery =
        "INSERT INTO reassignments(assigned_by, assigned_to) VALUES($1, $2) RETURNING *";
      const reassignmentResult = await conn.query(reassignmentQuery, [
        userId,
        newUserId,
      ]);
      const reassignmentId = reassignmentResult.rows[0].id;

      // Insert record into changes table
      const changeQuery =
        "INSERT INTO changes(reassignment_id, user_id, task_id) VALUES($1, $2, $3) RETURNING *";
      const change = await conn.query(changeQuery, [
        reassignmentId,
        userId,
        taskId,
      ]);
      await conn.query("COMMIT");
      return updatedTask;
    } catch (error) {
      await conn.query("ROLLBACK");
      throw error;
    } finally {
      conn.release();
    }
  };

  async delete(id) {
    try {
      const conn = await client.connect();
      const sql = "DELETE FROM tasks WHERE id=$1";
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export default TaskStore;
