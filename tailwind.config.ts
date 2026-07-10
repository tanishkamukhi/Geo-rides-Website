import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Geo Rides Premium Colors
        "geo-red": "#E53935",
        "geo-red-dark": "#B71C1C",
        "geo-red-light": "#EF5350",
        "geo-dark": "#0D0D0D",
        "geo-dark-2": "#141414",
        "geo-gray": "#1E1E1E",
        "geo-yellow": "#F59E0B",
        "geo-gold": "#FBBF24",
        "geo-green": "#10B981",
        "geo-blue": "#3B82F6",
        "geo-purple": "#8B5CF6",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "-apple-system", "sans-serif"],
        display: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      backgroundImage: {
        "geo-gradient": "linear-gradient(135deg, #E53935 0%, #B71C1C 100%)",
        "geo-gradient-radial": "radial-gradient(ellipse at top, #3D0000 0%, #0D0D0D 70%)",
        "geo-hero": "linear-gradient(135deg, #0f0f0f 0%, #1a0505 50%, #200808 100%)",
        "glass-gradient": "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
        "red-glow": "radial-gradient(ellipse at center, rgba(229,57,53,0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        "geo-red": "0 4px 20px rgba(229, 57, 53, 0.4)",
        "geo-red-lg": "0 8px 40px rgba(229, 57, 53, 0.5)",
        "glass": "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
        "glass-lg": "0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
        "premium": "0 10px 40px rgba(0, 0, 0, 0.12)",
        "premium-lg": "0 25px 60px rgba(0, 0, 0, 0.2)",
        "inner-glow": "inset 0 0 20px rgba(229,57,53,0.1)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(229,57,53,0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(229,57,53,0.8)" },
        },
        "marquee": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "count-up": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "rotate-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "float-slower": "float 12s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "marquee": "marquee 30s linear infinite",
        "fade-up": "fade-up 0.6s ease-out",
        "scale-in": "scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-left": "slide-in-left 0.6s ease-out",
        "shimmer": "shimmer 2s linear infinite",
        "rotate-slow": "rotate-slow 20s linear infinite",
        "bounce-slow": "bounce-slow 3s ease-in-out infinite",
        "spin-slow": "rotate-slow 8s linear infinite",
      },
      fontSize: {
        "display-xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-lg": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["3rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-sm": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.16, 1, 0.3, 1)",
        "bounce": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
