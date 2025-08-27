import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
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
  background: white;
  color: #e74c3c;
  padding: 1rem 2rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  display: inline-block;
  transition: all 0.2s;
  
  &:hover {
    background: #f8f9fa;
    transform: translateY(-2px);
  }
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const CategorySection = styled.section`
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%);
  margin-bottom: 3rem;
  border-radius: 12px;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
    margin-bottom: 2rem;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const CategoryCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const CategoryIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
`;

const CategoryTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #333;
`;

const CategoryDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
`;

const BenefitCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const BenefitIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
`;

const BenefitTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #333;
`;

const BenefitDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const StepsSection = styled.div`
  background: #f8f9fa;
  padding: 3rem 2rem;
  border-radius: 12px;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
    margin-bottom: 2rem;
  }
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const StepCard = styled.div`
  text-align: center;
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 1rem;
`;

const StepTitle = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const StepDescription = styled.p`
  color: #666;
  line-height: 1.5;
`;

const PricingSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 3rem 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
    margin-bottom: 2rem;
  }
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const PricingCard = styled.div<{ isPopular?: boolean }>`
  background: white;
  border: 3px solid ${props => props.isPopular ? '#f39c12' : '#ddd'};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #f39c12;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
`;

const PlanName = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const PlanPrice = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #e74c3c;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const PlanPeriod = styled.div`
  color: #666;
  margin-bottom: 2rem;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
`;

const Feature = styled.li`
  padding: 0.5rem 0;
  color: #333;
  
  &:before {
    content: '✓';
    color: #27ae60;
    font-weight: bold;
    margin-right: 0.5rem;
  }
`;

const FAQSection = styled.div`
  background: #f8f9fa;
  padding: 3rem 2rem;
  border-radius: 12px;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const FAQItem = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const FAQQuestion = styled.h4`
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

const FAQAnswer = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 0;
`;

const benefits = [
  {
    icon: '💰',
    title: 'No Transaction Fees',
    description: 'Keep 100% of your sales revenue. Pay only a simple monthly or yearly subscription fee.'
  },
  {
    icon: '📈',
    title: 'Unlimited Listings',
    description: 'List as many products as you want with no additional costs or restrictions.'
  },
  {
    icon: '🎯',
    title: 'Advanced Dashboard',
    description: 'Track your sales, manage inventory, and analyze performance with our comprehensive seller tools.'
  },
  {
    icon: '🚀',
    title: 'Marketing Support',
    description: 'Get featured listings and promotional opportunities to boost your sales.'
  },
  {
    icon: '🛡️',
    title: 'Secure Platform',
    description: 'Built-in security features and buyer protection to ensure safe transactions.'
  },
  {
    icon: '📞',
    title: 'Dedicated Support',
    description: 'Get help when you need it with our responsive customer support team.'
  }
];

const steps = [
  {
    number: 1,
    title: 'Sign Up',
    description: 'Create your seller account with basic information and verify your email.'
  },
  {
    number: 2,
    title: 'Choose Plan',
    description: 'Select between monthly or yearly subscription plans that fit your needs.'
  },
  {
    number: 3,
    title: 'Set Up Store',
    description: 'Complete your seller profile and customize your store settings.'
  },
  {
    number: 4,
    title: 'Start Selling',
    description: 'Add your products and start reaching thousands of potential customers.'
  }
];

const plans = [
  {
    name: 'Monthly Plan',
    price: 29.99,
    period: 'per month',
    features: [
      'Unlimited product listings',
      'No transaction fees',
      'Basic seller dashboard',
      'Email support',
      'Standard product photos (up to 5 per listing)'
    ]
  },
  {
    name: 'Yearly Plan',
    price: 299.99,
    period: 'per year',
    popular: true,
    features: [
      'Unlimited product listings',
      'No transaction fees',
      'Advanced seller dashboard',
      'Priority email & phone support',
      'Enhanced product photos (up to 10 per listing)',
      'Featured listing opportunities',
      'Advanced analytics',
      '2 months free (save $60)'
    ]
  }
];

const faqs = [
  {
    question: 'How is this different from other marketplaces?',
    answer: 'Unlike traditional marketplaces that charge transaction fees (typically 8-15%), we charge only a simple subscription fee. This means you keep 100% of your sales revenue, making it more profitable for active sellers.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and bank transfers for subscription payments. For customer purchases, we support credit cards, PayPal, and other secure payment methods.'
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time. Your account will remain active until the end of your current billing period, and you won\'t be charged for the next period.'
  },
  {
    question: 'Is there a setup fee or hidden costs?',
    answer: 'No setup fees or hidden costs. The subscription fee is all you pay to sell on our platform. We believe in transparent pricing.'
  },
  {
    question: 'How do I get paid for my sales?',
    answer: 'Payments from customers go directly to your connected payment account (PayPal, Stripe, etc.). We don\'t hold your money - you receive payments as soon as customers complete their purchases.'
  },
  {
    question: 'What kind of products can I sell?',
    answer: 'You can sell most physical and digital products, excluding prohibited items like weapons, illegal substances, or copyrighted materials. Check our seller guidelines for the complete list.'
  }
];

