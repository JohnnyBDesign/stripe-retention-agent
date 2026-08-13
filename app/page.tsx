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
        <div className="relative">
          <div className="sticky top-0 h-screen">
            <HeroMahadeva />
          </div>
          <div className="relative z-20 bg-mint-light">
            <Manifesto />
          </div>
        </div>
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
