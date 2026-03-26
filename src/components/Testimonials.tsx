"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight, FaGoogle } from "react-icons/fa";
import { useTheme } from "./ThemeProvider";

interface Review {
    name: string;
    photo: string | null;
    rating: number;
    text: string;
    timeDescription: string;
}

// Fallback reviews if API is not configured
const fallbackReviews: Review[] = [
    {
        name: "S Imeshi",
        photo: null,
        rating: 5,
        text: "I had a Golden Facial at Kandyan Queen last week and the experience was amazing! ✨ The staff were very professional and friendly, and the treatment was so relaxing.",
        timeDescription: "",
    },
    {
        name: "Rashmi Nimeshika",
        photo: null,
        rating: 5,
        text: "I got a medical skin care facial for my face from the thermo ceutical brand...I got really good results...and it's a reliable place that offers a clean environment and comfortable service. Thnx ❤️",
        timeDescription: "",
    },
    {
        name: "BCS Weerasekara",
        photo: null,
        rating: 5,
        text: "Wow... mn hithuwewath naha mechchara lassanata wada wena salon ekak digane thiyanawa kiyala... maara friendly... good service... the best!",
        timeDescription: "",
    },
];

export default function Testimonials() {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);
    const [reviews, setReviews] = useState<Review[]>(fallbackReviews);
    const [overallRating, setOverallRating] = useState(5);
    const [totalReviews, setTotalReviews] = useState(0);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        async function fetchReviews() {
            try {
                const res = await fetch("/api/reviews");
                const data = await res.json();
                if (data.reviews && data.reviews.length > 0) {
                    setReviews(data.reviews);
                    setOverallRating(data.rating || 5);
                    setTotalReviews(data.totalReviews || 0);
                    setIsLive(true);
                }
            } catch {
                // Keep fallback reviews
            }
        }
        fetchReviews();
    }, []);

    const paginate = useCallback((dir: number) => {
        setDirection(dir);
        setCurrent((prev) => (prev + dir + reviews.length) % reviews.length);
    }, [reviews.length]);

    useEffect(() => {
        const timer = setInterval(() => paginate(1), 6000);
        return () => clearInterval(timer);
    }, [paginate]);

    const variants = {
        enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
    };

    const t = reviews[current];
    const { theme } = useTheme();
    const isLight = theme === "light";

    return (
        <section id="testimonials" className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
            <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/3 blur-[120px]" />

            <div className="relative mx-auto max-w-4xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 text-center"
                >
                    <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[5px] text-primary">
                        Testimonials
                    </span>
                    <h2 className="font-[family-name:var(--font-heading)] text-4xl font-bold text-on-surface sm:text-5xl">
                        What Our <span className="text-gradient">Clients</span> Say
                    </h2>
                    <div className="section-divider mt-6" />

                    {/* Overall Rating Summary */}
                    {isLive && totalReviews > 0 && (
                        <div className="mt-6 flex items-center justify-center gap-3">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className={`text-sm ${i < Math.round(overallRating) ? "text-[#fbbc04]" : "text-gray-300 dark:text-gray-600"}`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-on-surface-secondary">
                                {overallRating.toFixed(1)} · {totalReviews} reviews on Google
                            </span>
                        </div>
                    )}
                </motion.div>

                <div className="relative">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={current}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className={`relative rounded-3xl p-6 sm:p-10 text-left flex flex-col border shadow-sm ${isLight ? "bg-white border-[#dadce0]" : "bg-[#202124] border-[#3c4043]"}`}
                        >
                            {/* Top row: Avatar & Info */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1a73e8] text-white">
                                        {t.photo ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img src={t.photo} alt={t.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-lg font-medium">{t.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold leading-tight ${isLight ? "text-[#202124]" : "text-[#e8eaed]"}`}>
                                            {t.name}
                                        </h3>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                                            {t.timeDescription && (
                                                <span className={`text-sm ${isLight ? "text-[#70757a]" : "text-[#9aa0a6]"}`}>{t.timeDescription}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-2xl text-[#4285F4] pt-1 pl-2">
                                    <FaGoogle />
                                </div>
                            </div>

                            {/* Stars */}
                            <div className="mb-4 flex items-center gap-1">
                                {[...Array(t.rating)].map((_, i) => (
                                    <FaStar key={i} className="text-[#fbbc04] text-sm" />
                                ))}
                            </div>

                            {/* Review Text */}
                            <p className={`text-sm sm:text-base leading-relaxed ${isLight ? "text-[#202124]" : "text-[#e8eaed]"}`}>
                                {t.text}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Controls */}
                    <div className="mt-8 flex items-center justify-center gap-6">
                        <button
                            onClick={() => paginate(-1)}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-themed-border text-primary transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:shadow-md hover:shadow-primary/10"
                            aria-label="Previous testimonial"
                        >
                            <FaChevronLeft className="text-sm" />
                        </button>

                        <div className="flex gap-2">
                            {reviews.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                                    className={`h-2 rounded-full transition-all duration-300 ${i === current
                                        ? "w-8 bg-primary"
                                        : "w-2 hover:bg-primary/30"
                                        }`}
                                    style={i !== current ? { background: "var(--t-dot-inactive)" } : {}}
                                    aria-label={`Go to testimonial ${i + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => paginate(1)}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-themed-border text-primary transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:shadow-md hover:shadow-primary/10"
                            aria-label="Next testimonial"
                        >
                            <FaChevronRight className="text-sm" />
                        </button>
                    </div>

                    {/* Google Reviews Link */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-10 text-center"
                    >
                        <a
                            href="https://maps.app.goo.gl/Z3e26FWX3ZXw4Tq19"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-6 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:border-primary hover:bg-primary/15 hover:shadow-lg hover:shadow-primary/10"
                        >
                            <FaGoogle className="text-base" />
                            Read More Reviews on Google
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
