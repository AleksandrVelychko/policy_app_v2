import React from "react";
import { diffWords } from "diff";

export default function PolicyDiff({ oldText, newText }) {
  const diff = diffWords(oldText, newText);
  return (
    <div className="bg-white p-4 rounded shadow text-sm">
      {diff.map((part, idx) => (
        <span
          key={idx}
          className={
            part.added
              ? "bg-green-200 text-green-800 px-1 rounded"
              : part.removed
              ? "bg-red-200 text-red-800 px-1 rounded line-through"
              : ""
          }
        >
          {part.value}
        </span>
      ))}
    </div>
  );
}