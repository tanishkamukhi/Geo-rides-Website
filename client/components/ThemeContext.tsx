import React, { createContext, useContext, useState, useEffect } from "react";

export type Theme = "geo-dark" | "geo-light" | "scoot-dark" | "scoot-light";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        const saved = localStorage.getItem("app-theme");
        return (saved as Theme) || "geo-dark";
    });

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem("app-theme", newTheme);
    };

    useEffect(() => {
        const root = document.documentElement;
        // Remove all previous theme classes
        root.classList.remove("dark", "theme-scoot");

        // Apply classes based on chosen theme code
        switch (theme) {
            case "geo-dark":
                root.classList.add("dark");
                break;
            case "geo-light":
                // Light mode (default, no classes needed)
                break;
            case "scoot-dark":
                root.classList.add("dark", "theme-scoot");
                break;
            case "scoot-light":
                root.classList.add("theme-scoot");
                break;
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
