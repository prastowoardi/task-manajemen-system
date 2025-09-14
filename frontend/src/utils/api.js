const API_URL = "http://localhost:5000/api";

export async function fetchTasks() {
    const res = await fetch(`${API_URL}/tasks`);
    return res.json();
}

export async function addTask(task) {
    const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task)
    });
    return res.json();
}
