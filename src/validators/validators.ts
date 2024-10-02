import {z} from  'zod';

export default class validators{

    static registerUserSchema = z.object({
        body: z.object({
            firstName: z.string().min(1, "First name is required"),
            lastName: z.string().min(1, "Last name is required"),
            email: z.string().email("Invalid email"),
            phoneNumber: z.string().min(10, "Phone number should be at least 10 characters"),
            password: z.string().min(6, "Password should be at least 6 characters")
        }).strict(),
        params: z.object({}).strict(),
        query: z.object({}).strict()
    });
    
    static loginUserSchema = z.object({
        body: z.object({
            email: z.string().email("Invalid email"),
            password: z.string().min(6, "Password should be at least 6 characters")
        }).strict(),
        params: z.object({}).strict(),
        query: z.object({}).strict()
    });
    
    static logoutUserSchema = z.object({
        body: z.object({
            refreshToken: z.string().min(1, "Refresh token is required")
        }).strict(),
        params: z.object({}).strict(),
        query: z.object({}).strict()
    });
    
}