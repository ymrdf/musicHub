"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types";
import axios from "axios";
import { AudioPlayerProvider } from "@/hooks/useAudioPlayer";

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

// 设置 cookie 的辅助函数
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window !== "undefined") {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}`;
  }
};

// 删除 cookie 的辅助函数
const deleteCookie = (name: string) => {
  if (typeof window !== "undefined") {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
          deleteCookie("token");
          setUser(null);
          setToken(null);
        }
        return Promise.reject(error);
      }
    );
  }, []);

  // 验证 token 是否有效
  const validateToken = async (token: string) => {
    try {
      const response = await axios.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.success;
    } catch (error) {
      return false;
    }
  };

  // 初始化时从 localStorage 恢复登录状态
  useEffect(() => {
    const initAuth = async () => {
      if (typeof window !== "undefined") {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (savedToken && savedUser) {
          try {
            // 验证 token 是否仍然有效
            const isValid = await validateToken(savedToken);
            if (isValid) {
              setToken(savedToken);
              setUser(JSON.parse(savedUser));
              // 恢复 cookie
              setCookie("token", savedToken);
            } else {
              // token 无效，清除本地存储
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              deleteCookie("token");
            }
          } catch (error) {
            console.error("恢复登录状态失败:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            deleteCookie("token");
          }
        }
      }
    };

    initAuth();
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
          // 设置 cookie 供中间件使用
          setCookie("token", token);
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
          // 设置 cookie 供中间件使用
          setCookie("token", token);
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
      deleteCookie("token");
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

  return (
    <AuthContext.Provider value={value}>
      <AudioPlayerProvider>{children}</AudioPlayerProvider>
    </AuthContext.Provider>
  );
}
