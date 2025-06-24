
import { ValidationError, AnyObjectSchema } from 'yup';
import { Request, Response, NextFunction } from 'express';

const assembleValidationError = (error: ValidationError) => ({
  code: 'INVALID_DATA',
  message: error.message,
});

export const validateRequest = (schema: AnyObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req, { strict: true });
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json(assembleValidationError(error));
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };
};
