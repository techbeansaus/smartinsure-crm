// src/components/CustomerList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  const fetchCustomers = async () => {
    let url = "http://localhost:5001/api/customers";
    if (search) {
      url = `http://localhost:5001/api/customers/search?name=${search}`;
    }
    const res = await fetch(url);
    const data = await res.json();
    setCustomers(data);
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      await fetch(`http://localhost:5001/api/customers/${id}`, { method: "DELETE" });
      fetchCustomers();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      <div className="mb-4">
        <input 
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Phone</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer._id} className="border-t">
              <td className="py-2">{customer.name}</td>
              <td className="py-2">{customer.email}</td>
              <td className="py-2">{customer.phone}</td>
              <td className="py-2 space-x-2">
                <Link to={`/customers/edit/${customer._id}`} className="text-blue-500">Edit</Link>
                <button onClick={() => handleDelete(customer._id)} className="text-red-500">Delete</button>
                <Link to={`/customers/${customer._id}/policies`} className="text-green-500">Policies</Link>
                <Link to={`/customers/${customer._id}/tasks`} className="text-purple-500">Tasks</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerList;
