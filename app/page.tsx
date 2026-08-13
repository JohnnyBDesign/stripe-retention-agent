import Nav from '@/components/landing/Nav';
import HeroMahadeva from '@/components/landing-v2/HeroMahadeva';
import Manifesto from '@/components/landing-v2/Manifesto';
import Features from '@/components/landing-v2/Features';
import CaseStudies from '@/components/landing-v2/CaseStudies';
import Stats from '@/components/landing-v2/Stats';
import Marquee from '@/components/landing-v2/Marquee';
import Testimonials from '@/components/landing-v2/Testimonials';
import BeforeAfter from '@/components/landing-v2/BeforeAfter';
import PricingMahadeva from '@/components/landing-v2/PricingMahadeva';
import FAQ from '@/components/landing-v2/FAQ';
import FooterMahadeva from '@/components/landing-v2/FooterMahadeva';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <HeroMahadeva />
        <Manifesto />
        <Features />
        <CaseStudies />
        <Stats />
        <Marquee />
        <Testimonials />
        <BeforeAfter />
        <PricingMahadeva />
        <FAQ />
      </main>
      <FooterMahadeva />
    </>
  );
}
