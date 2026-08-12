import Nav from '@/components/landing/Nav';
import Hero from '@/components/landing/Hero';
import WhyUs from '@/components/landing/WhyUs';
import HowItWorks from '@/components/landing/HowItWorks';
import Compare from '@/components/landing/Compare';
import Pricing from '@/components/landing/Pricing';
import FinalCta from '@/components/landing/FinalCta';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-afterwhy-ink text-afterwhy-paper">
      <Nav />
      <Hero />
      <WhyUs />
      <HowItWorks />
      <Compare />
      <Pricing />
      <FinalCta />
      <Footer />
    </div>
  );
}
