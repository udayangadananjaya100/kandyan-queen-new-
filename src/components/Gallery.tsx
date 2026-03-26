"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const galleryImages = [
    { src: "/gallery/bridal-hair-v2.png", alt: "Bridal hair styling", category: "Hair", height: "h-72" },
    { src: "/gallery/salon-interior-v3.png", alt: "Luxury salon experience", category: "Salon", height: "h-96" },
    { src: "/gallery/makeup-v2.png", alt: "Professional makeup", category: "Makeup", height: "h-80" },
    { src: "/gallery/hair-color-v2.png", alt: "Hair coloring result", category: "Hair", height: "h-72" },
    { src: "/gallery/nail-art-v2.png", alt: "Nail art showcase", category: "Nails", height: "h-96" },
    { src: "/gallery/facial-v2.png", alt: "Facial treatment", category: "Skincare", height: "h-80" },
    { src: "/gallery/hair-style-v2.png", alt: "Hair styling result", category: "Hair", height: "h-72" },
    { src: "/gallery/spa-v2.png", alt: "Spa treatment", category: "Spa", height: "h-96" },
];

const categories = ["All", "Hair", "Makeup", "Skincare", "Nails", "Spa", "Salon"];

export default function Gallery() {
    const [activeFilter, setActiveFilter] = useState("All");

    const filtered = activeFilter === "All"
        ? galleryImages
        : galleryImages.filter((img) => img.category === activeFilter);

    return (
        <section id="gallery" className="relative py-16 sm:py-24 lg:py-32 bg-surface-alt">
            <div className="absolute top-0 left-0 h-80 w-80 rounded-full bg-primary/3 blur-[100px]" />

            <div className="relative mx-auto max-w-7xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center"
                >
                    <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[5px] text-primary">
                        Our Work
                    </span>
                    <h2 className="font-[family-name:var(--font-heading)] text-4xl font-bold text-on-surface sm:text-5xl">
                        Beauty <span className="text-gradient">Gallery</span>
                    </h2>
                    <div className="section-divider mt-6" />
                    <p className="mx-auto mt-6 max-w-2xl text-on-surface-muted">
                        Browse through our portfolio of stunning transformations.
                    </p>
                </motion.div>

                {/* Filter */}
                <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            className={`rounded-full px-5 py-2 text-xs font-medium uppercase tracking-wider transition-all duration-300 ${activeFilter === cat
                                    ? "bg-primary text-dark shadow-md shadow-primary/20"
                                    : "border border-themed-border text-on-surface-muted hover:border-primary/30 hover:text-primary"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeFilter}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="columns-1 gap-4 sm:columns-2 lg:columns-3"
                    >
                        {filtered.map((img, i) => (
                            <motion.div
                                key={img.src}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                                className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl"
                                style={{ boxShadow: "var(--t-shadow-sm)" }}
                            >
                                <div className={`relative ${img.height} w-full`}>
                                    <Image
                                        src={img.src}
                                        alt={img.alt}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                </div>
                                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                    <div className="p-5">
                                        <span className="mb-1 inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm">
                                            {img.category}
                                        </span>
                                        <p className="text-sm text-white/80">{img.alt}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
