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

  // get changes history and populate rows depending on type of change
  async getTaskChangesHistory(taskId) {
    try {
      const conn = await client.connect();
      const sql =
      // "select * from changes where task_id = $1 order by created_at desc";
        "SELECT changes.id, changes.task_id, changes.user_id, changes.reassignment_id, changes.status_update_id, changes.created_at, reassignments.assigned_by, reassignments.assigned_to, status_updates.from_status, status_updates.to_status FROM changes LEFT JOIN reassignments ON changes.reassignment_id = reassignments.id LEFT JOIN status_updates ON changes.status_update_id = status_updates.id WHERE changes.task_id = $1 ORDER BY changes.created_at DESC";
      const result = await conn.query(sql, [taskId]);
      conn.release();
      return result.rows;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
    

  async delete(id) {
    try {
      const conn = await client.connect();
      
      //check if exists
      const checkSql = "SELECT * FROM tasks WHERE id=$1";
      const checkResult = await conn.query(checkSql, [id]);
      const task = checkResult.rows[0];
      if (!task) throw new CustomError(`Cannot find task with id ${id}`, 404);

      
      // delete all changes, and associateed reassignments & status_updates
      const deleteChangesSql =
        "DELETE FROM changes WHERE task_id=$1 RETURNING *";
      const deleteChangesResult = await conn.query(deleteChangesSql, [id]);
      const changes = deleteChangesResult.rows;

      for (let change of changes) {
        if (change.reassignment_id) {
          const deleteReassignmentsSql =
            "DELETE FROM reassignments WHERE id=$1 RETURNING *";
          const deleteReassignmentsResult = await conn.query(
            deleteReassignmentsSql,
            [change.reassignment_id]
          );
          const reassignment = deleteReassignmentsResult.rows[0];
        } else if (change.status_update_id) {
          const deleteStatusUpdatesSql =
            "DELETE FROM status_updates WHERE id=$1 RETURNING *";
          const deleteStatusUpdatesResult = await conn.query(
            deleteStatusUpdatesSql,
            [change.status_update_id]
          );
        }
      }

      // delete the task
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
