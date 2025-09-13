import React, { useState } from "react";
import { policies } from "../mockData";
import PolicyDiff from "./PolicyDiff";

export default function PolicyViewer({ onAcknowledge, acknowledged }) {
  const [selected, setSelected] = useState(policies.length - 1);
  const current = policies[selected];
  const prev = selected > 0 ? policies[selected - 1] : null;

  return (
    <div className="max-w-xl mx-auto bg-gray-50 p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-2">{current.title}</h2>
      <div className="mb-2 text-gray-600">Version: {current.version}</div>
      <div className="mb-4 text-gray-800">Changelog: {current.changelog}</div>
      <div className="mb-4">
        {prev ? (
          <PolicyDiff oldText={prev.content} newText={current.content} />
        ) : (
          <div className="bg-white p-4 rounded shadow text-sm">{current.content}</div>
        )}
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Switch Version:</label>
        <select
          className="border rounded px-2 py-1"
          value={selected}
          onChange={e => setSelected(Number(e.target.value))}
        >
          {policies.map((p, idx) => (
            <option key={p.id} value={idx}>
              {p.title} ({p.version})
            </option>
          ))}
        </select>
      </div>
      <button
        className={`mt-2 px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition ${acknowledged.includes(current.id) ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => onAcknowledge(current.id)}
        disabled={acknowledged.includes(current.id)}
      >
        {acknowledged.includes(current.id) ? "Acknowledged" : "Acknowledge"}
      </button>
    </div>
  );
}
