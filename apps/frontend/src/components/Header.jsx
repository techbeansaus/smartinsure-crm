// src/components/Header.js
import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-xl">Smart Insure CRM</Link>
        <div className="space-x-4">
          <Link to="/customers" className="text-white">Customers</Link>
          <Link to="/customers/add" className="text-white">Add Customer</Link>
        </div>
      </div>
    </nav>
  );
}

export default Header;
