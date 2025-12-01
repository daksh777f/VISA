import { Header } from "@/components/marketing/header";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { TimelineDemo } from "@/components/marketing/timeline-demo";
import { Pricing } from "@/components/marketing/pricing";
import { About } from "@/components/marketing/about";
import { CTASection } from "@/components/marketing/cta-section";
import { Footer } from "@/components/marketing/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <TimelineDemo />
        <Pricing />
        <About />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
