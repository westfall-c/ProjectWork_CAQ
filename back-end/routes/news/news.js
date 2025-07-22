import express from 'express';
const router = express.Router();

const apiKey =  "610054cb61df401aa03d8ffdc65a094a";
if (!apiKey) {
  console.log("Please set the API_KEY environment variable with a valid newsapi.org apiKey and restart the server!");
  process.exit(0);
}

const baseUrlTop = 'https://newsapi.org/v2/top-headlines';

function addApiKey(queryObject) {
  return { ...queryObject, apiKey: apiKey };
}

function createUrlFromQueryObject(queryObjectWithApiKey) {
  const queryString = new URLSearchParams(queryObjectWithApiKey).toString();
  const url = baseUrlTop + "?" + queryString;
  return url;
}

async function fetchData(url) {
  let data = null;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

// GET /news (test)
router.get('/', async (req, res) => {
  const fixedQueryObject = {
    country: "us",
    q: "news"
  };
  const queryObject = addApiKey(fixedQueryObject);
  const url = createUrlFromQueryObject(queryObject);
  const newsArticles = await fetchData(url);
  res.send(newsArticles);
});

// POST /news
router.post('/', async (req, res) => {
  const query = req.body;
  const queryObjectWithApiKey = addApiKey(query);
  const url = createUrlFromQueryObject(queryObjectWithApiKey);
  const newsArticles = await fetchData(url);
  res.send(newsArticles);
});

export default router;
