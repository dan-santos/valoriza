import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../utils/CustomErrors';

export function ensureAdmin(req: Request, res: Response, next: NextFunction) {
  const admin = true;

  if (admin) {
    return next();
  } 
  throw new UnauthorizedError('Unauthorized User');
}