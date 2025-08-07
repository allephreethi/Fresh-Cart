import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaPlus, FaMinus } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';
import CategoriesSection from '../components/Categories';
import ProductDetailModal from '../components/ProductDetailModal'; // ✅ import


const allProducts = [
  {
    id: 1,
    title: 'Fresh Apples (1kg)',
    price: 150,
    originalPrice: 200,
    quantity: '1kg',
    rating: 4.3,
    image: `${process.env.PUBLIC_URL}/img/fresh-apples.png`,
    description: 'Crisp and sweet apples, farm fresh and organically grown.',
    tags: ['New', 'Organic'],
    category: 'fruits',
    manufacturer: 'Local Farms',
    address: '123 Orchard Lane, Fruitville, USA',
    origin: 'USA',
    productionDate: '2025-01-15',
    ingredients: 'Fresh Apples',
    expiry: 'Best before 1 week from purchase.',
    nutrition: {
      calories: '52 kcal',
      protein: '0.3g',
      fat: '0.2g',
      carbs: '14g',
      vitamins: 'Vitamin C',
    },
  },
  {
    id: 2,
    title: 'Amul Milk 1L Pack',
    price: 65,
    quantity: '1L',
    rating: 4.6,
    image: `${process.env.PUBLIC_URL}/img/amul-milk-1l-pack.png`,
    description: 'Toned milk for your daily nutrition and health needs.',
    tags: ['Hot'],
    category: 'dairy',
    manufacturer: 'Amul',
    address: 'Anand, Gujarat, India',
    origin: 'India',
    productionDate: '2025-01-20',
    ingredients: 'Toned Milk',
    expiry: 'Best before 7 days from packaging date.',
    nutrition: {
      calories: '60 kcal',
      protein: '3.2g',
      fat: '3.5g',
      carbs: '4.7g',
      vitamins: 'Calcium, Vitamin D',
    },
  },
  {
    id: 3,
    title: 'Aashirvaad Atta 5kg',
    price: 240,
    originalPrice: 270,
    quantity: '5kg',
    rating: 4.5,
    image: `${process.env.PUBLIC_URL}/img/aashirvaad-atta-5kg.png`,
    description: 'Whole wheat flour for soft rotis and parathas.',
    tags: ['New'],
    category: 'packaged-food',
    manufacturer: 'Aashirvaad',
    address: 'Bangalore, Karnataka, India',
    origin: 'India',
    productionDate: '2025-01-15',
    ingredients: 'Whole Wheat Flour',
    expiry: 'Best before 6 months from packaging date.',
    nutrition: {
      calories: '340 kcal',
      protein: '10g',
      fat: '1.5g',
      carbs: '72g',
      vitamins: 'Iron, B Vitamins',
    },
  },
  {
    id: 4,
    title: 'Cadbury Dairy Milk Chocolate',
    price: 90,
    quantity: '150g',
    rating: 4.7,
    image: `${process.env.PUBLIC_URL}/img/cadbury-dairy-milk-chocolate.png`,
    description: 'Rich and creamy chocolate to sweeten your day.',
    tags: ['Hot'],
    category: 'packaged-food',
    manufacturer: 'Cadbury',
    address: 'Mumbai, Maharashtra, India',
    origin: 'India',
    productionDate: '2025-01-10',
    ingredients: 'Sugar, Cocoa Butter, Milk Solids',
    expiry: 'Best before 9 months from packaging date.',
    nutrition: {
      calories: '540 kcal',
      protein: '7.5g',
      fat: '30g',
      carbs: '60g',
      vitamins: 'Calcium',
    },
  },
  {
    id: 5,
    title: 'Country Eggs (6pcs)',
    price: 60,
    originalPrice: 75,
    quantity: '6 pcs',
    rating: 4.4,
    image: `${process.env.PUBLIC_URL}/img/country-eggs-6pcs.png`,
    description: 'Farm-fresh country eggs full of protein.',
    tags: ['Organic'],
    category: 'eggs',
    manufacturer: 'Local Farms',
    address: '456 Egg Lane, Farmtown, USA',
    origin: 'USA',
    productionDate: '2025-01-01',
    ingredients: 'Eggs',
    expiry: 'Best before 3 weeks from purchase.',
    nutrition: {
      calories: '155 kcal',
      protein: '13g',
      fat: '11g',
      carbs: '1g',
      vitamins: 'Vitamin D, B12',
    },
  },
  {
    id: 6,
    title: 'Everest Chicken Masala 100g',
    price: 55,
    quantity: '100g',
    rating: 4.3,
    image: `${process.env.PUBLIC_URL}/img/everest-chicken-masala-100g.png`,
    description: 'Flavorful masala for tasty chicken dishes.',
    tags: ['Spicy'],
    category: 'masalas',
    manufacturer: 'Everest',
    address: 'Mumbai, Maharashtra, India',
    origin: 'India',
    productionDate: '2025-08-15',
    ingredients: 'Spices, Salt',
    expiry: 'Best before 12 months from packaging date.',
    nutrition: {
      calories: '350 kcal',
      protein: '10g',
      fat: '5g',
      carbs: '60g',
      vitamins: 'Iron',
    },
  },
  {
    id: 7,
    title: 'California Almonds 500g',
    price: 399,
    originalPrice: 450,
    quantity: '500g',
    rating: 4.8,
    image: `${process.env.PUBLIC_URL}/img/california-almonds-500g.png`,
    description: 'Premium quality almonds for daily health.',
    tags: ['Hot', 'Organic'],
    category: 'dry-fruits',
    manufacturer: 'California Farms',
    address: 'California, USA',
    origin: 'USA',
    productionDate: '2025-08-20',
    ingredients: 'Almonds',
    expiry: 'Best before 12 months from packaging date.',
    nutrition: {
      calories: '575 kcal',
      protein: '21g',
      fat: '50g',
      carbs: '22g',
      vitamins: 'Vitamin E, Magnesium',
    },
  },
  {
    id: 8,
    title: 'Yummiez Chicken Nuggets 400g',
    price: 210,
    quantity: '400g',
    rating: 4.2,
    image: `${process.env.PUBLIC_URL}/img/yummiez-chicken-nuggets-400g.png`,
    description: 'Frozen and ready-to-fry crispy chicken nuggets.',
    tags: ['Hot'],
    category: 'frozen-food',
    manufacturer: 'Yummiez',
    address: 'Delhi, India',
    origin: 'India',
    productionDate: '2025-08-05',
    ingredients: 'Chicken, Bread Crumbs, Spices',
    expiry: 'Best before 6 months from packaging date.',
    nutrition: {
      calories: '300 kcal',
      protein: '15g',
      fat: '20g',
      carbs: '25g',
      vitamins: 'Iron',
    },
  },
  {
    id: 9,
    title: 'Parle-G Biscuits (800g)',
    price: 55,
    quantity: '800g',
    rating: 4.6,
    image: `${process.env.PUBLIC_URL}/img/parle-g-biscuits-800g.png`,
    description: 'Classic biscuits for tea-time munching.',
    tags: ['Classic'],
    category: 'biscuits',
    manufacturer: 'Parle',
    address: 'Mumbai, Maharashtra, India',
    origin: 'India',
    productionDate: '2025-08-12',
    ingredients: 'Wheat Flour, Sugar, Hydrogenated Fat',
    expiry: 'Best before 6 months from packaging date.',
    nutrition: {
      calories: '480 kcal',
      protein: '6g',
      fat: '20g',
      carbs: '70g',
      vitamins: 'Iron',
    },
  },
  {
    id: 10,
    title: 'Pepsi 1.25L',
    price: 45,
    originalPrice: 60,
    quantity: '1.25L',
    rating: 4.1,
    image: `${process.env.PUBLIC_URL}/img/pepsi-1-25l.png`,
    description: 'Chilled carbonated beverage for refreshment.',
    tags: ['Chilled'],
    category: 'cold-drinks',
    manufacturer: 'PepsiCo',
    address: 'Gurgaon, Haryana, India',
    origin: 'India',
    productionDate: '2025-08-20',
    ingredients: 'Carbonated Water, Sugar, Caffeine',
    expiry: 'Best before 9 months from packaging date.',
    nutrition: {
      calories: '150 kcal',
      protein: '0g',
      fat: '0g',
      carbs: '39g',
      vitamins: 'None',
    },
  },
  {
    id: 11,
    title: 'Lays Classic Salted Chips',
    price: 20,
    quantity: '52g',
    rating: 4.4,
    image: `${process.env.PUBLIC_URL}/img/lays-classic-salted-chips.png`,
    description: 'Crispy potato chips with classic salted flavor.',
    tags: ['Hot'],
    category: 'snacks',
    manufacturer: 'Lays',
    address: 'Mumbai, Maharashtra, India',
    origin: 'India',
    productionDate: '2025-08-18',
    ingredients: 'Potatoes, Vegetable Oil, Salt',
    expiry: 'Best before 6 months from packaging date.',
    nutrition: {
      calories: '280 kcal',
      protein: '3g',
      fat: '18g',
      carbs: '30g',
      vitamins: 'None',
    },
  },
  {
    id: 12,
    title: 'Tata Tea Gold 500g',
    price: 250,
    quantity: '500g',
    rating: 4.5,
    image: `${process.env.PUBLIC_URL}/img/tata-tea-gold.png`,
    description: 'Strong and flavorful tea blend.',
    tags: ['Refreshing'],
    category: 'tea-coffee',
    manufacturer: 'Tata',
    address: 'Mumbai, Maharashtra, India',
    origin: 'India',
    productionDate: '2025-08-25',
    ingredients: 'Tea Leaves',
    expiry: 'Best before 12 months from packaging date.',
    nutrition: {
      calories: '2 kcal',
      protein: '0g',
      fat: '0g',
      carbs: '0g',
      vitamins: 'None',
    },
  },
  {
    id: 13,
    title: 'Bru Instant Coffee 100g',
    price: 130,
    originalPrice: 150,
    quantity: '100g',
    rating: 4.6,
    image: `${process.env.PUBLIC_URL}/img/bru-instant-coffee-100g.png`,
    description: 'Instant coffee for a quick caffeine fix.',
    tags: ['Hot'],
    category: 'tea-coffee',
    manufacturer: 'Bru',
    address: 'Mumbai, Maharashtra, India',
    origin: 'India',
    productionDate: '2025-08-15',
    ingredients: 'Instant Coffee',
    expiry: 'Best before 12 months from packaging date.',
    nutrition: {
      calories: '0 kcal',
      protein: '0g',
      fat: '0g',
      carbs: '0g',
      vitamins: 'None',
    },
  },
  {
    id: 14,
    title: 'Frozen Green Peas 1kg',
    price: 95,
    quantity: '1kg',
    rating: 4.2,
    image: `${process.env.PUBLIC_URL}/img/frozen-green-peas.png`,
    description: 'Hygienically packed frozen green peas.',
    tags: ['Frozen'],
    category: 'frozen-food',
    manufacturer: 'Local Farms',
    address: '123 Green Lane, Veggie Town, USA',
    origin: 'USA',
    productionDate: '2025-08-10',
    ingredients: 'Green Peas',
    expiry: 'Best before 12 months from packaging date.',
    nutrition: {
      calories: '81 kcal',
      protein: '5g',
      fat: '0.4g',
      carbs: '14g',
      vitamins: 'Vitamin A, C',
    },
  },
  {
    id: 15,
    title: 'Amul Butter 500g',
    price: 280,
    quantity: '500g',
    rating: 4.9,
    image: `${process.env.PUBLIC_URL}/img/amul-butter-500g.png`,
    description: 'Rich, creamy butter for spreading and cooking.',
    tags: ['Dairy'],
    category: 'dairy',
    manufacturer: 'Amul',
    address: 'Anand, Gujarat, India',
    origin: 'India',
    productionDate: '2025-08-05',
    ingredients: 'Cream, Salt',
    expiry: 'Best before 6 months from packaging date.',
    nutrition: {
      calories: '717 kcal',
      protein: '1g',
      fat: '81g',
      carbs: '0.1g',
      vitamins: 'Vitamin A',
    },
  },
  {
    id: 16,
    title: 'Bananas (1 Dozen)',
    price: 55,
    quantity: '12 pcs',
    rating: 4.4,
    image: `${process.env.PUBLIC_URL}/img/bananas-1-dozen.png`,
    description: 'Naturally ripened bananas full of nutrients.',
    tags: ['Fresh'],
    category: 'fruits',
    manufacturer: 'Local Farms',
    address: '123 Orchard Lane, Fruitville, USA',
    origin: 'USA',
    productionDate: '2025-08-01',
    ingredients: 'Bananas',
    expiry: 'Best before 1 week from purchase.',
    nutrition: {
      calories: '89 kcal',
      protein: '1.1g',
      fat: '0.3g',
      carbs: '23g',
      vitamins: 'Vitamin B6, C',
    },
  },
  {
    id: 17,
    title: 'Kissan Mixed Fruit Jam 500g',
    price: 125,
    quantity: '500g',
    rating: 4.3,
    image: `${process.env.PUBLIC_URL}/img/kissan-mixed-fruit-jam-500g.png`,
    description: 'Sweet and tangy fruit jam for your toast.',
    tags: ['Kids'],
    category: 'packaged-food',
    manufacturer: 'Kissan',
    address: 'Mumbai, Maharashtra, India',
    origin: 'India',
    productionDate: '2025-08-10',
    ingredients: 'Sugar, Fruit Pulp, Pectin',
    expiry: 'Best before 12 months from packaging date.',
    nutrition: {
      calories: '250 kcal',
      protein: '0.5g',
      fat: '0g',
      carbs: '60g',
      vitamins: 'None',
    },
  },
  {
    id: 18,
    title: 'Haldiram Bhujia 200g',
    price: 60,
    quantity: '200g',
    rating: 4.6,
    image: `${process.env.PUBLIC_URL}/img/haldiram-bhujia-200g.png`,
    description: 'Crispy spicy bhujia snack for every mood.',
    tags: ['Spicy'],
    category: 'snacks',
    manufacturer: 'Haldiram',
    address: 'Delhi, India',
    origin: 'India',
    productionDate: '2025-08-15',
    ingredients: 'Gram Flour, Spices',
    expiry: 'Best before 6 months from packaging date.',
    nutrition: {
      calories: '500 kcal',
      protein: '15g',
      fat: '25g',
      carbs: '60g',
      vitamins: 'Iron',
    },
  },
  {
    id: 19,
    title: 'Britannia Good Day Cookies',
    price: 35,
    quantity: '250g',
    rating: 4.5,
    image: `${process.env.PUBLIC_URL}/img/britannia-good-day-cookies.png`,
    description: 'Crunchy and buttery cookies with cashews.',
    tags: ['Hot'],
    category: 'biscuits',
    manufacturer: 'Britannia',
    address: 'Mumbai, Maharashtra, India',
    origin: 'India',
    productionDate: '2025-08-20',
    ingredients: 'Wheat Flour, Sugar, Butter, Cashews',
    expiry: 'Best before 6 months from packaging date.',
    nutrition: {
      calories: '500 kcal',
      protein: '6g',
      fat: '25g',
      carbs: '65g',
      vitamins: 'Iron',
    },
  },
  {
    id: 20,
    title: 'Tata Salt 1kg',
    price: 22,
    quantity: '1kg',
    rating: 4.7,
    image: `${process.env.PUBLIC_URL}/img/tata-salt-1kg.png`,
    description: 'Iodized salt for daily cooking needs.',
    tags: ['Essential'],
    category: 'groceries',
    manufacturer: 'Tata',
    address: 'Mumbai, Maharashtra, India',
    origin: 'India',
    productionDate: '2025-08-01',
    ingredients: 'Iodized Salt',
    expiry: 'Best before 24 months from packaging date.',
    nutrition: {
      calories: '0 kcal',
      protein: '0g',
      fat: '0g',
      carbs: '0g',
      vitamins: 'None',
    },
  },

  {
    id: 21,
    title: 'Organic Cashews 250g',
    price: 210,
    quantity: '250g',
    rating: 4.5,
    image: `${process.env.PUBLIC_URL}/img/organic-cashews-250g.png`,
    description: 'Rich, creamy cashews with organic certification.',
    tags: ['Organic'],
    category: 'dry-fruits',
    manufacturer: 'Healthy Harvest Organics',
    address: 'Goa, India',
    origin: 'India',
    productionDate: '2025-05-15',
    ingredients: 'Organic Cashew Nuts',
    expiry: 'Best before 9 months from packaging date.',
    nutrition: {
      calories: '553 kcal',
      protein: '18g',
      fat: '44g',
      carbs: '30g',
      vitamins: 'Vitamin E, B6'
    }
  },
  
  {
    id: 23,
    title: 'Fortune Sunlite Refined Sunflower Oil (1L)',
    price: 130,
    quantity: '1L',
    rating: 4.4,
    image: `${process.env.PUBLIC_URL}/img/fortune-sunlite-refined-sunflower-oil-1l.png`,
    description: 'Healthy refined sunflower oil for everyday cooking.',
    tags: ['Popular', 'Value Pack'],
    category: 'groceries',
    manufacturer: 'Adani Wilmar Ltd.',
    address: 'Ahmedabad, Gujarat, India',
    origin: 'India',
    productionDate: '2025-05-10',
    ingredients: 'Refined Sunflower Oil, Antioxidant (E319)',
    expiry: 'Best before 12 months from packaging date.',
    nutrition: {
      calories: '900 kcal',
      protein: '0g',
      fat: '100g',
      carbs: '0g',
      vitamins: 'Vitamin E'
    }
  },
  {
    id: 24,
    title: 'India Gate Basmati Rice (5kg)',
    price: 500,
    originalPrice: 580,
    quantity: '5kg',
    rating: 4.6,
    image: `${process.env.PUBLIC_URL}/img/india-gate-basmati-rice-5kg.png`,
    description: 'Premium aged basmati rice for rich aroma and taste.',
    tags: ['Premium', 'Best Seller'],
    category: 'groceries',
    manufacturer: 'KRBL Limited',
    address: 'Noida, Uttar Pradesh, India',
    origin: 'India',
    productionDate: '2025-03-20',
    ingredients: 'Aged Basmati Rice',
    expiry: 'Best before 24 months from packaging date.',
    nutrition: {
      calories: '365 kcal',
      protein: '7g',
      fat: '0.5g',
      carbs: '80g',
      vitamins: 'B1 (Thiamine)'
    }
  },

  {
    id: 25,
    title: 'Organic Quinoa 500g',
    price: 300,
    quantity: '500g',
    rating: 4.5,
    image: `${process.env.PUBLIC_URL}/img/organic-quinoa-500g.png`,
    description: 'Nutritious organic quinoa, a great source of protein.',
    tags: ['Organic', 'Healthy'],
    category: 'groceries',
    manufacturer: 'Healthy Grains',
    address: 'Delhi, India',
    origin: 'India',
    productionDate: '2025-10-01',
    ingredients: 'Organic Quinoa',
    expiry: 'Best before 12 months from packaging date.',
    nutrition: {
      calories: '120 kcal',
      protein: '4g',
      fat: '2g',
      carbs: '21g',
      vitamins: 'B Vitamins',
    },
  },
  {
    id: 26,
    title: 'Oreo Cookies 154g',
    price: 80,
    quantity: '154g',
    rating: 4.8,
    image: `${process.env.PUBLIC_URL}/img/oreo-cookies-154g.png`,
    description: 'Delicious chocolate sandwich cookies with cream filling.',
    tags: ['Classic', 'Sweet'],
    category: 'biscuits',
    manufacturer: 'Oreo',
    address: 'Mumbai, Maharashtra, India',
    origin: 'India',
    productionDate: '2025-08-15',
    ingredients: 'Wheat Flour, Sugar, Cocoa, Palm Oil',
    expiry: 'Best before 6 months from packaging date.',
    nutrition: {
      calories: '480 kcal',
      protein: '4g',
      fat: '22g',
      carbs: '72g',
      vitamins: 'None',
    },
  },
  {
    id: 27,
    title: 'Nutella Hazelnut Spread 350g',
    price: 450,
    quantity: '350g',
    rating: 4.9,
    image: `${process.env.PUBLIC_URL}/img/nutella-hazelnut-spread-350g.png`,
    description: 'Creamy hazelnut spread with cocoa for a delightful taste.',
    tags: ['Sweet', 'Popular'],
    category: 'packaged-food',
    manufacturer: 'Ferrero',
    address: 'Pune, Maharashtra, India',
    origin: 'Italy',
    productionDate: '2025-08-20',
    ingredients: 'Sugar, Palm Oil, Hazelnuts, Cocoa',
    expiry: 'Best before 12 months from packaging date.',
    nutrition: {
      calories: '539 kcal',
      protein: '6g',
      fat: '30g',
      carbs: '57g',
      vitamins: 'None',
    },
  },
  {
    id: 28,
    title: 'Green Tea Bags 25 pcs',
    price: 150,
    quantity: '25 pcs',
    rating: 4.5,
    image: `${process.env.PUBLIC_URL}/img/green-tea-bags-25pcs.png`,
    description: 'Refreshing green tea bags for a healthy lifestyle.',
    tags: ['Healthy', 'Refreshing'],
    category: 'tea-coffee',
    manufacturer: 'Tea Co.',
    address: 'Mumbai, Maharashtra, India',
    origin: 'China',
    productionDate: '2025-08-10',
    ingredients: 'Green Tea Leaves',
    expiry: 'Best before 12 months from packaging date.',
    nutrition: {
      calories: '0 kcal',
      protein: '0g',
      fat: '0g',
      carbs: '0g',
      vitamins: 'None',
    },
  },
  {
    id: 29,
    title: 'Pasta (500g)',
    price: 100,
    quantity: '500g',
    rating: 4.4,
    image: `${process.env.PUBLIC_URL}/img/pasta-500g.png`,
    description: 'Delicious pasta for your favorite Italian dishes.',
    tags: ['Popular', 'Quick Meal'],
    category: 'groceries',
    manufacturer: 'Pasta Co.',
    address: 'Bangalore, Karnataka, India',
    origin: 'Italy',
    productionDate: '2025-08-15',
    ingredients: 'Durum Wheat Semolina',
    expiry: 'Best before 24 months from packaging date.',
    nutrition: {
      calories: '350 kcal',
      protein: '12g',
      fat: '1.5g',
      carbs: '70g',
      vitamins: 'None',
    },
  },
  {
    id: 30,
    title: 'Coconut Oil 500ml',
    price: 200,
    quantity: '500ml',
    rating: 4.6,
    image: `${process.env.PUBLIC_URL}/img/coconut-oil-500ml.png`,
    description: 'Pure coconut oil for cooking and skin care.',
    tags: ['Natural', 'Healthy'],
    category: 'groceries',
    manufacturer: 'Coconut Co.',
    address: 'Kerala, India',
    origin: 'India',
    productionDate: '2025-08-05',
    ingredients: 'Coconut Oil',
    expiry: 'Best before 12 months from packaging date.',
    nutrition: {
      calories: '900 kcal',
      protein: '0g',
      fat: '100g',
      carbs: '0g',
      vitamins: 'Vitamin E',
    },
  },
  {
    id: 31,
    title: 'Frozen Mixed Vegetables 1kg',
    price: 120,
    quantity: '1kg',
    rating: 4.3,
    image: `${process.env.PUBLIC_URL}/img/frozen-mixed-vegetables-1kg.png`,
    description: 'Convenient frozen mixed vegetables for quick meals.',
    tags: ['Frozen', 'Healthy'],
    category: 'frozen-food',
    manufacturer: 'Local Farms',
    address: 'Delhi, India',
    origin: 'India',
    productionDate: '2025-08-10',
    ingredients: 'Carrots, Peas, Corn, Beans',
    expiry: 'Best before 12 months from packaging date.',
    nutrition: {
      calories: '50 kcal',
      protein: '3g',
      fat: '0.5g',
      carbs: '10g',
      vitamins: 'Vitamin A, C',
    },
  },
  {
    id: 32,
    title: 'Almond Milk 1L',
    price: 150,
    quantity: '1L',
    rating: 4.5,
    image: `${process.env.PUBLIC_URL}/img/almond-milk-1l.png`,
    description: 'Nutritious almond milk, a dairy alternative.',
    tags: ['Vegan', 'Healthy'],
    category: 'dairy',
    manufacturer: 'Nut Milk Co.',
    address: 'Mumbai, Maharashtra, India',
    origin: 'India',
    productionDate: '2025-08-20',
    ingredients: 'Almonds, Water, Sugar',
    expiry: 'Best before 7 days from packaging date.',
    nutrition: {
      calories: '30 kcal',
      protein: '1g',
      fat: '2.5g',
      carbs: '1g',
      vitamins: 'Vitamin E',
    },
  },
  {
    id: 33,
    title: 'Honey 250g',
    price: 250,
    quantity: '250g',
    rating: 4.8,
    image: `${process.env.PUBLIC_URL}/img/honey-250g.png`,
    description: 'Pure and natural honey for sweetening.',
    tags: ['Natural', 'Sweet'],
    category: 'groceries',
    manufacturer: 'Honey Co.',
    address: 'Himachal Pradesh, India',
    origin: 'India',
    productionDate: '2025-08-15',
    ingredients: 'Pure Honey',
    expiry: 'Best before 12 months from packaging date.',
    nutrition: {
      calories: '304 kcal',
      protein: '0.3g',
      fat: '0g',
      carbs: '82g',
      vitamins: 'None',
    },
  },
  {
    id: 34,
    title: 'Chia Seeds 250g',
    price: 350,
    quantity: '250g',
    rating: 4.7,
    image: `${process.env.PUBLIC_URL}/img/chia-seeds-250g.png`,
    description: 'Nutritious chia seeds for smoothies and baking.',
    tags: ['Healthy', 'Superfood'],
    category: 'groceries',
    manufacturer: 'Superfood Co.',
    address: 'Delhi, India',
    origin: 'Mexico',
    productionDate: '2025-08-10',
    ingredients: 'Chia Seeds',
    expiry: 'Best before 12 months from packaging date.',
    nutrition: {
      calories: '486 kcal',
      protein: '16g',
      fat: '31g',
      carbs: '42g',
      vitamins: 'B Vitamins',
    },
  },
  // Continue from existing products list...
  {
    id: 35,
    title: 'Organic Peanut Butter 340g',
    price: 220,
    quantity: '340g',
    rating: 4.7,
    image: `${process.env.PUBLIC_URL}/img/organic-peanut-butter-340g.png`,
    description: 'Creamy organic peanut butter with no added sugar or oils',
    tags: ['Organic', 'Healthy', 'Protein-Rich'],
    category: 'packaged-food',
    manufacturer: 'Earth’s Best',
    address: 'Bangalore, Karnataka, India',
    origin: 'India',
    productionDate: '2025-9-01',
    ingredients: 'Organic Peanuts, Himalayan Salt',
    expiry: 'Best before 6 months after opening',
    nutrition: {
      calories: '588 kcal',
      protein: '25g',
      fat: '50g',
      carbs: '20g',
      vitamins: 'Vitamin E, B6'
    }
  },
  {
    id: 36,
    title: 'Protein Bars (Pack of 5)',
    price: 350,
    quantity: '5 x 60g',
    rating: 4.5,
    image: `${process.env.PUBLIC_URL}/img/protein-bars-5pack.png`,
    description: 'High protein nutrition bars with almond and dark chocolate',
    tags: ['High-Protein', 'Energy'],
    category: 'snacks',
    manufacturer: 'MuscleBlaze',
    address: 'Mumbai, Maharashtra, India',
    origin: 'India',
    productionDate: '2025-10-15',
    ingredients: 'Whey Protein, Almonds, Dark Chocolate, Dates',
    expiry: 'Best before 9 months from packaging date',
    nutrition: {
      calories: '250 kcal',
      protein: '20g',
      fat: '12g',
      carbs: '22g',
      vitamins: 'Vitamin B12'
    }
  },
  {
    id: 37,
    title: 'Cold-Pressed Extra Virgin Olive Oil 500ml',
    price: 450,
    originalPrice: 550,
    quantity: '500ml',
    rating: 4.8,
    image: `${process.env.PUBLIC_URL}/img/olive-oil-500ml.png`,
    description: 'Premium quality Italian cold-pressed olive oil',
    tags: ['Premium', 'Heart-Healthy'],
    category: 'groceries',
    manufacturer: 'Borges',
    address: 'Gurgaon, Haryana, India',
    origin: 'Italy',
    productionDate: '2025-08-20',
    ingredients: 'Extra Virgin Olive Oil',
    expiry: 'Best before 18 months from packaging date',
    nutrition: {
      calories: '884 kcal',
      protein: '0g',
      fat: '100g',
      carbs: '0g',
      vitamins: 'Vitamin E, K'
    }
  }
];




