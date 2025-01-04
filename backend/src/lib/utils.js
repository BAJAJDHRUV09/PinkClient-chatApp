import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (userId, res) => {
    // Use a more descriptive key for the user ID in the token payload
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d", // token expires in 7 days
    });

    // Set the cookie with the token
    res.cookie("jwt_token", token, {  
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days (milliseconds)
        httpOnly: true, // Prevents XSS attacks (cannot access cookie from JavaScript)
        sameSite: "Strict", // Prevents CSRF attacks (cookie is sent only with same-site requests)
        secure: process.env.NODE_ENV === "production", // Only use "secure" in production
    });

    return token;
};

