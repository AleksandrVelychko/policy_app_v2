import React, { useState, useEffect } from "react";
import PolicyDiff from "./PolicyDiff.jsx";

export default function PolicyViewer({ policies, onAcknowledge, acknowledged }) {
  const [selected, setSelected] = useState(policies.length - 1);
  // Reset selected index if policies array length changes (new version added)
  useEffect(() => {
    setSelected(policies.length - 1);
  }, [policies.length]);
  const current = policies[selected];
  const prev = selected > 0 ? policies[selected - 1] : null;
  const [showRaw, setShowRaw] = useState(false);

  return (
    <div className="max-w-xl mx-auto bg-gray-50 p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-2">{current.title}</h2>
      <div className="mb-2 text-gray-600">Version: {current.version}</div>
      <div className="mb-4 text-gray-800">Changelog: {current.changelog}</div>
      <div className="mb-4">
        {prev && !showRaw ? (
          <PolicyDiff oldText={prev.content} newText={current.content} />
        ) : (
          <div className="bg-white p-4 rounded shadow text-sm whitespace-pre-wrap">{current.content}</div>
        )}
        {prev && (
          <button
            className="mt-2 text-xs underline text-blue-600 hover:text-blue-800"
            onClick={() => setShowRaw(v => !v)}
            type="button"
          >{showRaw ? 'Show Diff vs Previous' : 'Show Raw Current Content'}</button>
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
      <div className="flex items-center gap-4 mt-2">
        <button
        className={`btn mt-2 ${acknowledged.includes(current.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => onAcknowledge(current.id)}
        disabled={acknowledged.includes(current.id)}
        >
          {acknowledged.includes(current.id) ? "Acknowledged" : "Acknowledge"}
        </button>
        {acknowledged.includes(current.id) && (
          <div className="text-xs text-green-700">Already acknowledged • Thank you</div>
        )}
      </div>
    </div>
  );
}