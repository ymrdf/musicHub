"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types";
import axios from "axios";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // 简化加载状态

  // 配置 axios 默认设置
  useEffect(() => {
    // 设置 API 基础 URL
    axios.defaults.baseURL =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // 请求拦截器 - 添加 token
    axios.interceptors.request.use((config) => {
      if (typeof window !== "undefined") {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
          config.headers.Authorization = `Bearer ${savedToken}`;
        }
      }
      return config;
    });

    // 响应拦截器 - 处理认证错误
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          setToken(null);
        }
        return Promise.reject(error);
      }
    );
  }, []);

  // 初始化时从 localStorage 恢复登录状态
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (savedToken && savedUser) {
        try {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("恢复登录状态失败:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        const { user, token } = response.data.data;

        setUser(user);
        setToken(token);

        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
        }
      } else {
        throw new Error(response.data.error || "登录失败");
      }
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("登录失败，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      setLoading(true);

      const response = await axios.post("/api/auth/register", {
        username,
        email,
        password,
        confirmPassword: password,
      });

      if (response.data.success) {
        const { user, token } = response.data.data;

        setUser(user);
        setToken(token);

        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
        }
      } else {
        throw new Error(response.data.error || "注册失败");
      }
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("注册失败，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
