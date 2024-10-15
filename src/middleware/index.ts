import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { getUser } from "../config/jwt";

interface AuthenticatedRequest extends Request {
  user?: any; // Adjust the type to whatever `user` should be (e.g., `User`, `DecodedToken`, etc.)
}


 export const authenticateUser=(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    try{
      const getToken:any = req.headers.authorization;
    if(!getToken){
        res.status(400).send({message:"Token not found"})
    }
    const user:any=getUser(getToken)
    if(!user){
        res.status(400).send({message:"User not Found"})
    }
    req.user=user
    next()
    }catch(err:any){
        res.status(400).send({message:err.message})
    }
}

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
