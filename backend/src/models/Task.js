// Model sederhana tanpa ORM
import db from "../config/db.js";

export const getAllTasks = async () => {
    const [rows] = await db.query("SELECT * FROM tasks ORDER BY created_at DESC");
    return rows;
};

export const createTask = async (task) => {
    const { user_id, title, description, status, due_date } = task;
    const [result] = await db.query(
        "INSERT INTO tasks (user_id, title, description, status, due_date) VALUES (?, ?, ?, ?, ?)",
        [user_id, title, description, status, due_date]
    );
    return { id: result.insertId, ...task };
};
