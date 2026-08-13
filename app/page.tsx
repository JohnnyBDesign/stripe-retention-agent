import Nav from '@/components/landing/Nav';
import Hero from '@/components/landing/Hero';
import ProductWindow from '@/components/landing/ProductWindow';
import WhyUs from '@/components/landing/WhyUs';
import HowItWorks from '@/components/landing/HowItWorks';
import Reasons from '@/components/landing/Reasons';
import Pricing from '@/components/landing/Pricing';
import FinalCta from '@/components/landing/FinalCta';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProductWindow />
        <WhyUs />
        <HowItWorks />
        <Reasons />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
