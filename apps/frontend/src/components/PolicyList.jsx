// src/components/PolicyList.js
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function PolicyList() {
  const { customerId } = useParams();
  const [policies, setPolicies] = useState([]);

  const fetchPolicies = async () => {
    const res = await fetch(`http://localhost:5001/api/policies?customerId=${customerId}`);
    const data = await res.json();
    setPolicies(data);
  };

  useEffect(() => {
    fetchPolicies();
  }, [customerId]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Policies for Customer {customerId}</h1>
      <Link 
        to={`/policies/add?customerId=${customerId}`} 
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Add Policy
      </Link>
      <table className="min-w-full bg-white mt-4">
        <thead>
          <tr>
            <th className="py-2">Policy Number</th>
            <th className="py-2">Start Date</th>
            <th className="py-2">Expiry Date</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {policies.map(policy => (
            <tr key={policy._id} className="border-t">
              <td className="py-2">{policy.policyNumber}</td>
              <td className="py-2">{new Date(policy.startDate).toLocaleDateString()}</td>
              <td className="py-2">{new Date(policy.expiryDate).toLocaleDateString()}</td>
              <td className="py-2">
                <Link to={`/policies/edit/${policy._id}`} className="text-blue-500">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PolicyList;
