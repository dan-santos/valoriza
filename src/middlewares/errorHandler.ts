import { Request, Response } from 'express';
import { CustomError } from '../utils/CustomErrors';

export function errorHandler(
  err: Error & Partial<CustomError>, 
  req: Request, 
  res: Response
) {
  const statusCode = err.statusCode ?? 500;
  const message = err.statusCode ? err.message : 'Internal Server Error';

  return res.status(statusCode).json({ error: message });
}