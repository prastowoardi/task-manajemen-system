import { useEffect, useState } from "react";
import TaskForm from "../TaskForm/TaskForm.jsx";

export default function TaskList() {
    const [tasks, setTasks] = useState([]);

    // GET tasks saat load
    useEffect(() => {
        fetch("http://localhost:5000/api/tasks")
        .then((res) => res.json())
        .then((data) => setTasks(data));
    }, []);

    return (
        <div>
        <h1>Daftar Task</h1>
        <TaskForm onTaskCreated={(task) => setTasks([task, ...tasks])} />
        <ul>
            {tasks.map((task) => (
            <li key={task.id}>
                <strong>{task.title}</strong> - {task.description}
            </li>
            ))}
        </ul>
        </div>
    );
}
