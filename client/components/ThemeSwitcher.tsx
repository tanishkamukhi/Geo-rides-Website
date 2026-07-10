import React, { useState } from "react";
import { useTheme, Theme } from "./ThemeContext";
import { Palette, Sparkles } from "lucide-react";

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const themes: { code: Theme; name: string; icon: string; badge?: string }[] = [
        { code: "geo-dark", name: "Geo Classic (Dark)", icon: "🔴🌑", badge: "Default" },
        { code: "geo-light", name: "Geo Classic (Light)", icon: "🔴⬜" },
        { code: "scoot-light", name: "Scoot Electric (Light)", icon: "🟡⬜", badge: "New" },
        { code: "scoot-dark", name: "Scoot Electric (Dark)", icon: "🟡🌑", badge: "New" },
    ];

    const handleThemeChange = (code: Theme) => {
        setTheme(code);
        setIsOpen(false);
    };

    const activeTheme = themes.find((t) => t.code === theme) || themes[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-all border border-border/40 font-semibold text-sm"
                aria-label="Select theme"
            >
                <Palette className="w-4 h-4 text-primary" />
                <span className="hidden md:inline-flex items-center gap-1.5">
                    Theme
                    <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono">
                        {activeTheme.code.split("-")[0]}
                    </span>
                </span>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-card rounded-2xl shadow-xl z-50 border border-border overflow-hidden p-2 space-y-1 animate-scale-in">
                        <div className="px-3 py-2 text-xs font-bold text-muted-foreground border-b border-border/50 flex items-center gap-1 mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                            SELECT BRAND THEME
                        </div>
                        {themes.map((t) => (
                            <button
                                key={t.code}
                                onClick={() => handleThemeChange(t.code)}
                                className={`w-full text-left px-3 py-2.5 hover:bg-muted/80 rounded-xl transition flex items-center justify-between text-sm ${theme === t.code
                                        ? "bg-primary/8 text-primary font-bold"
                                        : "text-foreground/80 hover:text-foreground"
                                    }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className="text-base select-none">{t.icon}</span>
                                    <span>{t.name}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {t.badge && (
                                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                                            {t.badge}
                                        </span>
                                    )}
                                    {theme === t.code && <span className="text-primary text-xs">✓</span>}
                                </div>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
