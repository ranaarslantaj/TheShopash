import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import TrustStrip from '@/components/home/TrustStrip';
import ShopByBrand from '@/components/home/ShopByBrand';
import ShopByStyle from '@/components/home/ShopByStyle';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import StatsStrip from '@/components/home/StatsStrip';
import EditorialRow from '@/components/home/EditorialRow';
import SeoBlock from '@/components/home/SeoBlock';
import BestSellingCarousel from '@/components/home/BestSellingCarousel';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <BestSellingCarousel />
      <ShopByBrand />
      <FeaturedProducts />
      <TrustStrip />
      <ShopByStyle />
      <StatsStrip />
      <EditorialRow />
      <SeoBlock />
      <Footer />
    </main>
  );
}
