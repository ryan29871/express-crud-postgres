import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';

import routes from './routes/index.routes';

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/goals', routes.goals);
app.use('/', routes.root);

app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});

module.exports = app.listen(process.env.PORT, () => {
  console.log(`Server is now running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode!`);
});