// src/components/CustomerForm.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function CustomerForm() {
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5001/api/customers/${id}`)
        .then(res => res.json())
        .then(data => setCustomer(data));
    }
  }, [id]);

  const handleChange = (e) => {
    setCustomer({...customer, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = id ? `http://localhost:5001/api/customers/${id}` : "http://localhost:5001/api/customers";
    const method = id ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer)
    });
    navigate("/customers");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{id ? "Edit" : "Add"} Customer</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input 
            type="text" 
            name="name" 
            value={customer.name} 
            onChange={handleChange} 
            required 
            className="border p-2 w-full rounded" 
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input 
            type="email" 
            name="email" 
            value={customer.email} 
            onChange={handleChange} 
            required 
            className="border p-2 w-full rounded" 
          />
        </div>
        <div>
          <label className="block mb-1">Phone</label>
          <input 
            type="text" 
            name="phone" 
            value={customer.phone} 
            onChange={handleChange} 
            className="border p-2 w-full rounded" 
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {id ? "Update" : "Create"} Customer
        </button>
      </form>
    </div>
  );
}

export default CustomerForm;
