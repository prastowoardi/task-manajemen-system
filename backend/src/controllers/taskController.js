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
        const {
            title,
            description,
            status,
            dueDate,
            priority,
            assignee,
            category,
            tags,
            estimatedHours,
            progress,
            notes,
            important,
            createdAt,
            updatedAt
        } = req.body;

        if (!title || !status) {
            return res.status(400).json({ error: 'title, dan status wajib diisi' });
        }

        const newTask = await createTask({
            title,
            description: description || '',
            status,
            due_date: dueDate || null,
            priority: priority || 'medium',
            assignee: assignee || '',
            category: category || '',
            tags: tags || '',
            estimated_hours: estimatedHours || 0,
            progress: progress || 0,
            notes: notes || '',
            important: important || false,
            created_at: createdAt || new Date(),
            updated_at: updatedAt || new Date()
        });

        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({
            error: 'Gagal menambahkan task',
            details: error.message
        });
    }
};
