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

    static createDocument = z.object({
        body: z.object({
            metadata: z.object({
                title: z.string().min(1, "Title is required"),
                researchLevel:z.string().min(1,"Research level is required").optional(),
                personality: z.array(z.string()).nonempty("Personality array must have at least one element"),
                tone: z.string().min(1, "Tone is required"),
                
                language: z.string().min(1, "Language is required").optional(),
                useCase: z.string().min(1, "Use case is required").optional(),
            }).strict()
        }).strict(),
        params: z.object({}).strict(),
        query: z.object({}).strict()
    });

    static getDocumentsById=z.object({
        body: z.object({
        }).strict(),
        params: z.object({}).strict(),
        query: z.object({}).strict()
    });

    static deleteDocumentById=z.object({
        body: z.object({
        }).strict(),
        params: z.object({}).strict(),
        query: z.object({}).strict()
    });
    
    static updateDocumentIsFavourite=z.object({
        body: z.object({
        }).strict(),
        params: z.object({
            documentId:z.string({required_error:"Document Id is required"})
        }).strict(),
        query: z.object({}).strict()
    });
}