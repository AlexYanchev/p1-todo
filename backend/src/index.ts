import express from 'express';
import userRouter from './routes/userRoutes.js';
import cors from 'cors';
import connectDB from './db/index.js';

connectDB()
  .then(() => {
    console.log('База данных подключена');
  })
  .catch((err) => console.log(err));

const app = express();
const port = 3001;

app.use(
  cors({
    origin: ['http://localhost:3000'],
  })
);
app.use(express.json());
app.use(userRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
