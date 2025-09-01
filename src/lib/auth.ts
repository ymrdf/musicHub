import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import sequelize from "./database";
import "./models";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// JWT 生成和验证
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

// 密码加密和验证
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

// 从请求中获取用户信息
export const getUserFromRequest = async (
  request: NextRequest
): Promise<any | null> => {
  try {
    const authHeader = request.headers.get("authorization");
    let token: string | null = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      // 尝试从 cookie 中读取 token（兼容未显式附带 Authorization 的请求）
      token = request.cookies.get("token")?.value || null;
    }

    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return null;
    }

    const User = sequelize.models.User;
    const user = await (User as any).findByPk(decoded.userId);
    if (!user || !(user as any).isActive) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("获取用户信息失败:", error);
    return null;
  }
};

// 权限检查中间件
export const requireAuth = async (
  request: NextRequest
): Promise<any | Response> => {
  const user = await getUserFromRequest(request);
  if (!user) {
    return new Response(
      JSON.stringify({ success: false, error: "未授权访问" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  return user;
};

// 验证邮箱格式
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 验证密码强度
export const isValidPassword = (
  password: string
): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: "密码长度至少 8 位" };
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return { valid: false, message: "密码必须包含小写字母" };
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return { valid: false, message: "密码必须包含大写字母" };
  }
  if (!/(?=.*\d)/.test(password)) {
    return { valid: false, message: "密码必须包含数字" };
  }
  return { valid: true };
};

// 验证用户名格式
export const isValidUsername = (
  username: string
): { valid: boolean; message?: string } => {
  if (username.length < 3 || username.length > 30) {
    return { valid: false, message: "用户名长度必须在 3-30 位之间" };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, message: "用户名只能包含字母、数字和下划线" };
  }
  return { valid: true };
};

// 生成随机头像 URL
export const generateAvatarUrl = (username: string): string => {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    username
  )}`;
};
