import { useState } from "react";

export default function TaskForm({ onTaskCreated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newTask = {
        user_id: 1, // contoh hardcode dulu
        title,
        description,
        status: "pending",
        due_date: "2025-09-20"
        };

        const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
        });

        const data = await res.json();
        onTaskCreated(data); // update state di parent
        setTitle("");
        setDescription("");
    };

    return (
        <form onSubmit={handleSubmit}>
        <input
            type="text"
            placeholder="Judul task"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />
        <input
            type="text"
            placeholder="Deskripsi"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Tambah Task</button>
        </form>
    );
}
