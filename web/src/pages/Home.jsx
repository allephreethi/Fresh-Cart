import Banner from '../components/Banner';
import Categories from '../components/Categories';
import Products from '../components/Products';
import Deals from '../components/Deals';
import Features from '../components/Features';

export default function Home() {
  return (
    <div className="space-y-8">
      <Banner />
      <Categories />
      <Products title="Popular Grocery Picks" limit={11} />
      <Deals />
      <Features />
    </div>
  );
}
