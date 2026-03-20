"use client";

import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import Footer from "@/components/Footer";

// Pickadeli-inspired components
import HeroPickadeli from "@/components/HeroPickadeli";
import CategoryGrid from "@/components/CategoryGrid";
import MenuPickadeli from "@/components/MenuPickadeli";
import ClubSection from "@/components/ClubSection";
import LocationSection from "@/components/LocationSection";
import EventsSection from "@/components/EventsSection";
import SubscribeSection from "@/components/SubscribeSection";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative w-full overflow-x-hidden bg-[#FDF9F6]">
      <Navbar />
      <CartSidebar />
      <HeroPickadeli />
      <CategoryGrid />
      <MenuPickadeli />
      <ClubSection />
      <LocationSection />
      <EventsSection />
      <SubscribeSection />
      <Footer />
    </main>
  );
}
