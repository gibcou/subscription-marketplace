import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Subscription from './pages/Subscription';
import SellerDashboard from './pages/SellerDashboard';
import BecomeSeller from './pages/BecomeSeller';
import { setSecurityHeaders } from './utils/security';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f8f9fa;
    color: #333;
    line-height: 1.6;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font-family: inherit;
  }

  input, select, textarea {
    font-family: inherit;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
`;

const Footer = styled.footer`
  background: #333;
  color: white;
  text-align: center;
  padding: 2rem;
  margin-top: 4rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-top: 2rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    font-size: 0.9rem;
  }
`;

function App() {
  useEffect(() => {
    // Initialize security headers and protections
    setSecurityHeaders();
    
    // Disable right-click context menu in production
    if (process.env.NODE_ENV === 'production') {
      document.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    // Disable F12 and other developer tools shortcuts in production
    if (process.env.NODE_ENV === 'production') {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.shiftKey && e.key === 'C') ||
            (e.ctrlKey && e.key === 'u')) {
          e.preventDefault();
        }
      });
    }
  }, []);

  return (
    <>
      <GlobalStyle />
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppContainer>
              <Header />
              <MainContent>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/become-seller" element={<BecomeSeller />} />
                  <Route path="/subscription" element={<Subscription />} />
                  <Route path="/seller/dashboard" element={<SellerDashboard />} />
                  {/* Add more routes as needed */}
                </Routes>
              </MainContent>
              <Footer>
                <p>&copy; 2024 MarketPlace. All rights reserved.</p>
                <p>The subscription-based marketplace with no transaction fees.</p>
              </Footer>
            </AppContainer>
          </Router>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App;
