import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export const validate = <T>(schema: ZodType<T>) =>
    (req: Request, res: Response, next: NextFunction) => {

        const result = schema.safeParse(req.body);
        if (!result.success) {
            console.log('Validation issues:', JSON.stringify(result.error.issues, null, 2));
            const errors = result.error.issues.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));
            return res.status(400).json({ errors });
        }
        req.body = result.data;
        next();
    };