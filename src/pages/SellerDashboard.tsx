import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Product, Order } from '../types';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  color: #333;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    text-align: center;
  }
`;

const AddProductButton = styled(Link)`
  background: #e74c3c;
  color: white;
  padding: 1rem 2rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.2s;
  text-align: center;
  
  &:hover {
    background: #c0392b;
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 1.5rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #e74c3c;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const Section = styled.section`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const SectionHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: #333;
`;

const SectionContent = styled.div`
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
    overflow-x: auto;
  }
`;

const ProductsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 1rem;
  border-bottom: 2px solid #eee;
  color: #333;
  font-weight: 600;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const TableRow = styled.tr`
  &:hover {
    background: #f8f9fa;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
`;

const ProductPlaceholder = styled.div`
  width: 50px;
  height: 50px;
  background: #f0f0f0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  background: ${props => {
    switch (props.status) {
      case 'active': return '#27ae60';
      case 'sold': return '#3498db';
      case 'inactive': return '#95a5a6';
      default: return '#95a5a6';
    }
  }};
`;

const ActionButton = styled.button`
  background: none;
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: all 0.2s;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &.edit {
    color: #3498db;
    border-color: #3498db;
    
    &:hover {
      background: #3498db;
      color: white;
    }
  }
  
  &.delete {
    color: #e74c3c;
    border-color: #e74c3c;
    
    &:hover {
      background: #e74c3c;
      color: white;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const SellerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });



  const fetchSellerData = useCallback(async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      
      // Fetch products
      const productsQuery = query(
        collection(db, 'products'),
        where('sellerId', '==', currentUser.id)
      );
      const productsSnapshot = await getDocs(productsQuery);
      const productsData: Product[] = [];
      
      productsSnapshot.forEach((doc) => {
        const data = doc.data();
        productsData.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Product);
      });
      
      setProducts(productsData);

      // Fetch orders
      const ordersQuery = query(
        collection(db, 'orders'),
        where('sellerId', '==', currentUser.id)
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      const ordersData: Order[] = [];
      
      ordersSnapshot.forEach((doc) => {
        const data = doc.data();
        ordersData.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Order);
      });
      
      setOrders(ordersData);

      // Calculate stats
      const activeProducts = productsData.filter(p => p.status === 'active').length;
      const totalRevenue = ordersData.reduce((sum, order) => sum + order.totalPrice, 0);
      
      setStats({
        totalProducts: productsData.length,
        activeProducts,
        totalOrders: ordersData.length,
        totalRevenue
      });
    } catch (error) {
      console.error('Error fetching seller data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (currentUser.role !== 'seller') {
      navigate('/');
      return;
    }

    fetchSellerData();
  }, [currentUser, navigate, fetchSellerData]);

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'products', productId));
      setProducts(products.filter(p => p.id !== productId));
      setStats(prev => ({
        ...prev,
        totalProducts: prev.totalProducts - 1,
        activeProducts: prev.activeProducts - (products.find(p => p.id === productId)?.status === 'active' ? 1 : 0)
      }));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>Seller Dashboard</Title>
        <AddProductButton to="/seller/add-product">Add New Product</AddProductButton>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatValue>{stats.totalProducts}</StatValue>
          <StatLabel>Total Products</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.activeProducts}</StatValue>
          <StatLabel>Active Products</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.totalOrders}</StatValue>
          <StatLabel>Total Orders</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{formatPrice(stats.totalRevenue)}</StatValue>
          <StatLabel>Total Revenue</StatLabel>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionHeader>
          <SectionTitle>My Products</SectionTitle>
          <Link to="/seller/add-product">Add Product</Link>
        </SectionHeader>
        <SectionContent>
          {loading ? (
            <LoadingState>Loading products...</LoadingState>
          ) : products.length > 0 ? (
            <ProductsTable>
              <thead>
                <tr>
                  <TableHeader>Product</TableHeader>
                  <TableHeader>Price</TableHeader>
                  <TableHeader>Quantity</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Created</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {product.images && product.images.length > 0 ? (
                          <ProductImage src={product.images[0]} alt={product.title} />
                        ) : (
                          <ProductPlaceholder>📦</ProductPlaceholder>
                        )}
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{product.title}</div>
                          <div style={{ color: '#666', fontSize: '0.9rem' }}>
                            {product.category}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      <StatusBadge status={product.status}>
                        {product.status.toUpperCase()}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      {product.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <ActionButton 
                        className="edit"
                        onClick={() => navigate(`/seller/edit-product/${product.id}`)}
                      >
                        Edit
                      </ActionButton>
                      <ActionButton 
                        className="delete"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </ActionButton>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </ProductsTable>
          ) : (
            <EmptyState>
              <h3>No products yet</h3>
              <p>Start by adding your first product to begin selling!</p>
              <AddProductButton to="/seller/add-product">Add Your First Product</AddProductButton>
            </EmptyState>
          )}
        </SectionContent>
      </Section>
    </DashboardContainer>
  );
};

export default SellerDashboard;