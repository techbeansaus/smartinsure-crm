// src/components/TaskList.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function TaskList() {
  const { customerId } = useParams();
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const url = customerId 
      ? `http://localhost:5001/api/tasks?customerId=${customerId}` 
      : `http://localhost:5001/api/tasks`;
    const res = await fetch(url);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, [customerId]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tasks for Customer {customerId}</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Policy Number</th>
            <th className="py-2">Expiry Date</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task._id} className="border-t">
              <td className="py-2">{task.policyNumber}</td>
              <td className="py-2">{new Date(task.expiryDate).toLocaleDateString()}</td>
              <td className="py-2">{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;
