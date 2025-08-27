import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
// Removed Firebase imports - using localStorage instead
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
    margin-bottom: 2rem;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: bold;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const CTAButton = styled(Link)`
  background: #e74c3c;
  color: white;
  padding: 1rem 2rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  display: inline-block;
  transition: background-color 0.2s;
  
  &:hover {
    background: #c0392b;
  }
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const CategoryCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-decoration: none;
  color: #333;
  transition: all 0.3s ease;
  border: 1px solid #e0e7ff;
  min-height: 280px;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    border-color: #c7d2fe;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const SubcategoriesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
  width: 100%;
`;

const SubcategoryItem = styled.li`
  color: #666;
  font-size: 0.9rem;
  padding: 0.3rem 0;
  border-bottom: 1px solid #f0f0f0;
  transition: color 0.2s ease;
  
  &:hover {
    color: #e74c3c;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const CategoryIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  align-self: center;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const CategoryName = styled.h3`
  margin: 1rem 0 0 0;
  color: #1a1a1a;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: left;
  width: 100%;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const categories = [
  {
    name: 'Electronics',
    icon: '📱',
    path: '/category/electronics',
    subcategories: [
      'Smartphones',
      'Laptops & Computers',
      'Gaming Consoles',
      'Audio & Headphones',
      'Cameras',
      'Smart Home'
    ]
  },
  {
    name: 'Fashion',
    icon: '👕',
    path: '/category/fashion',
    subcategories: [
      'Men\'s Clothing',
      'Women\'s Clothing',
      'Shoes & Sneakers',
      'Accessories',
      'Watches',
      'Jewelry'
    ]
  },
  {
    name: 'Home & Garden',
    icon: '🏠',
    path: '/category/home-garden',
    subcategories: [
      'Furniture',
      'Home Decor',
      'Kitchen & Dining',
      'Garden & Outdoor',
      'Tools & Hardware',
      'Appliances'
    ]
  },
  {
    name: 'Sports & Outdoors',
    icon: '⚽',
    path: '/category/sports',
    subcategories: [
      'Fitness Equipment',
      'Outdoor Gear',
      'Team Sports',
      'Water Sports',
      'Winter Sports',
      'Athletic Wear'
    ]
  },
  {
    name: 'Collectibles & Art',
    icon: '🎨',
    path: '/category/collectibles',
    subcategories: [
      'Trading Cards',
      'Vintage Items',
      'Artwork & Prints',
      'Coins & Currency',
      'Stamps',
      'Memorabilia'
    ]
  },
  {
    name: 'Books & Media',
    icon: '📚',
    path: '/category/books',
    subcategories: [
      'Books & Textbooks',
      'Movies & TV',
      'Music & Vinyl',
      'Video Games',
      'Magazines',
      'Digital Media'
    ]
  },
  {
    name: 'Toys & Hobbies',
    icon: '🧸',
    path: '/category/toys',
    subcategories: [
      'Action Figures',
      'Board Games',
      'Model Kits',
      'RC & Drones',
      'Crafts & Supplies',
      'Educational Toys'
    ]
  },
  {
    name: 'Automotive',
    icon: '🚗',
    path: '/category/automotive',
    subcategories: [
      'Car Parts',
      'Motorcycle Parts',
      'Tools & Equipment',
      'Car Care',
      'Electronics',
      'Accessories'
    ]
  },
  {
    name: 'Health & Beauty',
    icon: '💄',
    path: '/category/health-beauty',
    subcategories: [
      'Skincare',
      'Makeup & Cosmetics',
      'Hair Care',
      'Health Supplements',
      'Fitness & Nutrition',
      'Personal Care'
    ]
  },
  {
    name: 'Business & Industrial',
    icon: '🏭',
    path: '/category/business',
    subcategories: [
      'Office Supplies',
      'Industrial Equipment',
      'Restaurant & Food Service',
      'Medical & Lab',
      'Construction',
      'Agriculture'
    ]
  },
  {
    name: 'Pet Supplies',
    icon: '🐕',
    path: '/category/pets',
    subcategories: [
      'Dog Supplies',
      'Cat Supplies',
      'Fish & Aquarium',
      'Bird Supplies',
      'Small Animals',
      'Pet Health'
    ]
  },
  {
    name: 'Everything Else',
    icon: '🌟',
    path: '/category/other',
    subcategories: [
      'Gift Cards',
      'Services',
      'Digital Products',
      'Specialty Items',
      'Wholesale Lots',
      'Miscellaneous'
    ]
  }
];

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // Get products from localStorage
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
          const allProducts: Product[] = JSON.parse(storedProducts);
          // Sort by createdAt desc and limit to 8
          const sortedProducts = allProducts
            .map(product => ({
              ...product,
              createdAt: product.createdAt instanceof Date ? product.createdAt : new Date(product.createdAt),
              updatedAt: product.updatedAt instanceof Date ? product.updatedAt : new Date(product.updatedAt)
            }))
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 8);
          
          setFeaturedProducts(sortedProducts);
        } else {
          setFeaturedProducts([]);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <HomeContainer>
      <HeroSection>
        <HeroTitle>Welcome to MarketPlace</HeroTitle>
        <HeroSubtitle>
          The subscription-based marketplace where sellers pay monthly fees, not per transaction.
          Buy and sell with confidence!
        </HeroSubtitle>
        <CTAButton to="/register">Start Selling Today</CTAButton>
      </HeroSection>

      <Section>
        <SectionTitle>Shop by Category</SectionTitle>
        <CategoriesGrid>
          {categories.map((category) => (
            <CategoryCard key={category.name} to={category.path}>
              <CategoryIcon>{category.icon}</CategoryIcon>
              <CategoryName>{category.name}</CategoryName>
              <SubcategoriesList>
                {category.subcategories.map((sub, index) => (
                  <SubcategoryItem key={index}>{sub}</SubcategoryItem>
                ))}
              </SubcategoriesList>
            </CategoryCard>
          ))}
        </CategoriesGrid>
      </Section>

      <Section>
        <SectionTitle>Featured Products</SectionTitle>
        {loading ? (
          <LoadingMessage>Loading featured products...</LoadingMessage>
        ) : featuredProducts.length > 0 ? (
          <ProductsGrid>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductsGrid>
        ) : (
          <LoadingMessage>
            No products available yet. <Link to="/register">Be the first seller!</Link>
          </LoadingMessage>
        )}
      </Section>
    </HomeContainer>
  );
};

export default Home;