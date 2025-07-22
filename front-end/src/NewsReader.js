import { SavedQueries } from './SavedQueries';
import { QueryForm } from './QueryForm';
import { Articles } from './Articles';
import { useState, useEffect } from 'react';
import { exampleQuery, exampleData } from './data';

export function NewsReader() {
  const [query, setQuery] = useState(exampleQuery); // latest query sent to newsapi
  const [data, setData] = useState(exampleData);   // current data returned from newsapi
  const [queryFormObject, setQueryFormObject] = useState({ ...exampleQuery });

  // SavedQueries state variable, start empty because we load from backend
  const [savedQueries, setSavedQueries] = useState([]);
  const [queriesLoaded, setQueriesLoaded] = useState(false); // loading flag

  // Backend endpoints
  const urlNews = "/news";
  const urlQueries = "/queries";

  useEffect(() => {
    getNews(query);
  }, [query]);

  // Fetch saved queries on mount
  useEffect(() => {
    async function loadQueries() {
      await getQueryList();
      setQueriesLoaded(true);
    }
    loadQueries();
  }, []);

  // Fetch saved queries from backend
  async function getQueryList() {
    try {
      const response = await fetch(urlQueries);
      if (response.ok) {
        const data = await response.json();
        console.log("savedQueries has been retrieved: ", data);
        setSavedQueries(data);
      }
    } catch (error) {
      console.error('Error fetching saved queries:', error);
    }
  }

  // Save updated queries list to backend
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
      console.log("savedQueries array has been persisted");
    } catch (error) {
      console.error('Error saving queries:', error);
    }
  }

  // Handler for selecting a saved query
  function onSavedQuerySelect(selectedQuery) {
    setQueryFormObject(selectedQuery);
    setQuery(selectedQuery);
  }

  // onFormSubmit async to await saveQueryList and avoid race conditions
  async function onFormSubmit(queryObject) {
    if (!queriesLoaded) {
      alert("Queries are still loading, please wait.");
      return;
    }

    // Build new saved queries list, avoiding duplicates by queryName
    let newSavedQueries = [];
    newSavedQueries.push(queryObject);
    for (let query of savedQueries) {
      if (query.queryName !== queryObject.queryName) {
        newSavedQueries.push(query);
      }
    }
    console.log("Saving queries: ", JSON.stringify(newSavedQueries));

    try {
      await saveQueryList(newSavedQueries);
      setSavedQueries(newSavedQueries);
      setQuery(queryObject);
    } catch (err) {
      console.error('Failed to save queries:', err);
    }
  }

  async function getNews(queryObject) {
    if (queryObject.q) {
      setData(exampleData);
    } else {
      setData({});
    }
  }

  return (
    <div>
      <div>
        <section className="parent">
          <div className="box">
            <span className='title'>Query Form</span>
            <QueryForm
              setFormObject={setQueryFormObject}
              formObject={queryFormObject}
              submitToParent={onFormSubmit}
            />
          </div>

          <div className="box">
            <span className='title'>Saved Queries</span>
            <SavedQueries
              savedQueries={savedQueries}
              selectedQueryName={query.queryName}
              onQuerySelect={onSavedQuerySelect}
            />
          </div>

          <div className="box">
            <span className='title'>Articles List</span>
            <Articles query={query} data={data} />
          </div>
        </section>
      </div>
    </div>
  );
}
