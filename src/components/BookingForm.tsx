"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const serviceOptions = [
    "Ladies Haircut", "Hair Coloring", "Keratin Treatment",
    "Party Makeup", "HD Makeup", "Bridal Makeup",
    "Pre-bridal Package", "Full Bridal Package", "Gold Facial",
    "Deep Cleansing", "Anti-Aging Facial", "Manicure & Pedicure",
    "Gel Nails", "Full Body Massage", "Aromatherapy",
];

const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
    "05:00 PM", "05:30 PM", "06:00 PM",
];

export default function BookingForm() {
    const [formData, setFormData] = useState({
        name: "", phone: "", service: "", date: "", time: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        const salonPhone = "94777433031";
        const message = `🌟 *New Booking Request* 🌟
----------------------------
👤 *Name:* ${formData.name}
📞 *Phone:* ${formData.phone}
💇‍♀️ *Service:* ${formData.service}
📅 *Date:* ${formData.date}
⏰ *Time:* ${formData.time}
----------------------------
_Sent via Kandyan Queen Salon Website_`;

        const whatsappUrl = `https://wa.me/${salonPhone}?text=${encodeURIComponent(message)}`;

        // Open WhatsApp in a new tab
        window.open(whatsappUrl, "_blank");

        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <section id="booking" className="relative py-16 sm:py-24 lg:py-32">
            {/* Glow */}
            <div className="absolute top-1/2 right-0 h-96 w-96 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
            <div className="absolute top-1/3 left-0 h-64 w-64 rounded-full bg-primary/3 blur-[100px]" />

            <div className="relative mx-auto max-w-7xl px-6">
                <div className="grid items-center gap-16 lg:grid-cols-2">
                    {/* Left — Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[5px] text-primary">
                            Appointments
                        </span>
                        <h2 className="font-[family-name:var(--font-heading)] text-4xl font-bold text-on-surface sm:text-5xl">
                            Book Your <span className="text-gradient">Visit</span>
                        </h2>
                        <div className="section-divider mt-6 !mx-0" />
                        <p className="mt-6 text-on-surface-muted leading-relaxed">
                            Reserve your spot for a premium beauty experience. Choose
                            your preferred service, date and time — and we&apos;ll
                            take care of the rest.
                        </p>

                        <div className="mt-10 space-y-5">
                            {[
                                { icon: "📞", text: "+94 77 743 3031", href: "tel:+94777433031" },
                                { icon: "📍", text: "906/1, New Town, Digana, Rajawella 20180" },
                                { icon: "⏰", text: "Mon - Sat: 9:00 AM — 7:00 PM" },
                            ].map((item) => (
                                <div key={item.text} className="flex items-center gap-4">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg">
                                        {item.icon}
                                    </span>
                                    {item.href ? (
                                        <a href={item.href} className="text-sm text-on-surface-secondary hover:text-primary transition-colors">
                                            {item.text}
                                        </a>
                                    ) : (
                                        <span className="text-sm text-on-surface-secondary">{item.text}</span>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 rounded-2xl border border-primary/15 bg-primary/5 p-5">
                            <p className="text-sm text-primary/80">
                                💳 <strong className="text-primary">Coming Soon:</strong> Online
                                payment via PayHere & Koko.
                            </p>
                        </div>
                    </motion.div>

                    {/* Right — Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <form onSubmit={handleSubmit} className="card p-8 sm:p-10">
                            <h3 className="mb-6 font-[family-name:var(--font-heading)] text-xl font-semibold text-on-surface">
                                Make a Reservation
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-on-surface-muted">Full Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your name" className="form-input" />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-on-surface-muted">Phone Number</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+94 7X XXX XXXX" className="form-input" />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-on-surface-muted">Service</label>
                                    <select name="service" value={formData.service} onChange={handleChange} required className="form-input">
                                        <option value="">Select a service</option>
                                        {serviceOptions.map((s) => (<option key={s} value={s}>{s}</option>))}
                                    </select>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-on-surface-muted">Date</label>
                                        <input type="date" name="date" value={formData.date} onChange={handleChange} required className="form-input" />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-on-surface-muted">Time</label>
                                        <select name="time" value={formData.time} onChange={handleChange} required className="form-input">
                                            <option value="">Select time</option>
                                            {timeSlots.map((t) => (<option key={t} value={t}>{t}</option>))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitted}
                                className="btn-shimmer mt-8 w-full rounded-xl py-4 text-sm font-bold uppercase tracking-widest text-dark transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {submitted ? "✓ Booking Request Sent!" : "Confirm Booking"}
                            </button>

                            <p className="mt-4 text-center text-xs text-on-surface-muted">
                                We&apos;ll confirm via WhatsApp within 30 minutes.
                            </p>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
