# Firebase Configuration Setup for Maternal Risk Prediction System

To fix the Firebase error `auth/api-key-not-valid`, follow these steps to properly configure your Firebase API key using environment variables:

## 1. Obtain Firebase Config

- Go to [Firebase Console](https://console.firebase.google.com/)
- Select your project
- Click the gear icon next to "Project Overview" and select "Project settings"
- Scroll to "Your apps" and select your web app
- Copy the Firebase SDK config object, which includes:

```json
{
  apiKey: "your_api_key",
  authDomain: "your_project_id.firebaseapp.com",
  projectId: "your_project_id",
  storageBucket: "your_project_id.appspot.com",
  messagingSenderId: "your_messaging_sender_id",
  appId: "your_app_id"
}
```

## 2. Set Environment Variables

Create a `.env.local` file in the root of your project (if not already present) and add:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Replace the placeholders with your actual Firebase config values.

## 3. Update Firebase Initialization

In `lib/firebase.ts`, load the config from environment variables:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

## 4. Restart Development Server

After setting environment variables, restart your Next.js development server to apply changes.

---

Following these steps will ensure your Firebase API key is valid and securely loaded, resolving the `auth/api-key-not-valid` error.

If you need further assistance, feel free to ask.
