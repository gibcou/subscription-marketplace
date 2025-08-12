import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Subscription as SubscriptionType } from '../types';

const SubscriptionContainer = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 3rem;
  font-size: 1.1rem;
`;

const PlansContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const PlanCard = styled.div<{ isPopular?: boolean; isSelected?: boolean }>`
  background: white;
  border: 3px solid ${props => props.isSelected ? '#e74c3c' : props.isPopular ? '#f39c12' : '#ddd'};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
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

const SelectButton = styled.button<{ isSelected?: boolean }>`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  background: ${props => props.isSelected ? '#27ae60' : '#e74c3c'};
  color: white;
  
  &:hover {
    background: ${props => props.isSelected ? '#229954' : '#c0392b'};
  }
`;

const CurrentPlanSection = styled.div`
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const CurrentPlanTitle = styled.h2`
  color: #333;
  margin-bottom: 1rem;
`;

const PlanStatus = styled.div<{ status: string }>`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  color: white;
  background: ${props => {
    switch (props.status) {
      case 'active': return '#27ae60';
      case 'inactive': return '#e74c3c';
      case 'cancelled': return '#f39c12';
      default: return '#95a5a6';
    }
  }};
`;

const InfoSection = styled.div`
  background: #e8f4fd;
  border: 1px solid #bee5eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;
`;

const InfoTitle = styled.h3`
  color: #0c5460;
  margin-bottom: 1rem;
`;

const InfoText = styled.p`
  color: #0c5460;
  margin-bottom: 0.5rem;
`;

const plans = [
  {
    id: 'monthly',
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
    id: 'yearly',
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

const Subscription: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [currentSubscription, setCurrentSubscription] = useState<SubscriptionType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (currentUser.role !== 'seller') {
      navigate('/');
      return;
    }

    fetchCurrentSubscription();
  }, [currentUser, navigate]);

  const fetchCurrentSubscription = async () => {
    if (!currentUser) return;

    try {
      const subscriptionDoc = await getDoc(doc(db, 'subscriptions', currentUser.id));
      if (subscriptionDoc.exists()) {
        const data = subscriptionDoc.data();
        setCurrentSubscription({
          ...data,
          startDate: data.startDate.toDate(),
          endDate: data.endDate.toDate()
        } as SubscriptionType);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const handleSelectPlan = async (planId: string) => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const plan = plans.find(p => p.id === planId);
      if (!plan) return;

      const startDate = new Date();
      const endDate = new Date();
      
      if (planId === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      const subscriptionData: SubscriptionType = {
        id: currentUser.id,
        userId: currentUser.id,
        plan: planId as 'monthly' | 'yearly',
        status: 'active',
        startDate,
        endDate,
        price: plan.price
      };

      await setDoc(doc(db, 'subscriptions', currentUser.id), subscriptionData);
      setCurrentSubscription(subscriptionData);
      
      // In a real app, you would integrate with a payment processor here
      alert(`Successfully subscribed to ${plan.name}! You can now start selling on our platform.`);
      navigate('/seller/dashboard');
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert('Error creating subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!currentUser) {
    return null;
  }

  return (
    <SubscriptionContainer>
      <Title>Seller Subscription Plans</Title>
      <Subtitle>
        Choose the perfect plan for your selling needs. No transaction fees, just a simple monthly or yearly subscription.
      </Subtitle>

      {currentSubscription && (
        <CurrentPlanSection>
          <CurrentPlanTitle>Current Subscription</CurrentPlanTitle>
          <p>
            <strong>Plan:</strong> {currentSubscription.plan === 'monthly' ? 'Monthly' : 'Yearly'} Plan
          </p>
          <p>
            <strong>Status:</strong> <PlanStatus status={currentSubscription.status}>{currentSubscription.status.toUpperCase()}</PlanStatus>
          </p>
          <p>
            <strong>Valid until:</strong> {formatDate(currentSubscription.endDate)}
          </p>
        </CurrentPlanSection>
      )}

      <PlansContainer>
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            isPopular={plan.popular}
            isSelected={selectedPlan === plan.id}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.popular && <PopularBadge>Most Popular</PopularBadge>}
            
            <PlanName>{plan.name}</PlanName>
            <PlanPrice>${plan.price}</PlanPrice>
            <PlanPeriod>{plan.period}</PlanPeriod>
            
            <FeaturesList>
              {plan.features.map((feature, index) => (
                <Feature key={index}>{feature}</Feature>
              ))}
            </FeaturesList>
            
            <SelectButton
              isSelected={currentSubscription?.plan === plan.id}
              onClick={(e) => {
                e.stopPropagation();
                if (currentSubscription?.plan !== plan.id) {
                  handleSelectPlan(plan.id);
                }
              }}
              disabled={loading || currentSubscription?.plan === plan.id}
            >
              {loading ? 'Processing...' : 
               currentSubscription?.plan === plan.id ? 'Current Plan' : 
               'Select Plan'}
            </SelectButton>
          </PlanCard>
        ))}
      </PlansContainer>

      <InfoSection>
        <InfoTitle>Why Choose Our Subscription Model?</InfoTitle>
        <InfoText>• <strong>No Transaction Fees:</strong> Keep 100% of your sales revenue</InfoText>
        <InfoText>• <strong>Predictable Costs:</strong> Know exactly what you'll pay each month</InfoText>
        <InfoText>• <strong>Unlimited Listings:</strong> List as many products as you want</InfoText>
        <InfoText>• <strong>Professional Tools:</strong> Access to advanced seller features</InfoText>
        <InfoText>• <strong>Dedicated Support:</strong> Get help when you need it</InfoText>
      </InfoSection>
    </SubscriptionContainer>
  );
};

export default Subscription;