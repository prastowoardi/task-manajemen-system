import React from "react";
import TaskItem from "../TaskItem/TaskItem.jsx";

const TaskList = ({ tasks, setTasks, setEditingTask, setShowAddForm }) => {
    return (
        <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Task List</h3>
            {tasks.length === 0 ? (
                <p className="text-gray-500">No tasks found</p>
            ) : (
                <div className="space-y-2">
                    {tasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            tasks={tasks}
                            setTasks={setTasks}
                            setEditingTask={setEditingTask}
                            setShowAddForm={setShowAddForm}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskList;
