import { BaseError } from '@shared/errors/BaseError';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { ValidationError } from '@shared/errors/ValidationError';
import { NextFunction, Request, Response } from 'express';

const assembleError = <T extends BaseError>(err: T) => ({
  message: err.message,
  code: err.code,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof NotFoundError) {
    res.status(404).json(assembleError(err));
    return;
  } else if (err instanceof ValidationError) {
    res.status(400).json(assembleError(err));
    return;
  }

  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error' });
};

export default errorHandler;
