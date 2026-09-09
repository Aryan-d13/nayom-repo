import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Symptoms from "@/components/Symptoms";
import Diagnosis from "@/components/Diagnosis";
import Shop from "@/components/Shop";
import Services from "@/components/Services";
import Handoff from "@/components/Handoff";
import Booking from "@/components/Booking";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-asphalt text-road-white flex flex-col selection:bg-signal-red selection:text-white">
      <Navbar />
      <Hero />
      <Symptoms />
      <Diagnosis />
      <Shop />
      <Services />
      <Handoff />
      <Booking />
      <Footer />
    </main>
  );
}
