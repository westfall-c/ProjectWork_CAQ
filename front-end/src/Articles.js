export function Articles(params) {
  const articles = params.data.articles || [];
  const articleCount = params.data.totalResults || 0;
  const query = params.query || {};
  const queryName = query.queryName || "na";

  return (
    <div>
      {/* Query Detail Block */}
      <div style={{ marginBottom: "10px", fontSize: "0.95rem", lineHeight: "1.4" }}>
        <strong>Query Name:</strong> {queryName}<br />
        <strong>Search Term (q):</strong> {query.q || "n/a"}<br />
        <strong>Language:</strong> {query.language || "n/a"}<br />
        <strong>Page Size:</strong> {query.pageSize || "n/a"}<br />
        <strong>Total Results:</strong> {articleCount}
      </div>

      {/* Scrollable Articles List */}
      <div className="article-scroll-container">
        <ol className="article-list">
          {articles.map((item, idx) => {
            if (!item) return <li key={idx}>No Item</li>;
            if (!item.title) return <li key={idx}>No Title</li>;
            if (item.title === "[Removed]") return <li key={idx}>Was Removed</li>;

            return (
              <li key={idx} className="article-item">
                {item.title}{" "}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="article-link"
                >
                  Link
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
