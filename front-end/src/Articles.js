export function Articles(params) {
  const articles = params.data.articles || [];
  const articleCount = params.data.totalResults || 0;
  const query = params.query || {};
  const queryName = query.queryName || "na";

  // ✅ Only include valid articles
  const validArticles = articles.filter(
    item => item && item.title && item.title !== "[Removed]"
  );

  return (
    <div>
      {/* Query Detail Block */}
      <div style={{ marginBottom: "10px", fontSize: "0.95rem", lineHeight: "1.4" }}>
        <strong>Query Name:</strong> {queryName}<br />
        <strong>Search Term (q):</strong> {query.q || "n/a"}<br />
        <strong>Language:</strong> {query.language || "n/a"}<br />
        <strong>Page Size:</strong> {query.pageSize || "n/a"}<br />
        <strong>Total Results:</strong> {articleCount}<br />
        <strong>Displayed:</strong> {validArticles.length}
      </div>

      {/* Scrollable Articles List */}
      <div className="article-scroll-container">
        <ol className="article-list">
          {validArticles.map((item, idx) => (
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
          ))}
        </ol>
      </div>
    </div>
  );
}
