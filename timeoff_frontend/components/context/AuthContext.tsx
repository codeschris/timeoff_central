import React, { createContext, useState, useEffect } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies();

interface AuthContextType {
  isAuthenticated: boolean;
  username: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  whoami: () => Promise<void>;
  error: string;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  username: "",
  login: async () => {},
  logout: async () => {},
  whoami: async () => {},
  error: "",
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getSession();
    getCSRFToken(); // Fetch CSRF token during initialization
  }, []);

  const getCSRFToken = async () => {
    try {
      await fetch("http://127.0.0.1:8000/api/csrf-token/", { credentials: "include" });
    } catch (err) {
      console.error("Failed to fetch CSRF token", err);
    }
  };

  const getSession = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/session/", { credentials: "include" });
      const data = await res.json();
      setIsAuthenticated(data.isAuthenticated || false);
    } catch (err) {
      console.error("Session check failed", err);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": cookies.get("csrftoken"),
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      setIsAuthenticated(true);
      setError("");
      window.location.href = "/"; // Redirect to home page once authenticated
    } catch (err) {
      console.error(err);
      setError("Wrong email or password.");
    }
  };

  const logout = async () => {
    try {
      await fetch("http://127.0.0.1:8000/api/logout/", { credentials: "include" });
      setIsAuthenticated(false);
      setUsername("");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const whoami = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/whoami/", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      setUsername(data.username || "");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, username, login, logout, whoami, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};