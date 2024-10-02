import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sanitizedValues = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.body = sanitizedValues.body;
      req.query = sanitizedValues.query;
      req.params = sanitizedValues.params;
      return next();
    } catch (error) {
      const validationErrors: { [key: string]: string } = {};

      (error as ZodError).errors.forEach((errorMessage) => {
        const fieldName = errorMessage.path.join(".");
        validationErrors[fieldName] = errorMessage.message;
      });

      res.status(400).json({ errors: validationErrors });
    }
  };
