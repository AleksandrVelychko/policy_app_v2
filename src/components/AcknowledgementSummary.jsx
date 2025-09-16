import React from "react";
import { policies } from "../mockData";

/**
 * Lightweight summary card for demo purposes.
 * Shows acknowledgement coverage for the latest policy version.
 */
export default function AcknowledgementSummary({ employees }) {
  const latest = policies[policies.length - 1];
  const total = employees.length;
  const acknowledgedCount = employees.filter(e => e.acknowledged.includes(latest.id)).length;
  const pct = total === 0 ? 0 : Math.round((acknowledgedCount / total) * 100);

  return (
    <div className="max-w-xl mx-auto mb-6 bg-white p-4 rounded shadow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-1">Latest Policy Coverage</h2>
          <div className="text-sm text-gray-600">{latest.title} ({latest.version})</div>
          <div className="mt-2 text-sm">
            <span className="font-medium">{acknowledgedCount}</span> of <span className="font-medium">{total}</span> employees acknowledged
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold {pct === 100 ? 'text-green-600' : ''}">{pct}%</div>
          <div className="text-xs text-gray-500">coverage</div>
        </div>
      </div>
      <div className="h-2 bg-gray-200 rounded mt-4 overflow-hidden" aria-label="Acknowledgement progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
        <div className="h-full bg-blue-600 transition-all" style={{ width: pct + '%' }} />
      </div>
      {pct < 100 && (
        <div className="mt-3 text-xs text-amber-600 flex items-center gap-1">
          <span>⚠</span>
          <span>{total - acknowledgedCount} still pending latest acknowledgement.</span>
        </div>
      )}
    </div>
  );
}
