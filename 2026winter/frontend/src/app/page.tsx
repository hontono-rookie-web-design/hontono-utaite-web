import Hero from "@/components/Hero";

import Footer from "@/components/Footer";
import Contact from "@/components/sections/Contact";
import RelatedLinks from "@/components/sections/RelatedLinks";
import ParticipationCardEntry from "@/components/sections/ParticipationCardEntry";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />

      <ParticipationCardEntry />

      <RelatedLinks />

      <Contact />

      <Footer />
    </main>
  );
}
