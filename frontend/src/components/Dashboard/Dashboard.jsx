import React, { useState, useEffect } from "react";
import Filters from "../Filters/Filters.jsx";
import Stats from "./Stats.jsx";
import TaskForm from "../TaskForm/TaskForm.jsx";
import TaskList from "../TaskList/TaskList.jsx";
import { fetchTasks, generateId } from "../../utils/taskUtils.js";

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchTasks(setTasks);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                <Stats tasks={tasks} />
                <Filters />
                {showAddForm && (
                <TaskForm
                    editingTask={editingTask}
                    setEditingTask={setEditingTask}
                    setShowAddForm={setShowAddForm}
                    setTasks={setTasks}
                    tasks={tasks}
                />
                )}
                <TaskList
                    tasks={tasks}
                    setTasks={setTasks}
                    setEditingTask={setEditingTask}
                    setShowAddForm={setShowAddForm}
                />
            </div>
        </div>
    );
};

export default Dashboard;
