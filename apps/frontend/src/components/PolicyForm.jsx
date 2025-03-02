// src/components/PolicyForm.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function PolicyForm() {
  const { id } = useParams(); // policy id for editing
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCustomerId = queryParams.get("customerId") || "";
  
  const [policy, setPolicy] = useState({
    policyNumber: "",
    startDate: "",
    expiryDate: "",
    customerId: initialCustomerId
  });
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    // Fetch all customers for dropdown
    fetch("http://localhost:5001/api/customers")
      .then(res => res.json())
      .then(data => setCustomers(data));

    if (id) {
      // If editing, fetch policy details
      fetch(`http://localhost:5001/api/policies/${id}`)
        .then(res => res.json())
        .then(data => {
          data.startDate = data.startDate ? new Date(data.startDate).toISOString().substring(0,10) : "";
          data.expiryDate = data.expiryDate ? new Date(data.expiryDate).toISOString().substring(0,10) : "";
          setPolicy(data);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setPolicy({ ...policy, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = id ? `http://localhost:5001/api/policies/${id}` : "http://localhost:5001/api/policies";
    const method = id ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(policy)
    });
    navigate(`/customers/${policy.customerId}/policies`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? "Edit" : "Add"} Policy</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Policy Number</label>
          <input 
            type="text" 
            name="policyNumber" 
            value={policy.policyNumber} 
            onChange={handleChange} 
            required 
            className="border p-2 w-full rounded" 
          />
        </div>
        <div>
          <label className="block mb-1">Start Date</label>
          <input 
            type="date" 
            name="startDate" 
            value={policy.startDate} 
            onChange={handleChange} 
            required 
            className="border p-2 w-full rounded" 
          />
        </div>
        <div>
          <label className="block mb-1">Expiry Date</label>
          <input 
            type="date" 
            name="expiryDate" 
            value={policy.expiryDate} 
            onChange={handleChange} 
            required 
            className="border p-2 w-full rounded" 
          />
        </div>
        <div>
          <label className="block mb-1">Customer</label>
          <select 
            name="customerId" 
            value={policy.customerId} 
            onChange={handleChange} 
            required 
            className="border p-2 w-full rounded"
          >
            <option value="">Select a customer</option>
            {customers.map(customer => (
              <option key={customer._id} value={customer._id}>{customer.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {id ? "Update" : "Create"} Policy
        </button>
      </form>
    </div>
  );
}

export default PolicyForm;
