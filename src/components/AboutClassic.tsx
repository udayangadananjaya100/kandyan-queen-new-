"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutClassic() {
    return (
        <section className="bg-surface py-16 sm:py-24 lg:py-32 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2"
                    >
                        <h2 className="text-3xl md:text-4xl font-medium text-on-surface mb-8 leading-snug">
                            Indulge in the <br /> Extraordinary
                        </h2>
                        <div className="space-y-6 text-on-surface-muted leading-relaxed text-sm md:text-base max-w-xl">
                            <p>
                                Welcome to the best salon in Digana. Kandyan Queen is the premier luxury salon serving clients across Digana, Rajawella, and Kandy. We cater to the beauty needs of trendsetters and elegant brides looking for a premium experience.
                            </p>
                            <p>
                                With nearly two decades of excellence, Kandyan Queen has become a local leader and benchmark in bridal dressing, hair, beauty, and nail care. We believe that your beauty is a reflection of your personality and inner soul, and our top-rated Digana salon is designed to bring that out.
                            </p>
                        </div>
                        <motion.a
                            href="#booking"
                            className="mt-10 inline-block border border-on-surface px-8 py-3 text-[10px] uppercase tracking-[3px] text-on-surface hover:bg-on-surface hover:text-surface transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                        >
                            Discover More
                        </motion.a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2 relative"
                    >
                        <div className="relative aspect-[4/5] w-full max-w-md mx-auto overflow-hidden rounded-sm shadow-2xl">
                            <Image
                                src="/about-real-clear.png"
                                alt="Luxury Salon Experience"
                                fill
                                className="object-cover"
                            />
                        </div>
                        {/* Decorative element */}
                        <div className="absolute -bottom-6 -right-6 h-48 w-48 border border-primary-light/20 -z-10" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
