import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface DarkModeContextProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextProps | undefined>(undefined);

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Chỉ chạy trên client-side
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("darkMode");
      setDarkMode(savedMode === "true");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("darkMode", String(newMode));
      }
      return newMode;
    });
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  if (typeof window === "undefined") {
    return { darkMode: false, toggleDarkMode: () => {} }; // Tránh lỗi khi SSR
  }
  
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode error");
  }
  return context;
};
