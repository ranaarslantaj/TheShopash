import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CategorySection from '@/components/home/CategorySection';
import BrandStory from '@/components/home/BrandStory';
import Newsletter from '@/components/home/Newsletter';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <FeaturedProducts />
      <CategorySection />
      <BrandStory />
      <Newsletter />
      <Footer />
    </main>
  );
}
