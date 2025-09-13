import React, { useState } from "react";
import { employees as seedEmployees } from "./mockData";
import PolicyViewer from "./components/PolicyViewer.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";

export default function App() {
  const [employees, setEmployees] = useState(seedEmployees.map(e => ({ ...e, ackTimestamps: {} })));
  const [currentUserId, setCurrentUserId] = useState(seedEmployees[0].id);
  const currentUser = employees.find(e => e.id === currentUserId);

  function handleAcknowledge(policyId) {
    setEmployees(prev => prev.map(emp => {
      if (emp.id !== currentUserId) return emp;
      if (emp.acknowledged.includes(policyId)) return emp;
      return {
        ...emp,
        acknowledged: [...emp.acknowledged, policyId],
        ackTimestamps: { ...emp.ackTimestamps, [policyId]: new Date().toISOString() }
      };
    }));
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <h1 className="text-3xl font-bold text-center mb-4">Expense Policy Version History</h1>
      <div className="max-w-xl mx-auto mb-6 bg-white p-4 rounded shadow flex items-center gap-4">
        <label className="font-medium" htmlFor="userSel">Viewing as:</label>
        <select
          id="userSel"
          className="border rounded px-2 py-1"
          value={currentUserId}
          onChange={e => setCurrentUserId(Number(e.target.value))}
        >
          {employees.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <div className="text-sm text-gray-500">Acknowledge as selected user</div>
      </div>
      <PolicyViewer onAcknowledge={handleAcknowledge} acknowledged={currentUser.acknowledged} />
      <AdminDashboard employees={employees} />
    </div>
  );
}
