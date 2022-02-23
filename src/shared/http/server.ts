import 'reflect-metadata';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import routes from './routes';
import AppError from '@shared/errors/AppError';
import '@shared/typeorm';
import { errors } from 'celebrate';
import morgan from 'morgan';
import upload from '@config/upload';
import { pagination } from 'typeorm-pagination';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(pagination);
app.use('/files', express.static(upload.directory));
app.use(routes);
app.use(errors());

//middleware from errors
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  console.log('Server started on port 3333!');
});
