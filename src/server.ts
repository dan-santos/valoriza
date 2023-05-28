import express from 'express';
import morgan from 'morgan';
import 'express-async-errors';

import { config } from './config';
import { router } from './routes';
import { errorHandler } from './middlewares/errorHandler';

console.info(config);
console.log('Connection with database established.');

export const app = express();
app.use(express.json());
app.use(morgan('combined'));
app.use(router);
app.use(errorHandler);

console.log('Express setted up');

console.log('API routes setted up');

export const session = app.listen(config.port, () => {
  console.log('Server is running...');
});
