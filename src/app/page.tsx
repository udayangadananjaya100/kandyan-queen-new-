import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

import AboutClassic from "../components/AboutClassic";
import Services from "../components/Services";
import BookingForm from "../components/BookingForm";
import Gallery from "../components/Gallery";
import Testimonials from "../components/Testimonials";
import PromoBanner from "../components/PromoBanner";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AboutClassic />
        <Services />
        <Gallery />
        <Testimonials />
        <BookingForm />
        <PromoBanner />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
