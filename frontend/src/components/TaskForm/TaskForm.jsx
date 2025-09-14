import { useState } from "react";

export default function TaskForm({ onAdd }) {
    const [title, setTitle] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
            onAdd({
            user_id: 1, // sementara hardcode
            title,
            description: "Deskripsi otomatis",
            status: "todo",
            due_date: null
        });
        setTitle("");
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
        <input
            type="text"
            placeholder="Task baru..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Tambah
        </button>
        </form>
    );
}
