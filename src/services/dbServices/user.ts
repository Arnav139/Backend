import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { users, documents } from "../../models/schema";
import postgresdb from "../../config/db";
import { setUser } from "../../config/jwt";
import { eq } from "drizzle-orm";
import { bcryptPassword, validatePassword } from "../../config/bcrypt";
const JWT_SECRET = "varun132";

export default class User {
    static registerUser = async (userData: any) => {
        try {
            const { phoneNumber, email, firstName, lastName, password } = userData;

            const existingUser = await postgresdb.query.users.findFirst({
                where: eq(users.email, email),
            });
            console.log(existingUser);
            if (existingUser) {
                throw new Error("User already exists with this email");
            }
            // console.log(existingUser , "esrdtfyuiopfdghjklj")
            const data = await postgresdb
                .insert(users)
                .values({
                    firstName,
                    lastName,
                    email,
                    phoneNumber,
                    password: await bcryptPassword(password),
                })
                .returning({
                    email: users.email,
                    firstName: users.firstName,
                    lastName: users.lastName,
                    id: users.id,
                });
            const token = setUser({ userId: data[0].id });
            console.log(token);
            return token;
        } catch (error: any) {
            throw new Error(error);
        }
    };

    static loginUser = async (email: string, password: string) => {
        try {
            const user = await postgresdb
                .select()
                .from(users)
                .where(eq(users.email, email))
                .limit(1);

            if (user.length > 0) {
                const hashPassword = await validatePassword(password, user[0].password);
                if (hashPassword == true) {
                    const token = setUser({ userId: user[0].id });
                    return { token };
                } else {
                    throw new Error("Invalid password");
                }
            } else {
                throw new Error("User not found");
            }
        } catch (error: any) {
            throw new Error(error);
        }
    };
}
