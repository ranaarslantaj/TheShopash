import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import TrustStrip from '@/components/home/TrustStrip';
import ShopByBrand from '@/components/home/ShopByBrand';
import ShopByGender from '@/components/home/ShopByGender';
import ShopByStyle from '@/components/home/ShopByStyle';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import StatsStrip from '@/components/home/StatsStrip';
import EditorialRow from '@/components/home/EditorialRow';
import SeoBlock from '@/components/home/SeoBlock';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <TrustStrip />
      <ShopByBrand />
      <ShopByGender />
      <FeaturedProducts />
      <ShopByStyle />
      <StatsStrip />
      <EditorialRow />
      <SeoBlock />
      <Footer />
    </main>
  );
}
