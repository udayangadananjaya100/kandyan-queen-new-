"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const offers = [
    { title: "BRIDAL & ENGAGEMENT", sub: "Book your special day with us", free: "Free Luxury Jewelries", img: "/gallery/bridal-hair-v2.png" },
    { title: "FOX 'C' FACIAL TREATMENT", sub: "Experience radiant skin", free: "Free Gel Nail Application", img: "/gallery/facial-v2.png" },
    { title: "HYDRA FACIAL TREATMENT", sub: "Deep hydration & glow", free: "Free Pedicure Treatment", img: "/gallery/spa-v2.png" },
    { title: "GEL NAIL EXTENSIONS", sub: "Flawless long-lasting nails", free: "Free Full Face Threading", img: "/gallery/nail-art-v2.png" },
    { title: "OXYGENEO FACIAL TREATMENT", sub: "Premium oxygenating facial", free: "Free Hair Cut", img: "/gallery/facial-v2.png" }, // Using facial image
    { title: "FCR KOREAN FACIAL", sub: "Advanced Korean skincare", free: "Free Pedicure Treatment", img: "/gallery/spa-v2.png" }, // Using spa image
    { title: "KERATIN TREATMENT", sub: "Smooth, frizz-free hair", free: "Free Clean Up Treatment", img: "/gallery/hair-style-v2.png" },
    { title: "HAIR COLOR", sub: "Transform your look", free: "Free Layer Haircut", img: "/gallery/hair-color-v2.png" },
];

export default function PromoBanner() {
    const phoneNumber = "94777433031";
    const waMessage = encodeURIComponent("Hi Kandyan Queen Salon, I would like to claim an offer from the website! 🎁");

    return (
        <section className="bg-surface-alt py-24 px-6 relative overflow-hidden">
            {/* Background design element */}
            <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
            <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-themed-border/20 blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-6xl mx-auto relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[5px] text-primary">
                        Special Offers
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-[family-name:var(--font-heading)] font-bold text-on-surface leading-tight">
                        Exclusive Complimentary Services <br />
                        <span className="text-primary font-medium italic mt-2 inline-block">With Any Of The Following!</span>
                    </h2>
                    <div className="section-divider border-on-surface/10 mt-8 mx-auto" />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    {offers.map((offer, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col sm:flex-row items-center sm:items-start gap-6 group bg-surface hover:bg-surface-alt p-6 rounded-3xl transition-all duration-300 border border-themed-border hover:border-primary/40 shadow-sm hover:shadow-md"
                        >
                            <div className="relative w-32 h-32 sm:w-28 sm:h-28 shrink-0 rounded-full sm:rounded-2xl overflow-hidden border-2 border-primary/20 shadow-md group-hover:scale-105 transition-transform duration-300">
                                <Image
                                    src={offer.img}
                                    alt={offer.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col flex-1 text-center sm:text-left mt-2 sm:mt-0">
                                <h3 className="text-on-surface font-[family-name:var(--font-heading)] font-bold text-xl sm:text-2xl tracking-wide mb-1">{offer.title}</h3>
                                <p className="text-on-surface-muted text-sm sm:text-base mb-3 font-medium">{offer.sub}</p>
                                <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase mt-auto self-center sm:self-start shadow-sm border border-primary/10">
                                    {offer.free}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Claim Button */}
                <div className="mt-20 text-center">
                    <motion.a
                        href={`https://wa.me/${phoneNumber}?text=${waMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-shimmer inline-flex items-center gap-2 bg-primary px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest text-on-primary hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                    >
                        Claim Offer & Book
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </motion.a>
                </div>
            </motion.div>
        </section>
    );
}
