"use client";

import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
    const phoneNumber = "94777433031";
    const message = encodeURIComponent(
        "Hi! I'd like to book an appointment at Kandyan Queen Salon. 💇‍♀️"
    );

    return (
        <motion.a
            href={`https://wa.me/${phoneNumber}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, type: "spring" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-shadow hover:shadow-xl hover:shadow-[#25D366]/50 lg:bottom-8 lg:right-8 lg:h-14 lg:w-14"
            aria-label="Chat on WhatsApp"
        >
            <FaWhatsapp className="text-2xl lg:text-3xl" />

            {/* Pulse Effect */}
            <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366] opacity-75 duration-[2s]"></span>
        </motion.a>
    );
}
