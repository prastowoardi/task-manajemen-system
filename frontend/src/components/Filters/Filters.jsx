import React from "react";

const Filters = () => {
    return (
        <div className="bg-white p-4 rounded shadow mb-4">
            <h3 className="text-lg font-semibold mb-2">Filters</h3>
            {/* isi filter misalnya dropdown status */}
            <select className="border rounded p-2 w-full">
                <option value="">All</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="pending">Pending</option>
            </select>
        </div>
    );
};

export default Filters;
