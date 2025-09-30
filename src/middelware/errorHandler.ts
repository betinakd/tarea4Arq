import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../utils/ApiError.js';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  res.status(500).json({ error: 'Error interno del servidor' });
}

export { ApiError };
