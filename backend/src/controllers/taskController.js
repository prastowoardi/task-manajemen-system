import { getAllTasks, createTask } from "../models/Task.js";

export const getTasks = async (req, res) => {
    try {
        const tasks = await getAllTasks();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const addTask = async (req, res) => {
    try {
        const task = await createTask(req.body);
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: "Gagal menambahkan task" });
    }
};
