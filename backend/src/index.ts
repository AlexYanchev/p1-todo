import express, { NextFunction, Response, Request } from 'express';
import userRouter from './routes/userRoutes.js';
import taskRouter from './routes/taskRoutes.js';
import stepRouter from './routes/stepRoutes.js';
import cors from 'cors';
import connectDB from './db/index.js';
import Models from './db/schemas/index.js';
import { validateToken } from './utils/index.js';
import { resError, responseErrorData } from './helpers/response/resError.js';
import helmet from 'helmet';

connectDB()
  .then(() => {
    console.log('База данных подключена');
    //Регистрируем модели
    Models;
  })
  .catch((err) => console.log(err));

const app = express();
const port = 3001;

app.use(helmet());
app.use(
  cors({
    origin: ['http://localhost:3000'],
  })
);

app.use(express.json());

app.use(userRouter, validateToken, taskRouter, stepRouter);

app.use(function (req, res, next) {
  res.status(404);
  res.type('txt').send('Not found');
  return;
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  resError(res, responseErrorData.badRequest, { invalidToken: true });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
