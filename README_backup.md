# MarketPlace - Subscription-Based Seller Website

A modern e-commerce platform built with React.js and Firebase where sellers pay monthly or yearly subscriptions instead of transaction fees, similar to eBay but with a subscription model.

## Features

### For Buyers
- Browse products by categories
- Search and filter products
- Add items to cart
- Secure user authentication
- Order management
- Clean, modern UI

### For Sellers
- Monthly ($29.99) or Yearly ($299.99) subscription plans
- No transaction fees - keep 100% of sales revenue
- Unlimited product listings
- Seller dashboard with analytics
- Product management (add, edit, delete)
- Order tracking
- Advanced features for yearly subscribers

### Platform Features
- Firebase Authentication
- Real-time database with Firestore
- Responsive design
- Shopping cart with local storage
- Role-based access (buyer/seller)
- Subscription management

## Tech Stack

- **Frontend**: React.js with TypeScript
- **Styling**: Styled Components
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Routing**: React Router DOM
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Firebase:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Enable Storage
   - Get your Firebase configuration

3. Configure Firebase:
   - Open `src/firebase.ts`
   - Replace the placeholder configuration with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-actual-app-id"
};
```

4. Start the development server:
```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000).

## Subscription Plans

### Monthly Plan - $29.99/month
- Unlimited product listings
- No transaction fees
- Basic seller dashboard
- Email support
- Up to 5 photos per listing

### Yearly Plan - $299.99/year (Save $60)
- All monthly features
- Advanced seller dashboard
- Priority support
- Up to 10 photos per listing
- Featured listing opportunities
- Advanced analytics

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**
