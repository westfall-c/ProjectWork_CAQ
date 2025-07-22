import express from 'express';
import newsRouter from './routes/news/news.js';
import usersRouter from './routes/users/users.js';
import queriesRouter from './routes/queries/queries.js';

const app = express();
const port = 4000;

app.use(express.json());
app.use('/news', newsRouter);
app.use('/users', usersRouter);
app.use('/queries', queriesRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
