import React from "react";
import { policies } from "../mockData";

export default function AdminDashboard({ employees }) {
  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        Admin Dashboard{" "}
        <span className="text-sm font-normal text-gray-500">
          (Acknowledgements)
        </span>
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-b p-2 font-medium">Employee</th>
              {policies.map((p) => (
                <th
                  key={p.id}
                  className="border-b p-2 font-medium whitespace-nowrap"
                >
                  {p.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="even:bg-gray-50">
                <td className="border-b p-2 font-medium whitespace-nowrap">
                  {emp.name}
                </td>
                {policies.map((p) => {
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
                        <span className="text-gray-300">—</span>
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
