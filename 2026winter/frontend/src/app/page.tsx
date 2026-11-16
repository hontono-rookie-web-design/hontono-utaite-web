import Hero from "@/components/Hero";

import Footer from "@/components/Footer";
import Contact from "@/components/sections/Contact";
import RelatedLinks from "@/components/sections/RelatedLinks";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />

      <RelatedLinks />

      <Contact />

      <Footer />
    </main>
  );
}
