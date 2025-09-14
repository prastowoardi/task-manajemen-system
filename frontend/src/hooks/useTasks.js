import { useEffect, useState } from "react";
import { fetchTasks, addTask } from "../utils/api";

export function useTasks() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        const data = await fetchTasks();
        setTasks(data);
    };

    const createTask = async (task) => {
        const newTask = await addTask(task);
        setTasks((prev) => [newTask, ...prev]);
    };

    return { tasks, createTask };
}
