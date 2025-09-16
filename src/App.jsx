import React, { useState, useEffect, useRef } from "react";
import { employees as seedEmployees, policies as seedPolicies } from "./mockData";
import PolicyViewer from "./components/PolicyViewer.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import AcknowledgementSummary from "./components/AcknowledgementSummary.jsx";
import AddPolicyVersion from "./components/AddPolicyVersion.jsx";

export default function App() {
  // Local storage key (versioned for future schema changes)
  const EMP_STORAGE_KEY = 'policyAppEmployeesV1';
  const POL_STORAGE_KEY = 'policyAppPoliciesV1';
  const [employees, setEmployees] = useState(() => seedEmployees.map(e => ({
    ...e,
    // Backfill timestamps for already acknowledged policies using policy version date start (simplistic demo heuristic)
    ackTimestamps: (e.acknowledged || []).reduce((acc, pid) => { acc[pid] = acc[pid] || new Date().toISOString(); return acc; }, {})
  })));
  const [policies, setPolicies] = useState(seedPolicies);
  const [currentUserId, setCurrentUserId] = useState(seedEmployees[0].id);
  const [filterMissingLatest, setFilterMissingLatest] = useState(false);
  const hydratedRef = useRef(false);
  const latestPolicy = policies[policies.length - 1];
  const currentUser = employees.find(e => e.id === currentUserId);

  // Hydrate from localStorage once
  useEffect(() => {
    try {
      const rawEmp = localStorage.getItem(EMP_STORAGE_KEY);
      if (rawEmp) {
        const parsed = JSON.parse(rawEmp);
        if (Array.isArray(parsed)) {
          const normalized = parsed.map(emp => ({ ...emp, ackTimestamps: emp.ackTimestamps || {} }));
          setEmployees(normalized);
        }
      }
      const rawPol = localStorage.getItem(POL_STORAGE_KEY);
      if (rawPol) {
        const parsedPol = JSON.parse(rawPol);
        if (Array.isArray(parsedPol) && parsedPol.length >= seedPolicies.length) {
          setPolicies(parsedPol);
        }
      }
    } catch (e) {
      console.warn('Failed to load saved state', e);
    } finally {
      hydratedRef.current = true;
    }
  }, []);

  // Persist whenever employees change (after initial hydration)
  useEffect(() => {
    if (!hydratedRef.current) return;
    try { localStorage.setItem(EMP_STORAGE_KEY, JSON.stringify(employees)); } catch (e) { console.warn('Persist employees failed', e);}  
  }, [employees]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    try { localStorage.setItem(POL_STORAGE_KEY, JSON.stringify(policies)); } catch (e) { console.warn('Persist policies failed', e);}  
  }, [policies]);

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

  const [toast, setToast] = useState(null); // shape: {message, actionLabel?, onAction?}
  const [recentPolicyId, setRecentPolicyId] = useState(null);
  const [lastDeletionSnapshot, setLastDeletionSnapshot] = useState(null); // { policy, employeeSnapshot: [{id, hadAck, ts}] }

  function handleAddPolicyVersion(newData) {
    setPolicies(prev => {
      const nextId = Math.max(...prev.map(p => p.id)) + 1;
      const next = [...prev, { id: nextId, ...newData }];
      const sorted = next.sort((a, b) => new Date(a.version) - new Date(b.version));
      setRecentPolicyId(nextId);
      setToast({ message: `Published policy version: ${newData.title}` });
      setTimeout(() => setToast(null), 4000);
      return sorted;
    });
  }

  function handleDeletePolicy(policyId) {
    if (policies.length <= 1) {
      setToast({ message: 'Cannot delete the only remaining policy' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    const target = policies.find(p => p.id === policyId);
    if (!target) return;
    if (!confirm(`Delete policy "${target.title}"? This removes acknowledgement references.`)) return;
    // Snapshot before deletion for undo
    const employeeSnapshot = employees.map(emp => ({
      id: emp.id,
      hadAck: emp.acknowledged.includes(policyId),
      ts: emp.ackTimestamps?.[policyId]
    }));
    const snapshot = { policy: target, employeeSnapshot };
    setLastDeletionSnapshot(snapshot);
    // Remove policy
    setPolicies(prev => prev.filter(p => p.id !== policyId).sort((a,b)=> new Date(a.version)-new Date(b.version)));
    // Clean employees
    setEmployees(prev => prev.map(emp => ({
      ...emp,
      acknowledged: emp.acknowledged.filter(id => id !== policyId),
      ackTimestamps: Object.fromEntries(Object.entries(emp.ackTimestamps || {}).filter(([k]) => Number(k) !== policyId))
    })));
    if (recentPolicyId === policyId) setRecentPolicyId(null);
    setToast({
      message: `Deleted policy: ${target.title}`,
      actionLabel: 'Undo',
      onAction: () => undoDeletion(snapshot)
    });
    setTimeout(() => setToast(null), 7000);
  }
  function undoDeletion(snapshot) {
    if (!snapshot) return;
    const { policy, employeeSnapshot } = snapshot;
    // Avoid duplicate restore if policy id already present
    setPolicies(prev => {
      if (prev.some(p => p.id === policy.id)) return prev; // already restored
      const next = [...prev, policy].sort((a,b)=> new Date(a.version)-new Date(b.version));
      return next;
    });
    setEmployees(prev => prev.map(emp => {
      const snap = employeeSnapshot.find(s => s.id === emp.id);
      if (!snap || !snap.hadAck) return emp;
      if (emp.acknowledged.includes(policy.id)) return emp;
      return {
        ...emp,
        acknowledged: [...emp.acknowledged, policy.id],
        ackTimestamps: { ...emp.ackTimestamps, [policy.id]: snap.ts || new Date().toISOString() }
      };
    }));
    setRecentPolicyId(policy.id); // highlight restored
    setToast({ message: `Restored policy: ${policy.title}` });
    setTimeout(() => setToast(null), 4000);
    setLastDeletionSnapshot(null);
  }

  function handleResetData() {
    if (!confirm('Reset demo data? This clears local storage.')) return;
    localStorage.removeItem(EMP_STORAGE_KEY);
    localStorage.removeItem(POL_STORAGE_KEY);
    window.location.reload();
  }

  const [activeTab, setActiveTab] = useState('view');

  // Fade out recent highlight after a short period
  useEffect(() => {
    if (!recentPolicyId) return;
    const t = setTimeout(() => setRecentPolicyId(null), 8000);
    return () => clearTimeout(t);
  }, [recentPolicyId]);

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
      <div className="max-w-5xl mx-auto mb-6">
        <div className="flex justify-center mb-4">
          <div className="inline-flex gap-1 bg-white p-1 rounded shadow-sm border">
            {['view','dashboard','add'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`btn-tab ${activeTab === tab ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {tab === 'view' ? 'Policy Viewer' : tab === 'dashboard' ? 'Admin Dashboard' : 'Add Version'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end mb-2 gap-2 text-xs pr-1">
          <button onClick={handleResetData} className="btn-subtle px-3 py-1 text-xs">Reset Demo Data</button>
        </div>
        {toast && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow text-sm z-50 flex items-center gap-3" role="status">
            <span>{toast.message || (typeof toast === 'string' ? toast : '')}</span>
            {toast.actionLabel && toast.onAction && (
              <button
                onClick={() => { toast.onAction(); }}
                className="bg-white/20 hover:bg-white/30 transition px-2 py-1 rounded text-xs font-semibold"
              >{toast.actionLabel}</button>
            )}
          </div>
        )}
        {activeTab === 'view' && (
          <>
            <AcknowledgementSummary employees={employees} />
            <PolicyViewer policies={policies} onAcknowledge={handleAcknowledge} acknowledged={currentUser.acknowledged} />
          </>
        )}
        {activeTab === 'dashboard' && (
          <AdminDashboard
            employees={employees}
            policies={policies}
            latestPolicyId={latestPolicy.id}
            recentPolicyId={recentPolicyId}
            onDeletePolicy={handleDeletePolicy}
          />
        )}
        {activeTab === 'add' && (
          <AddPolicyVersion
            onAdd={handleAddPolicyVersion}
            lastVersionDate={latestPolicy.version}
            previousPolicy={latestPolicy}
          />
        )}
      </div>
    </div>
  );
}
