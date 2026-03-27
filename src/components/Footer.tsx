"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
    FaFacebookF,
    FaInstagram,
    FaTiktok,
    FaYoutube,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaClock,
} from "react-icons/fa";

const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "Book Appointment", href: "#booking" },
    { label: "Gallery", href: "#gallery" },
    { label: "Reviews", href: "#testimonials" },
];

const socialLinks = [
    { icon: FaFacebookF, href: "#", label: "Facebook" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
    { icon: FaTiktok, href: "#", label: "TikTok" },
    { icon: FaYoutube, href: "#", label: "YouTube" },
];

const openingHours = [
    { day: "Monday — Friday", hours: "9:00 AM — 7:00 PM" },
    { day: "Saturday", hours: "9:00 AM — 8:00 PM" },
    { day: "Sunday", hours: "10:00 AM — 5:00 PM" },
    { day: "Public Holidays", hours: "Closed" },
];

export default function Footer() {
    return (
        <footer id="contact" className="relative border-t border-themed-border bg-surface-alt">
            {/* Top Glow */}
            <div className="absolute top-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30" />

            <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <Image
                                src="/logo.jpg"
                                alt="Kandyan Queen Logo"
                                width={48}
                                height={48}
                                className="rounded-full object-cover ring-2 ring-themed-border"
                            />
                            <div>
                                <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-on-surface">
                                    Kandyan <span className="text-primary">Queen</span>
                                </h3>
                                <p className="text-[10px] uppercase tracking-widest text-on-surface-muted">
                                    Luxury Salon
                                </p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm leading-relaxed text-on-surface-secondary">
                            The best luxury beauty salon in Digana, Kandy. Elevating
                            beauty standards with top-tier bridal dressing, facials, haircuts, and an unforgettable
                            salon experience in Rajawella and Digana.
                        </p>

                        {/* Social */}
                        <div className="mt-8 flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-themed-border text-on-surface-secondary transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:text-primary hover:scale-110"
                                >
                                    <social.icon />
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h4 className="mb-6 text-xs font-bold uppercase tracking-[3px] text-primary">
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-on-surface-secondary transition-colors duration-300 hover:text-primary hover:translate-x-1 inline-block"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Opening Hours */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h4 className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[3px] text-primary">
                            <FaClock className="text-sm" /> Hours
                        </h4>
                        <ul className="space-y-4">
                            {openingHours.map((slot) => (
                                <li
                                    key={slot.day}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <span className="text-on-surface-secondary">{slot.day}</span>
                                    <span
                                        className={`font-medium ${slot.hours === "Closed" ? "text-red-400/80" : "text-on-surface"
                                            }`}
                                    >
                                        {slot.hours}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact & Map */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h4 className="mb-6 text-xs font-bold uppercase tracking-[3px] text-primary">
                            Contact Us
                        </h4>

                        <div className="space-y-5">
                            <div className="flex items-start gap-4">
                                <FaMapMarkerAlt className="mt-1 text-primary" />
                                <p className="text-sm text-on-surface-secondary leading-relaxed">
                                    906/1, New Town, Digana,
                                    <br />
                                    Rajawella 20180, Sri Lanka
                                </p>
                            </div>
                            <div className="flex items-start gap-4">
                                <FaPhone className="mt-0.5 text-primary" />
                                <div className="flex flex-col gap-1.5">
                                    <a
                                        href="tel:+94777433031"
                                        className="text-sm text-on-surface-secondary transition-colors hover:text-primary"
                                    >
                                        +94 77 743 3031
                                    </a>
                                    <a
                                        href="tel:+94812246031"
                                        className="text-sm text-on-surface-secondary transition-colors hover:text-primary"
                                    >
                                        081 224 6031
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <FaEnvelope className="text-primary" />
                                <a
                                    href="mailto:info@kandyanqueen.com"
                                    className="text-sm text-on-surface-secondary transition-colors hover:text-primary"
                                >
                                    info@kandyanqueen.com
                                </a>
                            </div>
                        </div>

                        {/* Google Map */}
                        <div className="mt-8 overflow-hidden rounded-2xl border border-themed-border shadow-lg shadow-black/5">
                            <div className="relative h-40 w-full bg-surface-card">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.6!2d80.7354834!3d7.2959382!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3610041e85763%3A0x295e9fa9919c5489!2sKandyan%20Queen%20(Pvt)%20Ltd!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, filter: "var(--t-map-filter)" }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Salon Location on Google Maps"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 border-t border-themed-border pt-8 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 text-center">
                    <p className="text-xs text-on-surface-muted">
                        © {new Date().getFullYear()} Kandyan Queen Beauty Salon. All rights
                        reserved.
                    </p>
                    <p className="text-xs text-on-surface-muted">
                        Designed & Developed by{" "}
                        <a
                            href="https://www.lioncode.lk/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-primary hover:text-primary-light hover:underline transition-all duration-300"
                        >
                            Lion Code Technologies
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
