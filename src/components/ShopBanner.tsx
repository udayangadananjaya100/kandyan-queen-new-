"use client";

import { motion } from "framer-motion";

export default function ShopBanner() {
    return (
        <section className="relative h-[400px] w-full overflow-hidden flex items-center justify-center">
            {/* Background Image - Product Focused */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1527799822344-42ad8c5827d7?w=1920&q=80')",
                    filter: "brightness(0.3) saturate(0.8) hue-rotate(20deg)"
                }}
            />

            <div className="relative z-10 text-center px-6">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-xs uppercase tracking-[4px] text-white/70 mb-4 block"
                >
                    Explore Top Brands
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-8 leading-tight max-w-4xl mx-auto"
                >
                    SHOP LUXURY HAIRCARE <br className="hidden md:block" /> & BEAUTY PRODUCTS
                </motion.h2>
                <motion.a
                    href="#shop"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="inline-block border border-white/50 px-8 py-3 text-[10px] uppercase tracking-[3px] text-white hover:bg-white hover:text-primary transition-all duration-300"
                >
                    Explore Products
                </motion.a>
            </div>
        </section>
    );
}
