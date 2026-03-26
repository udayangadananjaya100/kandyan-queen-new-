"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "Book Now", href: "#booking" },
    { label: "Gallery", href: "#gallery" },
    { label: "Reviews", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? "shadow-lg backdrop-blur-xl"
                : "bg-transparent"
                }`}
            style={scrolled ? { background: "var(--t-nav)", boxShadow: "var(--t-shadow-sm)" } : {}}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                {/* Logo */}
                <a href="#home" className="flex items-center gap-3 group">
                    <div className="relative overflow-hidden rounded-full ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                        <Image
                            src="/logo.jpg"
                            alt="Kandyan Queen Logo"
                            width={42}
                            height={42}
                            className="rounded-full object-cover"
                            priority
                        />
                    </div>
                    <div>
                        <h1 className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-wide text-on-surface drop-shadow-sm">
                            Kandyan <span className="text-primary">Queen</span>
                        </h1>
                        <p className="text-[10px] uppercase tracking-[3px] text-primary/70 font-bold drop-shadow-sm">
                            Beauty Salon
                        </p>
                    </div>
                </a>

                {/* Desktop Links */}
                <ul className="hidden items-center gap-8 xl:flex">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                className="relative text-sm font-bold tracking-wide text-on-surface-secondary drop-shadow-md transition-all duration-300 hover:text-primary after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Right Side */}
                <div className="hidden items-center gap-3 xl:flex">
                    <ThemeToggle />
                    <a
                        href="#booking"
                        className="btn-shimmer rounded-full px-6 py-2.5 text-sm font-semibold text-dark transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                    >
                        Book Now
                    </a>
                </div>

                {/* Mobile */}
                <div className="flex items-center gap-3 xl:hidden">
                    <ThemeToggle />
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="text-2xl text-on-surface"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <HiX /> : <HiMenuAlt3 />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass overflow-hidden xl:hidden"
                    >
                        <ul className="flex flex-col items-center gap-4 py-6">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="text-base font-medium text-on-surface-secondary transition-colors hover:text-primary"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                            <li>
                                <a
                                    href="#booking"
                                    onClick={() => setMobileOpen(false)}
                                    className="btn-shimmer mt-2 inline-block rounded-full px-8 py-3 text-sm font-semibold text-dark"
                                >
                                    Book Appointment
                                </a>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
