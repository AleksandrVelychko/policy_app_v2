import React, { useState, useMemo } from "react";
import { policies as seedPolicies } from "../mockData"; // fallback if parent doesn't pass latest (demo resilience)
import PolicyDiff from "./PolicyDiff.jsx";

/** Add a new policy version (demo form)
 * Enhancements:
 * - Previous version preview (collapsible)
 * - Quick copy of previous content
 * - Inline diff view while editing (optional toggle)
 */
export default function AddPolicyVersion({ onAdd, lastVersionDate, previousPolicy }) {
  const [title, setTitle] = useState("");
  const [versionDate, setVersionDate] = useState("");
  const [changelog, setChangelog] = useState("");
  const [content, setContent] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState(null);
  const [showPrev, setShowPrev] = useState(false);
  const [showLiveDiff, setShowLiveDiff] = useState(false);

  // Determine previous policy (prefer prop, else derive from seeds)
  const prevPolicy = previousPolicy || seedPolicies[seedPolicies.length - 1];

  const diffPreview = useMemo(() => {
    if (!showLiveDiff || !prevPolicy || !content) return null;
    return <PolicyDiff oldText={prevPolicy.content} newText={content} />;
  }, [showLiveDiff, prevPolicy, content]);

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!title || !versionDate || !content) {
      setError("Title, version date and content are required.");
      return;
    }
    if (lastVersionDate && versionDate <= lastVersionDate) {
      setError("Version date must be greater than last published version date.");
      return;
    }
    onAdd({ title, version: versionDate, changelog: changelog || reason || "Updated policy", content, reason });
    setTitle("");
    setVersionDate("");
    setChangelog("");
    setContent("");
    setReason("");
    setShowLiveDiff(false);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-bold">Publish New Policy Version</h2>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div>
        <label className="block text-sm font-medium mb-1">Version Date (ISO)</label>
        <input type="date" className="w-full border rounded px-2 py-1" value={versionDate} onChange={e => setVersionDate(e.target.value)} />
        {lastVersionDate && <div className="text-xs text-gray-500 mt-1">Last version date: {lastVersionDate}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input className="w-full border rounded px-2 py-1" value={title} onChange={e => setTitle(e.target.value)} placeholder="Expense Policy v4" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Reason / Business Justification</label>
        <textarea className="w-full border rounded px-2 py-1" value={reason} onChange={e => setReason(e.target.value)} placeholder="Increased travel cap due to higher airfare costs" rows={2} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Changelog (succinct)</label>
        <input className="w-full border rounded px-2 py-1" value={changelog} onChange={e => setChangelog(e.target.value)} placeholder="Added training; raised limit to $1200" />
      </div>
      <div className="space-y-1">
        <label className="block text-sm font-medium mb-1">Content (Full Policy Text)</label>
        <div className="flex items-center gap-2 text-xs mb-1">
          <button type="button" className="btn-subtle px-2 py-1" onClick={() => setShowPrev(p => !p)}>
            {showPrev ? 'Hide Previous Version' : 'Show Previous Version'}
          </button>
          <button
            type="button"
            className="btn-subtle px-2 py-1"
            onClick={() => setContent(prevPolicy ? prevPolicy.content : content)}
            disabled={!prevPolicy}
          >
            Copy Previous Content
          </button>
          <label className="inline-flex items-center gap-1 cursor-pointer">
            <input type="checkbox" checked={showLiveDiff} onChange={e => setShowLiveDiff(e.target.checked)} />
            Live Diff
          </label>
        </div>
        <textarea className="w-full border rounded px-2 py-1 font-mono text-sm" rows={showLiveDiff ? 8 : 6} value={content} onChange={e => setContent(e.target.value)} placeholder="Allowed categories: ..." />
        {showPrev && prevPolicy && (
          <div className="mt-2 bg-gray-50 border rounded p-3 text-xs space-y-1 max-h-56 overflow-auto">
            <div className="font-semibold flex items-center justify-between">
              <span>Previous: {prevPolicy.title} ({prevPolicy.version})</span>
              <span className="text-gray-500">Read-only</span>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-[11px] leading-snug">{prevPolicy.content}</pre>
          </div>
        )}
        {diffPreview && (
          <div className="mt-3 border rounded p-3 bg-white text-xs" aria-label="Live diff preview">
            <div className="font-semibold mb-2">Live Diff vs Previous</div>
            {diffPreview}
          </div>
        )}
      </div>
      <div className="pt-2 flex justify-end">
        <button type="submit" className="btn">Publish Version</button>
      </div>
    </form>
  );
}