const BecomeSeller: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <PageContainer>
      <HeroSection>
        <HeroTitle>Start Your Card Selling Journey</HeroTitle>
        <HeroSubtitle>
          Join thousands of successful card sellers on our platform. No transaction fees, just unlimited potential.
        </HeroSubtitle>
        {currentUser ? (
          currentUser.role === 'seller' ? (
            <CTAButton to="/seller/dashboard">Go to Dashboard</CTAButton>
          ) : (
            <CTAButton to="/subscription">Choose Your Plan</CTAButton>
          )
        ) : (
          <CTAButton to="/register">Get Started Today</CTAButton>
        )}
      </HeroSection>

      <CategorySection>
        <SectionTitle>Card Categories We Support</SectionTitle>
        <CategoryGrid>
          <CategoryCard>
            <CategoryIcon>🃏</CategoryIcon>
            <CategoryTitle>Trading Cards</CategoryTitle>
            <CategoryDescription>
              Pokemon, Yu-Gi-Oh!, Magic: The Gathering, and other popular TCGs
            </CategoryDescription>
          </CategoryCard>
          <CategoryCard>
            <CategoryIcon>⚾</CategoryIcon>
            <CategoryTitle>Sports Cards</CategoryTitle>
            <CategoryDescription>
              Baseball, Basketball, Football, Soccer, and other sports memorabilia
            </CategoryDescription>
          </CategoryCard>
          <CategoryCard>
            <CategoryIcon>🎮</CategoryIcon>
            <CategoryTitle>Gaming Cards</CategoryTitle>
            <CategoryDescription>
              Digital game cards, collectible gaming items, and virtual assets
            </CategoryDescription>
          </CategoryCard>
          <CategoryCard>
            <CategoryIcon>🎨</CategoryIcon>
            <CategoryTitle>Art Cards</CategoryTitle>
            <CategoryDescription>
              Artist trading cards, custom artwork, and limited edition prints
            </CategoryDescription>
          </CategoryCard>
          <CategoryCard>
            <CategoryIcon>📚</CategoryIcon>
            <CategoryTitle>Educational Cards</CategoryTitle>
            <CategoryDescription>
              Flash cards, study materials, and educational content cards
            </CategoryDescription>
          </CategoryCard>
          <CategoryCard>
            <CategoryIcon>🎪</CategoryIcon>
            <CategoryTitle>Novelty Cards</CategoryTitle>
            <CategoryDescription>
              Unique collectibles, vintage cards, and specialty items
            </CategoryDescription>
          </CategoryCard>
        </CategoryGrid>
      </CategorySection>

      <Section>
        <SectionTitle>Why Sell With Us?</SectionTitle>
        <BenefitsGrid>
          {benefits.map((benefit, index) => (
            <BenefitCard key={index}>
              <BenefitIcon>{benefit.icon}</BenefitIcon>
              <BenefitTitle>{benefit.title}</BenefitTitle>
              <BenefitDescription>{benefit.description}</BenefitDescription>
            </BenefitCard>
          ))}
        </BenefitsGrid>
      </Section>

      <StepsSection>
        <SectionTitle>How to Get Started</SectionTitle>
        <StepsGrid>
          {steps.map((step) => (
            <StepCard key={step.number}>
              <StepNumber>{step.number}</StepNumber>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </StepCard>
          ))}
        </StepsGrid>
      </StepsSection>

      <Section>
        <SectionTitle>Simple, Transparent Pricing</SectionTitle>
        <PricingSection>
          <PricingGrid>
            {plans.map((plan, index) => (
              <PricingCard key={index} isPopular={plan.popular}>
                {plan.popular && <PopularBadge>Most Popular</PopularBadge>}
                
                <PlanName>{plan.name}</PlanName>
                <PlanPrice>${plan.price}</PlanPrice>
                <PlanPeriod>{plan.period}</PlanPeriod>
                
                <FeaturesList>
                  {plan.features.map((feature, featureIndex) => (
                    <Feature key={featureIndex}>{feature}</Feature>
                  ))}
                </FeaturesList>
              </PricingCard>
            ))}
          </PricingGrid>
        </PricingSection>
      </Section>

      <FAQSection>
        <SectionTitle>Frequently Asked Questions</SectionTitle>
        {faqs.map((faq, index) => (
          <FAQItem key={index}>
            <FAQQuestion>{faq.question}</FAQQuestion>
            <FAQAnswer>{faq.answer}</FAQAnswer>
          </FAQItem>
        ))}
      </FAQSection>

      <Section style={{ textAlign: 'center', paddingTop: '2rem' }}>
        <SectionTitle>Ready to Start Selling?</SectionTitle>
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
          Join our community of successful sellers and start earning more today.
        </p>
        {currentUser ? (
          currentUser.role === 'seller' ? (
            <CTAButton to="/seller/dashboard">Go to Dashboard</CTAButton>
          ) : (
            <CTAButton to="/subscription">Choose Your Plan</CTAButton>
          )
        ) : (
          <CTAButton to="/register">Sign Up Now</CTAButton>
        )}
      </Section>
    </PageContainer>
  );
};

export default BecomeSeller;