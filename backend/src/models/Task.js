// Model sederhana tanpa ORM
import db from "../config/db.js";

export const getAllTasks = async () => {
    const [rows] = await db.query("SELECT * FROM tasks ORDER BY created_at DESC");
    return rows;
};

export const createTask = async (task) => {
    const {
        title,
        description,
        status,
        due_date,
        priority,
        assignee,
        category,
        tags,
        estimated_hours,
        progress,
        notes,
        important,
        created_at,
        updated_at
    } = task;

    const [result] = await db.query(
        `INSERT INTO tasks
        (title, description, status, due_date, priority, assignee, category, tags, estimated_hours, progress, notes, important, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            title,
            description,
            status,
            due_date,
            priority,
            assignee,
            category,
            tags,
            estimated_hours,
            progress,
            notes,
            important,
            created_at,
            updated_at
        ]
    );

    return { id: result.insertId, ...task };
};
