import React from "react";

const TaskItem = ({ task, setEditingTask, setShowAddForm, setTasks, tasks }) => {
    const handleDelete = () => {
        // hapus task dari list (sementara, nanti bisa dihubungkan ke API/database)
        const updatedTasks = tasks.filter(t => t.id !== task.id);
        setTasks(updatedTasks);
    };

    return (
        <div className="p-4 border rounded-lg shadow-sm flex justify-between items-center mb-2 bg-white">
            <div>
                <h4 className="font-semibold text-gray-800">{task.title}</h4>
                <p className="text-sm text-gray-500">{task.description}</p>
                <span
                    className={`text-xs px-2 py-1 rounded-full ${
                        task.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : task.status === "in-progress"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-yellow-100 text-yellow-600"
                    }`}
                >
                    {task.status}
                </span>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => {
                        setEditingTask(task);
                        setShowAddForm(true);
                    }}
                    className="text-blue-500 hover:underline"
                >
                    Edit
                </button>
                <button
                    onClick={handleDelete}
                    className="text-red-500 hover:underline"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default TaskItem;
