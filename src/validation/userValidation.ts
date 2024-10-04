import { z } from "zod";

export default class validators {
    static registerUserSchema = z.object({
        body: z
            .object({
                firstName: z.string().min(1, "First name is required"),
                lastName: z.string().min(1, "Last name is required"),
                email: z.string().email("Invalid email"),
                phoneNumber: z
                    .number()
                    .int()
                    .min(1000000000, "Phone number must be exactly 10 digits long")
                    .max(9999999999, "Phone number must be exactly 10 digits long"),
                password: z.string().min(1, "Password should be at least 1 characters"),
            })
            .strict(),
        params: z.object({}).strict(),
        query: z.object({}).strict(),
    });

    static loginUserSchema = z.object({
        body: z
            .object({
                email: z.string().email("Invalid email"),
                password: z.string().min(1, "Password should be at least 1 characters"),
            })
            .strict(),
        params: z.object({}).strict(),
        query: z.object({}).strict(),
    });

    static logoutUserSchema = z.object({
        body: z
            .object({
                refreshToken: z.string().min(1, "Refresh token is required"),
            })
            .strict(),
        params: z.object({}).strict(),
        query: z.object({}).strict(),
    });
}
