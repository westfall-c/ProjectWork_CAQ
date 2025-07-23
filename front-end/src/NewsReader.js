import { SavedQueries } from './SavedQueries';
import { QueryForm } from './QueryForm';
import { Articles } from './Articles';
import { useState, useEffect } from 'react';
import { exampleQuery, exampleData } from './data';

export function NewsReader() {
  const [query, setQuery] = useState(exampleQuery);
  const [data, setData] = useState(exampleData);
  const [queryFormObject, setQueryFormObject] = useState({ ...exampleQuery });
  const [savedQueries, setSavedQueries] = useState([]);
  const [queriesLoaded, setQueriesLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  const urlNews = "/news";
  const urlQueries = "/queries";
  const defaultQueries = [
    { queryName: "Top News", q: "news", language: "en", pageSize: 5 },
    { queryName: "Technology", q: "technology", language: "en", pageSize: 5 },
    { queryName: "Sports", q: "sports", language: "en", pageSize: 5 }
  ];

  useEffect(() => {
    getNews(query);
  }, [query]);

  useEffect(() => {
    async function loadQueries() {
      await getQueryList();
      setQueriesLoaded(true);
    }
    loadQueries();
  }, []);

  async function getQueryList() {
    try {
      const response = await fetch(urlQueries);
      if (response.ok) {
        const data = await response.json();
        setSavedQueries(data);
      }
    } catch (error) {
      console.error('Error fetching saved queries:', error);
    }
  }

  async function saveQueryList(savedQueries) {
    try {
      const response = await fetch(urlQueries, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(savedQueries),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error saving queries:', error);
    }
  }

  function onSavedQuerySelect(selectedQuery) {
    setQueryFormObject(selectedQuery);
    setQuery(selectedQuery);
  }

  async function onFormSubmit(queryObject) {
    if (!queriesLoaded) {
      alert("Queries are still loading, please wait.");
      return;
    }
    let newSavedQueries = [queryObject];
    for (let query of savedQueries) {
      if (query.queryName !== queryObject.queryName) {
        newSavedQueries.push(query);
      }
    }
    try {
      await saveQueryList(newSavedQueries);
      setSavedQueries(newSavedQueries);
      setQuery(queryObject);
    } catch (err) {
      console.error('Failed to save queries:', err);
    }
  }

  function resetSavedQueries() {
    const clearedList = [exampleQuery];
    saveQueryList(clearedList);
    setSavedQueries(clearedList);
    setQuery(clearedList[0] || {});
    setToastMsg("Saved queries have been reset.");
    setTimeout(() => setToastMsg(""), 3000);
  }

  async function getNews(queryObject) {
    if (!queryObject.q) {
      setData({});
      return;
    }
    try {
      const response = await fetch(urlNews, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(queryObject),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setData({});
    }
  }

  const labelMap = {
    queryName: "Query Name",
    q: "Search Term",
    language: "Language",
    pageSize: "Page Size",
  };

  return (
    <div>
      <div>
        {/* ✅ Logo + Title Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          padding: "15px 20px",
          backgroundColor: "#f9f9f9",
          borderBottom: "2px solid #ccc"
        }}>
          <img
            src="/CAQ.png"
            alt="Commit & Quit Logo"
            style={{
              height: "100px",
              width: "100px",
              objectFit: "contain",
              marginRight: "15px"
            }}
          />
          <h1 style={{
            margin: 0,
            fontSize: "1.7rem",
            fontFamily: "Segoe UI, sans-serif",
            color: "#333"
          }}>
            News Reader
          </h1>
        </div>
        {/* Login Controls */}
        <div style={{
          padding: "15px 20px",
          backgroundColor: "#f0f0f0",
          borderBottom: "1px solid #ccc"
        }}>
          <span style={{ marginRight: "15px", fontWeight: "bold" }}>
            {currentUser ? `Logged in as: ${currentUser.user}` : "Not logged in"}
          </span>
          {!currentUser ? (
            <>
              <button
                onClick={() => setCurrentUser({ user: "guest", password: "guest" })}
                style={{ marginRight: "10px" }}
              >
                Log in as Guest
              </button>
              <button
                onClick={() => setCurrentUser({ user: "admin", password: "admin" })}
              >
                Log in as Admin
              </button>
            </>
          ) : (
            <button onClick={() => setCurrentUser(null)}>Log Out</button>
          )}
        </div>
        {/* Toast Message */}
        {toastMsg && (
          <div style={{
            background: "#dff0d8",
            color: "#3c763d",
            padding: "10px",
            margin: "10px 20px",
            borderRadius: "4px"
          }}>
            {toastMsg}
          </div>
        )}
        <section className="parent">
          {/* Query Form */}
          {currentUser && (
            <div className="box fade-in">
              <span className='title'>Query Form</span>
              <QueryForm
                setFormObject={setQueryFormObject}
                formObject={queryFormObject}
                submitToParent={onFormSubmit}
                currentUser={currentUser}
              />
            </div>
          )}
          {/* Saved Queries */}
          <div className="box fade-in">
            <span className='title'>Saved Queries</span>
            {!currentUser && (
              <div style={{
                fontSize: "0.9rem",
                color: "#555",
                marginBottom: "10px"
              }}>
                You are not logged in. You can still run preset queries, but must log in to create your own.
              </div>
            )}
            <SavedQueries
              savedQueries={currentUser ? savedQueries : defaultQueries}
              selectedQueryName={query.queryName}
              onQuerySelect={onSavedQuerySelect}
              currentUser={currentUser}
              onReset={resetSavedQueries}
            />
          </div>
          {/* Articles */}
          <div className="box fade-in">
            <span className='title'>Articles List</span>
            <Articles query={query} data={data} />
          </div>
          {/* Query Details */}
          {query && (
            <div className="box fade-in">
              <span className='title'>Query Details</span>
              <ul style={{
                listStyle: "none",
                paddingLeft: 0,
                fontSize: "0.95rem",
                lineHeight: "1.4"
              }}>
                {Object.entries(query).map(([key, value]) => (
                  <li key={key}>
                    <strong>{labelMap[key] || key}:</strong> {value?.toString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}