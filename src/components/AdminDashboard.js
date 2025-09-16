import React, { useState, useMemo } from "react";

export default function AdminDashboard({ employees, policies, latestPolicyId, recentPolicyId, onDeletePolicy }) {
  const [showMissingOnly, setShowMissingOnly] = useState(false);
  const latest = latestPolicyId || policies[policies.length - 1].id;

  const filteredEmployees = useMemo(() => {
    if (!showMissingOnly) return employees;
    return employees.filter(e => !e.acknowledged.includes(latest));
  }, [employees, showMissingOnly, latest]);

  const coverage = useMemo(() => {
    const total = employees.length;
    const ack = employees.filter(e => e.acknowledged.includes(latest)).length;
    return { total, ack, pct: total === 0 ? 0 : Math.round((ack / total) * 100) };
  }, [employees, latest]);
  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow mt-8">
      <div className="flex items-start justify-between gap-4 mb-2">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Admin Dashboard{" "}
          <span className="text-sm font-normal text-gray-500">
            (Acknowledgements)
          </span>
        </h2>
        <div className="text-xs text-gray-600">Latest coverage: <span className={coverage.pct === 100 ? 'text-green-600 font-semibold' : 'font-semibold'}>{coverage.pct}%</span></div>
      </div>
      <div className="flex items-center gap-4 mb-4 text-sm">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={showMissingOnly} onChange={e => setShowMissingOnly(e.target.checked)} />
          Show only missing latest
        </label>
        <div className="text-gray-500">Latest policy: {policies.find(p => p.id === latest)?.title}</div>
      </div>
      <div className="overflow-x-auto">
        <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" /> Latest &nbsp;|&nbsp; <span className="inline-block w-2 h-2 bg-green-500 rounded-full" /> Recent
        </div>
        <table className="w-full text-left border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-b p-2 font-medium">Employee</th>
              {policies.map(p => {
                const isLatest = p.id === latest;
                const isRecent = p.id === recentPolicyId;
                return (
                  <th
                    key={p.id}
                    className={`border-b p-2 font-medium whitespace-nowrap ${isLatest ? 'bg-blue-50' : ''} ${isRecent ? 'ring-1 ring-green-400' : ''}`}
                    title={isLatest ? 'Latest policy version' : isRecent ? 'Recently added' : undefined}
                  >
                    <div className="flex items-center gap-1">
                      <span>{p.title}</span>
                      {isLatest && <span className="text-blue-600" aria-label="Latest">★</span>}
                      {isRecent && !isLatest && <span className="text-green-600" aria-label="New">●</span>}
                      {onDeletePolicy && policies.length > 1 && (
                        <button
                          onClick={() => onDeletePolicy(p.id)}
                          className="ml-1 text-[10px] px-1 py-0.5 rounded bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 focus:outline-none"
                          title="Delete policy"
                          type="button"
                        >Del</button>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(emp => (
              <tr key={emp.id} className="even:bg-gray-50">
                <td className="border-b p-2 font-medium whitespace-nowrap">
                  {emp.name}
                </td>
                {policies.map(p => {
                  const ts = emp.ackTimestamps?.[p.id];
                  return (
                    <td key={p.id} className="border-b p-2 text-center">
                      {emp.acknowledged.includes(p.id) ? (
                        <span
                          title={ts ? `Acknowledged: ${new Date(ts).toLocaleString()}` : 'Acknowledged'}
                          className="inline-flex items-center justify-center text-green-600"
                        >
                          ✔
                        </span>
                      ) : (
                        <span className={`text-gray-300 ${p.id === latest ? 'text-red-400' : ''}`}>{p.id === latest ? '✖' : '—'}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
