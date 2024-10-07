import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.SECRET_KEY as string; // Ensure it's typed as a string

// Function to create a JWT for the user
const setUser = (payload: { userId:number }) => {
  const { userId } = payload;
  
  return jwt.sign(
    {
      userId: userId,
    },
    secret, // Missing comma added here
    {
      expiresIn: '24h', // Token will expire in 24 hours
    }
  );
};

// Function to verify and decode the JWT
const getUser = (token: string) => {
  try {
    // Remove 'Bearer ' prefix if present (usually in Authorization headers)
    const newToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    
    // Verify the token using the secret
    return jwt.verify(newToken, secret);
  } catch (error) {
    // Handle error appropriately (e.g., token invalid or expired)
    throw new Error("Invalid token");
  }
};

export { setUser, getUser };