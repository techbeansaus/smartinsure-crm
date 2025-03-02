import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import CustomerForm from './components/CustomerForm';
import CustomerList from './components/CustomerList';
import Header from './components/Header';
import PolicyForm from './components/PolicyForm';
import PolicyList from './components/PolicyList';
import TaskList from './components/TaskList';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<CustomerList />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/add" element={<CustomerForm />} />
          <Route path="/customers/edit/:id" element={<CustomerForm />} />
          <Route path="/customers/:customerId/policies" element={<PolicyList />} />
          <Route path="/policies/add" element={<PolicyForm />} />
          <Route path="/policies/edit/:id" element={<PolicyForm />} />
          <Route path="/customers/:customerId/tasks" element={<TaskList />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
