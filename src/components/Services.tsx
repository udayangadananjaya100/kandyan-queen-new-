"use client";

import { motion } from "framer-motion";
import {
    HiOutlineScissors,
    HiOutlineSparkles,
    HiOutlineBeaker,
    HiOutlinePaintBrush
} from "react-icons/hi2";

const mainServices = [
    {
        title: "Hair",
        icon: HiOutlineScissors,
        description: "Hair stylists at Kandyan Queen believe that beauty is different for every person which is why they do not mass produce but tailor-make a look.",
    },
    {
        title: "Cosmetology",
        icon: HiOutlineBeaker,
        description: "Your path to radiant skin starts here with top-notch, advanced cosmetology services especially customised for you.",
    },
    {
        title: "Make-Up",
        icon: HiOutlineSparkles,
        description: "Step into the spotlight with makeup services that highlight your unique style and elegance for any royal occasion.",
    },
    {
        title: "Nails",
        icon: HiOutlinePaintBrush,
        description: "Nail Goals? We've got you covered! Our expert team of nail technicians is all about precision and creating masterpieces.",
    }
];

export default function Services() {
    return (
        <section id="services" className="bg-surface py-16 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-6">
                <div className="text-center mb-20">
                    <span className="text-[10px] uppercase tracking-[4px] text-primary mb-4 block">
                        Indulge Yourself
                    </span>
                    <h2 className="text-4xl md:text-5xl font-medium text-on-surface">
                        Your Palace of Beauty
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {mainServices.map((service, index) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center flex flex-col items-center"
                        >
                            <div className="mb-6 flex h-16 w-16 items-center justify-center text-primary/80">
                                <service.icon className="h-12 w-12 stroke-[1px]" />
                            </div>
                            <h3 className="text-xl font-medium text-on-surface mb-4">
                                {service.title}
                            </h3>
                            <p className="text-sm text-on-surface-muted leading-relaxed px-4">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <a href="#booking" className="text-[10px] uppercase tracking-[3px] text-on-surface border-b border-primary-light/30 pb-1 hover:border-primary hover:text-primary transition-all">
                        View All Spa Packages
                    </a>
                </div>
            </div>
        </section>
    );
}
