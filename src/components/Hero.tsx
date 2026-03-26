"use client";

import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export default function Hero() {
    const { theme } = useTheme();
    const isLight = theme === "light";

    return (
        <section
            id="home"
            className="relative flex min-h-screen items-center justify-center overflow-hidden"
        >
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage:
                        "url('/hero-bg.png')",
                }}
            />
            {/* Multi-layer overlay for extreme legibility - Theme Aware */}
            <div className={`absolute inset-0 transition-colors duration-500 ${isLight ? "bg-white/40" : "bg-black/50"}`} />
            <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                    background: isLight
                        ? "linear-gradient(to bottom, rgba(248,251,242,0.9) 0%, rgba(248,251,242,0.2) 50%, rgba(248,251,242,0.95) 100%)"
                        : "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 50%, rgba(0,0,0,0.9) 100%)"
                }}
            />
            <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-b from-surface/40 via-transparent to-surface" />

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-primary"
                        style={{
                            width: `${2 + (i % 3)}px`,
                            height: `${2 + (i % 3)}px`,
                            left: `${10 + i * 11}%`,
                            top: `${15 + (i % 4) * 20}%`,
                        }}
                        animate={{
                            y: [0, -40, 0],
                            opacity: [0.1, 0.6, 0.1],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: 4 + i * 0.7,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.5,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-5xl px-6 pt-24 text-center sm:pt-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-8"
                >
                    <span className={`inline-block rounded-full border border-primary/40 backdrop-blur-md px-4 py-2 text-[10px] font-semibold uppercase tracking-[2px] text-primary sm:px-6 sm:py-2.5 sm:text-xs sm:tracking-[5px] ${isLight ? "bg-white/60" : "bg-black/40"}`}>
                        ✦ The Premier Salon in Digana ✦
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className={`font-[family-name:var(--font-heading)] text-5xl font-bold leading-[1.1] drop-shadow-2xl sm:text-6xl md:text-7xl lg:text-8xl ${isLight ? "text-primary" : "text-white"}`}
                >
                    Where Beauty
                    <br />
                    <span className="text-primary-light drop-shadow-sm">Meets Elegance</span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <h2 className="sr-only">Best Beauty and Bridal Salon in Digana, Kandy</h2>
                    <p className={`mx-auto mt-8 max-w-2xl text-base leading-relaxed drop-shadow-md sm:text-lg md:text-xl font-medium ${isLight ? "text-on-surface-secondary" : "text-white/90"}`}>
                        Discover Digana&apos;s most trusted luxury salon. From flawless bridal
                        transformations to rejuvenating facial and spa treatments — your ultimate beauty journey
                        starts here.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
                >
                    <a
                        href="#booking"
                        className="btn-shimmer inline-flex items-center gap-2 rounded-full px-10 py-4 text-sm font-bold uppercase tracking-widest text-[#0a0a0a] transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25"
                    >
                        Book Appointment
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                    <a
                        href="#services"
                        className={`inline-flex items-center gap-2 rounded-full border-2 backdrop-blur-sm px-10 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:border-primary hover:text-primary ${isLight ? "border-on-surface/20 text-on-surface-secondary bg-white/40 hover:bg-white/60" : "border-white/40 text-white bg-black/20 hover:bg-black/40"}`}
                    >
                        View Services
                    </a>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className={`mt-20 grid grid-cols-2 gap-6 border-t pt-10 px-6 sm:grid-cols-4 sm:gap-12 rounded-2xl backdrop-blur-sm ${isLight ? "border-on-surface/10 bg-white/30" : "border-white/10 bg-black/30"}`}
                >
                    {[
                        { value: "10+", label: "Professional Staff" },
                        { value: "100%", label: "Premium Brands" },
                        { value: "15+", label: "Years Experience" },
                        { value: "5.0★", label: "Google Rating" },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center py-4">
                            <p className="font-[family-name:var(--font-heading)] text-3xl font-bold text-primary sm:text-4xl">
                                {stat.value}
                            </p>
                            <p className={`mt-1 text-[11px] uppercase tracking-widest ${isLight ? "text-on-surface-muted" : "text-white/70"}`}>
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <div className="flex h-9 w-5 items-start justify-center rounded-full border border-primary/30 pt-2">
                    <motion.div
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="h-2 w-0.5 rounded-full bg-primary"
                    />
                </div>
            </motion.div>
        </section>
    );
}
