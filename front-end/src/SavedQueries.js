import React from 'react';

export function SavedQueries({ savedQueries, selectedQueryName, onQuerySelect, currentUser, onReset }) {
  function onSavedQueryClick(savedQuery) {
    if (onQuerySelect) {
      onQuerySelect(savedQuery);
    }
  }

  function getQueries() {
    return savedQueries.map((item, idx) => {
      const trimTitle = item.queryName.length > 30
        ? item.queryName.substring(0, 30) + "..."
        : item.queryName;

      return (
        <li
          key={idx}
          onClick={() => onSavedQueryClick(item)}
          className={item.queryName === selectedQueryName ? "selected" : ""}
          title={`${item.queryName}: "${item.q}"`}
          style={{
            cursor: "pointer",
            marginBottom: "8px",
            fontWeight: item.queryName === selectedQueryName ? "bold" : "normal",
            color: currentUser ? "#333" : "#777"
          }}
        >
          {`${trimTitle}: "${item.q}"`}
        </li>
      );
    });
  }

  return (
    <div>
      {/* Section title */}
      <div style={{ marginBottom: "10px", fontWeight: "bold", fontSize: "1rem" }}>
        {currentUser ? "Your Saved Queries" : "Default Preset Queries"}
      </div>

      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {savedQueries && savedQueries.length > 0
          ? getQueries()
          : <li style={{ color: "#999" }}>No Saved Queries, Yet!</li>
        }
      </ul>

      {/* ✅ Reset Button for Admins Only */}
      {currentUser?.user === "admin" && (
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to reset all saved queries?")) {
              onReset();
            }
          }}
          style={{
            marginTop: "12px",
            padding: "6px 12px",
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Reset Saved Queries
        </button>
      )}
    </div>
  );
}
