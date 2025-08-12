import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const HeaderContainer = styled.header`
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #e74c3c;
  text-decoration: none;
  
  &:hover {
    color: #c0392b;
  }
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 600px;
  margin: 0 2rem;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #ddd;
  border-radius: 25px;
  font-size: 1rem;
  outline: none;
  
  &:focus {
    border-color: #e74c3c;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const Button = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.2s;
  
  &:hover {
    background: #c0392b;
  }
`;

const CartButton = styled(Button)`
  position: relative;
  background: #3498db;
  
  &:hover {
    background: #2980b9;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
`;

const UserMenu = styled.div`
  position: relative;
  display: inline-block;
`;

const UserButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  min-width: 200px;
  display: ${props => props.isOpen ? 'block' : 'none'};
  z-index: 1000;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">MarketPlace</Logo>
        
        <SearchContainer>
          <form onSubmit={handleSearch}>
            <SearchInput
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </SearchContainer>
        
        <NavLinks>
          {currentUser ? (
            <>
              <NavLink to="/cart">
                <CartButton>
                  Cart
                  {getItemCount() > 0 && (
                    <CartBadge>{getItemCount()}</CartBadge>
                  )}
                </CartButton>
              </NavLink>
              
              {currentUser.role === 'seller' && (
                <NavLink to="/seller/dashboard">Seller Dashboard</NavLink>
              )}
              
              <UserMenu>
                <UserButton onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                  {currentUser.displayName || currentUser.email}
                  <span>▼</span>
                </UserButton>
                <DropdownMenu isOpen={isUserMenuOpen}>
                  <DropdownItem onClick={() => { navigate('/profile'); setIsUserMenuOpen(false); }}>
                    Profile
                  </DropdownItem>
                  <DropdownItem onClick={() => { navigate('/orders'); setIsUserMenuOpen(false); }}>
                    My Orders
                  </DropdownItem>
                  {currentUser.role === 'seller' && (
                    <DropdownItem onClick={() => { navigate('/subscription'); setIsUserMenuOpen(false); }}>
                      Subscription
                    </DropdownItem>
                  )}
                  <DropdownItem onClick={handleLogout}>
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </UserMenu>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">
                <Button>Sign Up</Button>
              </NavLink>
            </>
          )}
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;