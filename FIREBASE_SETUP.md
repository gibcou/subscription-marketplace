# Firebase Setup Instructions

This guide will help you set up Firebase for the MarketPlace application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "marketplace-app")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

## Step 3: Create Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (we'll set up security rules later)
4. Select a location for your database (choose closest to your users)
5. Click "Done"

## Step 4: Enable Storage

1. Go to "Storage" in the left sidebar
2. Click "Get started"
3. Review the security rules (start in test mode)
4. Choose the same location as your Firestore database
5. Click "Done"

## Step 5: Get Firebase Configuration

1. Go to "Project settings" (gear icon in the left sidebar)
2. Scroll down to "Your apps" section
3. Click the web icon (</>) to add a web app
4. Register your app with a nickname (e.g., "marketplace-web")
5. Copy the Firebase configuration object

## Step 6: Configure Your App

1. Open `src/firebase.ts` in your project
2. Replace the placeholder configuration with your actual Firebase config:

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

## Step 7: Set Up Firestore Security Rules

1. Go to "Firestore Database" > "Rules" tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products are readable by all, writable by owner
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == resource.data.sellerId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.sellerId;
    }
    
    // Orders are readable/writable by buyer and seller
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.buyerId || request.auth.uid == resource.data.sellerId);
      allow create: if request.auth != null && request.auth.uid == request.resource.data.buyerId;
    }
    
    // Subscriptions are readable/writable by owner
    match /subscriptions/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

## Step 8: Set Up Storage Security Rules

1. Go to "Storage" > "Rules" tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload product images
    match /products/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to upload profile images
    match /users/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

## Step 9: Test Your Setup

1. Start your development server: `npm start`
2. Try registering a new user
3. Check the Firebase console to see if the user was created in Authentication
4. Check Firestore to see if a user document was created

## Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/configuration-not-found)"**
   - Make sure you've replaced the placeholder config in `src/firebase.ts`
   - Verify all config values are correct

2. **"Missing or insufficient permissions"**
   - Check your Firestore security rules
   - Make sure the user is authenticated before trying to access data

3. **"Storage: User does not have permission to access this object"**
   - Check your Storage security rules
   - Ensure the user is authenticated and accessing their own files

### Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

## Next Steps

Once Firebase is set up, you can:

1. Register as a seller and set up a subscription
2. Add products to your store
3. Test the buying flow
4. Customize the application to your needs

For production deployment, consider:

- Setting up proper security rules
- Enabling Firebase Hosting
- Setting up monitoring and analytics
- Implementing proper error handling
- Adding payment processing (Stripe, PayPal, etc.)