const tagList = ['New', 'Hot', 'Organic'];

export default function Products() {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const searchQueryFromURL = searchParams.get('search')?.toLowerCase() || '';
  const categoryFromURL = searchParams.get('category') || 'all-products';

  const [selectedCategory, setSelectedCategory] = useState(categoryFromURL);
  const [priceRange, setPriceRange] = useState(500);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [searchQueryState, setSearchQueryState] = useState(searchQueryFromURL);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const {
    toggleWishlistItem,
    isInWishlist,
    addToCart,
    updateQuantity,
    cartItems,
  } = useAppContext();

  useEffect(() => {
    setSelectedCategory(categoryFromURL);
    setPriceRange(500);
    setSelectedTags([]);
    setSortOption('');
    setSearchQueryState(searchQueryFromURL);
  }, [location.pathname, location.search]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredProducts = allProducts
    .filter((p) => {
      const matchesCategory =
        selectedCategory === 'all-products' || p.category === selectedCategory;
      const matchesPrice = p.price <= priceRange;
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => p.tags.includes(tag));
      const matchesSearch =
        !searchQueryState ||
        p.title.toLowerCase().includes(searchQueryState) ||
        p.description.toLowerCase().includes(searchQueryState);
      return matchesCategory && matchesPrice && matchesTags && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  return (
    <div className="p-4">
      <CategoriesSection onCategorySelect={(slug) => setSelectedCategory(slug)} />

      {/* Active Filter Chips */}
      {(selectedTags.length > 0 || priceRange < 500 || sortOption) && (
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
          {selectedTags.map((tag) => (
            <span key={tag} className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
          {priceRange < 500 && (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
              Under ₹{priceRange}
            </span>
          )}
          {sortOption && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {sortOption.replace('-', ' ')}
            </span>
          )}
          <button
            onClick={() => {
              setPriceRange(500);
              setSelectedTags([]);
              setSortOption('');
            }}
            className="text-red-500 ml-auto hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Filters */}
      <motion.div
        className="bg-white shadow rounded-lg p-3 mb-6 text-sm grid grid-cols-1 md:grid-cols-3 gap-4 sticky top-14 z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col gap-1">
          <label className="text-[#5E936C] font-semibold text-sm uppercase tracking-wide">
            Max Price
          </label>
          <input
            type="range"
            min="0"
            max="500"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="accent-green-600 h-1"
          />
          <span className="text-green-700 font-semibold text-xs">
            ₹{priceRange}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[#5E936C] font-semibold text-sm uppercase tracking-wide">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {tagList.map((tag) => (
              <motion.button
                key={tag}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => toggleTag(tag)}
                className={`px-2 py-1 rounded-full border text-xs transition font-medium ${
                  selectedTags.includes(tag)
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-gray-100 text-gray-800 hover:bg-green-100'
                }`}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[#5E936C] font-semibold text-sm uppercase tracking-wide">
            Sort By
          </label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="">Default</option>
            <option value="price-low">⬇️ Price: Low to High</option>
            <option value="price-high">⬆️ Price: High to Low</option>
            <option value="rating">⭐ Rating</option>
          </select>
        </div>
      </motion.div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => {
          const isWished = isInWishlist(product.id);
          const cartItem = cartItems.find((item) => item.id === product.id);
          const quantity = cartItem ? cartItem.quantity : 0;

          return (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative rounded-xl shadow hover:shadow-md transition-all p-3 flex flex-col justify-between overflow-hidden bg-white cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlistItem(product);
                }}
                className={`absolute top-2 left-2 z-10 ${
                  isWished ? 'text-red-500' : 'text-gray-300'
                } hover:text-red-600 transition-colors`}
              >
                <FaHeart size={14} />
              </button>

              <img
                src={product.image}
                alt={product.title}
                className="w-full h-36 object-contain mb-2 rounded"
              />

              <h3 className="font-semibold text-xs text-[#3E5F44]">{product.title}</h3>
              <p className="text-xs text-gray-700 mt-1 line-clamp-2">{product.description}</p>

              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-gray-800">{product.rating.toFixed(1)} rating</span>
                <span className="text-[#5E936C] font-medium">{product.quantity}</span>
              </div>

              <div className="flex justify-between items-center mt-2">
                <div className="flex flex-col">
                  {product.originalPrice && product.originalPrice > product.price ? (
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400 line-through text-xs">
                        ₹{product.originalPrice}
                      </span>
                      <span className="text-green-800 font-bold text-sm">
                        ₹{product.price}
                      </span>
                    </div>
                  ) : (
                    <span className="text-green-800 font-bold text-sm">
                      ₹{product.price}
                    </span>
                  )}
                </div>

                {quantity > 0 ? (
                  <div
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => updateQuantity(product.id, -1)}
                      className="bg-[#5E936C] text-white p-1 text-xs rounded hover:bg-[#3E5F44]"
                    >
                      <FaMinus size={10} />
                    </button>
                    <span className="px-1 text-sm">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, 1)}
                      className="bg-[#5E936C] text-white p-1 text-xs rounded hover:bg-[#3E5F44]"
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="bg-[#5E936C] text-white px-3 py-1 text-xs rounded hover:bg-[#3E5F44] transition"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
