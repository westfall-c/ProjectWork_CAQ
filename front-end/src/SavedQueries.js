import React from 'react';

export function SavedQueries(params) {
  
  function onSavedQueryClick(savedQuery) {
    if (params.onQuerySelect) {
      params.onQuerySelect(savedQuery);
    }
  }

  function getQueries() {
    return params.savedQueries.map((item, idx) => {
      const trimTitle = item.queryName.length > 30
        ? item.queryName.substring(0, 30) + "..."
        : item.queryName;

      return (
        <li
          key={idx} 
          onClick={() => onSavedQueryClick(item)} 
          className={item.queryName === params.selectedQueryName ? "selected" : ""}
          style={{ cursor: "pointer" }}
          title={`${item.queryName}: "${item.q}"`} // tooltip for full info
        >
          {`${trimTitle}: "${item.q}"`}
        </li>
      );
    });
  } 

  return (
    <div>
      <ul>
        {params.savedQueries && params.savedQueries.length > 0
          ? getQueries()
          : <li>No Saved Queries, Yet!</li>
        }
      </ul>
    </div>
  );
}
