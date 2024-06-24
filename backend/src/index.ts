import express, { NextFunction, Response, Request } from 'express';
import userRouter from './routes/userRoutes.js';
import taskRouter from './routes/taskRoutes.js';
import stepRouter from './routes/stepRoutes.js';
import cors from 'cors';
import connectDB from './db/index.js';
import Models from './db/schemas/index.js';
import { validateToken } from './utils/index.js';
import { tokenizer } from './db/utils/index.js';

connectDB()
  .then(() => {
    console.log('База данных подключена');
    //Регистрируем модели
    Models;
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
app.use(
  express.raw({
    type: ['application/octet-stream', 'image/png', 'image/jpeg'],
    limit: '2mb',
  })
);
app.use(userRouter, validateToken, taskRouter, stepRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.status(401).json({
    invalidToken: true,
    error: true,
    message: err,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
