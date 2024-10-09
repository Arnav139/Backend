// passport.ts

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { setUser } from "./jwt";
import postgresdb from "./db";
import { users } from "../models/schema";
import { eq } from "drizzle-orm";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if the user already exists in the database
                const existingUser = await postgresdb.query.users.findFirst({
                    where: eq(users.email, profile.emails![0].value),
                });

                if (existingUser) {
                    // If user exists, generate a token and return user data
                    const token = setUser({ userId: existingUser.id });
                    return done(null, { user: existingUser, token });
                } else {
                    // If user does not exist, create a new user
                    const newUser = await postgresdb
                        .insert(users)
                        .values({
                            firstName: profile.name!.givenName!,
                            lastName: profile.name!.familyName!,
                            email: profile.emails![0].value,
                            phoneNumber: "",
                            password: "",
                        })
                        .returning({
                            id: users.id,
                            firstName: users.firstName,
                            lastName: users.lastName,
                            email: users.email,
                        });

                    const token = setUser({ userId: newUser[0].id });
                    return done(null, { user: newUser[0], token });
                }
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.serializeUser((user: any, done) => {
    done(null, user);
});

passport.deserializeUser((user: any, done) => {
    done(null, user);
});

export default passport;
