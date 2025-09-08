import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import sequelize from "./database";
import { User } from "./models";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "your-super-secret-jwt-key-change-this-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// JWT generation and verification
export const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string): { userId: number } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded;
  } catch (error) {
    return null;
  }
};

// Password hashing and verification
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Get user information from request
export const getUserFromRequest = async (
  request: NextRequest
): Promise<any | null> => {
  try {
    const authHeader = request.headers.get("authorization");
    let token: string | null = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      // Try to read token from cookie (compatible with requests without explicit Authorization)
      token = request.cookies.get("token")?.value || null;
    }

    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return null;
    }

    const user = await User.findByPk(decoded.userId);
    if (!user || !(user as any).isActive) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Failed to get user information:", error);
    return null;
  }
};

// Authentication check middleware
export const requireAuth = async (
  request: NextRequest
): Promise<any | Response> => {
  const user = await getUserFromRequest(request);
  if (!user) {
    return new Response(
      JSON.stringify({ success: false, error: "Unauthorized access" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  return user;
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const isValidPassword = (
  password: string
): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters" };
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return { valid: false, message: "Password must contain lowercase letters" };
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return { valid: false, message: "Password must contain uppercase letters" };
  }
  if (!/(?=.*\d)/.test(password)) {
    return { valid: false, message: "Password must contain numbers" };
  }
  return { valid: true };
};

// Validate username format
export const isValidUsername = (
  username: string
): { valid: boolean; message?: string } => {
  if (username.length < 3 || username.length > 30) {
    return {
      valid: false,
      message: "Username must be between 3-30 characters",
    };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      valid: false,
      message: "Username can only contain letters, numbers and underscores",
    };
  }
  return { valid: true };
};

// Generate random avatar URL
export const generateAvatarUrl = (username: string): string => {
  // Use correct encoding to ensure special characters are handled properly
  const encodedUsername = encodeURIComponent(username);
  return `https://api.dicebear.com/7.x/avatars/svg?seed=${encodedUsername}`;
};
