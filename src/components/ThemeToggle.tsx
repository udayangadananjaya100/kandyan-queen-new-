"use client";

import { motion } from "framer-motion";
import { HiSun, HiMoon } from "react-icons/hi";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.9 }}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-themed-border bg-surface-alt hover:bg-surface-card-hover transition-colors"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === "light" ? 0 : 180 }}
                transition={{ duration: 0.5, ease: "anticipate" }}
            >
                {theme === "light" ? (
                    <HiSun className="text-xl text-primary" />
                ) : (
                    <HiMoon className="text-xl text-primary/80" />
                )}
            </motion.div>
        </motion.button>
    );
}
