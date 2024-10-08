import bcrypt from "bcrypt";

// Number of salt rounds for hashing passwords
const SALT_ROUNDS = 10;

// Hashes a plain text password
export const bcryptPassword = async (password: string): Promise<string> => {
    try {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error("Error hashing password");
    }
};

// Compares plain text password with a hashed password
export const validatePassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new Error("Error validating password");
    }
};
