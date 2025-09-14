import React from "react";

const Stats = ({ tasks }) => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "completed").length;
    const inProgress = tasks.filter(t => t.status === "in-progress").length;
    const pending = tasks.filter(t => t.status === "pending").length;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
            <h3 className="text-sm text-gray-500">Total Tasks</h3>
            <p className="text-xl font-bold">{total}</p>
        </div>
        <div className="bg-green-50 p-4 rounded shadow">
            <h3 className="text-sm text-gray-500">Completed</h3>
            <p className="text-xl font-bold text-green-600">{completed}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded shadow">
            <h3 className="text-sm text-gray-500">In Progress</h3>
            <p className="text-xl font-bold text-blue-600">{inProgress}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded shadow">
            <h3 className="text-sm text-gray-500">Pending</h3>
            <p className="text-xl font-bold text-yellow-600">{pending}</p>
        </div>
        </div>
    );
};

export default Stats;
