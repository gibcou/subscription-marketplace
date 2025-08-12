import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 200px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
              linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
              linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 3rem;
`;

const CardContent = styled.div`
  padding: 1rem;
  
  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

const ProductTitle = styled(Link)`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  text-decoration: none;
  display: block;
  margin-bottom: 0.5rem;
  
  &:hover {
    color: #e74c3c;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const ProductPrice = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #e74c3c;
  margin-bottom: 0.5rem;
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const ProductCondition = styled.span`
  background: #f8f9fa;
  color: #666;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  text-transform: capitalize;
`;

const CardActions = styled.div`
  padding: 0 1rem 1rem;
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    padding: 0 0.75rem 0.75rem;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const Button = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
  
  @media (max-width: 480px) {
    padding: 0.6rem;
    font-size: 0.9rem;
  }
`;

const AddToCartButton = styled(Button)`
  background: #e74c3c;
  color: white;
  
  &:hover {
    background: #c0392b;
  }
  
  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
`;

const ViewButton = styled(Button)`
  background: #3498db;
  color: white;
  
  &:hover {
    background: #2980b9;
  }
`;

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { currentUser } = useAuth();

  const handleAddToCart = () => {
    if (product.quantity > 0) {
      addItem(product, 1);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const isOutOfStock = product.quantity === 0;
  const isOwnProduct = currentUser?.id === product.sellerId;

  return (
    <Card>
      <ImageContainer>
        {product.images && product.images.length > 0 ? (
          <ProductImage src={product.images[0]} alt={product.title} />
        ) : (
          <PlaceholderImage>📦</PlaceholderImage>
        )}
      </ImageContainer>
      
      <CardContent>
        <ProductTitle to={`/product/${product.id}`}>
          {product.title}
        </ProductTitle>
        
        <ProductPrice>{formatPrice(product.price)}</ProductPrice>
        
        <ProductCondition>{product.condition}</ProductCondition>
        
        {isOutOfStock && (
          <div style={{ color: '#e74c3c', fontWeight: 'bold', marginTop: '0.5rem' }}>
            Out of Stock
          </div>
        )}
      </CardContent>
      
      <CardActions>
        <ViewButton as={Link} to={`/product/${product.id}`}>
          View Details
        </ViewButton>
        
        {!isOwnProduct && (
          <AddToCartButton 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </AddToCartButton>
        )}
      </CardActions>
    </Card>
  );
};

export default ProductCard;