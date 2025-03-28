# PrivSchool LMS

A comprehensive Learning Management System (LMS) with a microservices architecture designed for private schools. This system includes separate portals for students, teachers, parents, and administrators.

## Project Structure

The project is organized as a monorepo with the following main directories:

```
privschool-lms/
├── common/               # Shared components, hooks, types, and utilities
│   ├── components/       # Shared React components
│   ├── hooks/            # Shared React hooks
│   ├── lib/              # Shared libraries (Firebase, API, storage)
│   ├── types/            # Shared TypeScript types
│   └── utils/            # Shared utility functions
├── db/                   # Database client and utilities
├── packages/             # Frontend applications
│   ├── landing-page/     # Landing page (React)
│   ├── student-portal/   # Student portal (React)
│   ├── teacher-portal/   # Teacher portal (React)
│   ├── parent-portal/    # Parent portal (React)
│   └── admin-portal/     # Admin portal (React)
├── services/             # Backend microservices
│   ├── api/              # Main API service (FastAPI)
│   ├── auth/             # Authentication service (FastAPI)
│   └── llm/              # LLM service for AI features (FastAPI)
└── docs/                 # Documentation
```

## Technology Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Backend**: Python, FastAPI
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **AI/LLM**: OpenAI integration

## Getting Started

### Prerequisites

- Node.js (v16+)
- Python (v3.9+)
- Firebase account and project
- OpenAI API key (for LLM service)

### Firebase Setup

This project uses a shared Firebase project for authentication and Firestore database operations across the team. To access the shared Firebase resources:

1. Request access to the team's Firebase project (`privschool-d978c`)
2. Once you have access, you'll need the service account key:
   - If you're a team member, get the `serviceAccountKey.json` file from a team lead
   - Place this file in the `db/` directory
   - This file is gitignored to prevent credentials from being committed

If you're setting up your own instance of this project:
1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Set up Firebase Authentication with Google Sign-In enabled
3. Create a Firestore database with the same schema
4. Generate a service account key:
   - Go to Project Settings > Service accounts
   - Click "Generate new private key"
   - Save the JSON file
5. Copy the downloaded JSON file to `db/serviceAccountKey.json`
   - Use the structure in `db/serviceAccountKey.example.json` as a reference

The service account key is used by the backend services to interact with Firebase Admin SDK for authentication verification and Firestore operations.

### Installation

1. Clone the repository
2. Install dependencies:

```bash
# Install root dependencies
npm install

# Install dependencies for all workspaces
npm run dev
```

## Building and Running Portals

### Student Portal (Example)

The student portal is located in `packages/student-portal` and serves as a reference implementation for other portals.

#### Setup

1. Navigate to the student portal directory:

```bash
cd packages/student-portal
```

2. Install dependencies (if not already installed via workspace):

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The portal will be available at http://localhost:5173

#### Key Components

- **Authentication**: Uses Firebase Authentication via the shared `common/lib/firebase.ts` module
- **State Management**: Uses Zustand for state management
- **Routing**: Uses React Router for navigation
- **API Integration**: Uses direct fetch calls to backend services

### Implementing New Portals (Teacher, Parent)

To implement a new portal, follow these steps:

1. Copy the structure of the student portal:

```bash
cp -r packages/student-portal packages/new-portal
```

2. Update the package.json with the appropriate name and dependencies.

3. Modify the components and pages to fit the specific needs of the portal.

4. Ensure you're using the shared libraries from the common directory for authentication and Firebase integration.

## Backend Services

### API Service

The API service is the main backend service that handles most of the application logic.

#### Running the API Service

1. Navigate to the API service directory:

```bash
cd services/api
```

2. Install Python dependencies:

```bash
pip install -r requirements.txt
```

3. Start the service:

```bash
python main.py
```

The API service will run on http://localhost:3002

### Authentication Service

The authentication service handles user authentication and profile management.

#### Running the Auth Service

1. Navigate to the auth service directory:

```bash
cd services/auth
```

2. Install Python dependencies:

```bash
pip install -r requirements.txt
```

3. Start the service:

```bash
python main.py
```

The auth service will run on http://localhost:3001

### LLM Service

The LLM service provides AI-powered features using OpenAI's API.

#### Running the LLM Service

1. Navigate to the LLM service directory:

```bash
cd services/llm
```

2. Install Python dependencies:

```bash
pip install -r requirements.txt
```

3. Create a `.env` file with your OpenAI API key:

```
OPENAI_API_KEY=your_api_key_here
```

4. Start the service:

```bash
python src/main.py
```

The LLM service will run on http://localhost:3003

## Authentication System

The PrivSchool LMS uses a dual authentication approach that combines Firebase Authentication on the frontend with a custom backend authentication service. This approach provides both the convenience of Firebase's client-side authentication features and the security and control of a custom backend authentication system.

### Why Two Authentication Systems?

1. **Firebase Authentication (Frontend)**
   - Provides ready-to-use UI components and authentication flows
   - Handles secure authentication with Google
   - Generates Firebase tokens for authentication
   - Manages user sessions

2. **Backend Authentication Service**
   - Validates Firebase tokens directly
   - Manages user permissions and roles specific to the application
   - Creates and manages user profiles in the application database
   - Provides custom authentication endpoints for application-specific needs

### Implementation in Student Portal

The student portal implements this dual authentication system as follows:

#### 1. Firebase Authentication Setup

First, import the shared Firebase configuration from the common library:

```typescript
// In hooks/useAuth.ts
import { auth, db, googleProvider } from '@privschool-lms/common/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
```

#### 2. Google Authentication

The student portal uses Google authentication through Firebase:

```typescript
// In hooks/useAuth.ts
loginWithGoogle: async () => {
  try {
    // Step 1: Sign in with Google
    const result = await signInWithPopup(auth, googleProvider);
    const { user: firebaseUser } = result;
    
    // Step 2: Get the ID token
    const idToken = await firebaseUser.getIdToken();
    
    // Step 3: Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    let userData: User;
    
    if (userDoc.exists()) {
      userData = userDoc.data() as User;
      // Update last login
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        lastLoginAt: serverTimestamp(),
        signInMethod: 'google'
      }, { merge: true });
    } else {
      // Create user document if it doesn't exist
      userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName || '',
        isOnboarded: false,
      };
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...userData,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        signInMethod: 'google'
      });
    }
    
    // Step 4: Update auth state
    set({
      user: userData,
      token: idToken,
      isAuthenticated: true,
    });
    
    // Step 5: Store auth data
    localStorage.setItem('auth_token', idToken);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    
    return true;
  } catch (error) {
    console.error('[AUTH] Google login error:', error);
    return false;
  }
}
```

#### 3. Backend Integration with Firebase Tokens

The Firebase token is sent to the backend auth service for validation:

```typescript
// In pages/RegisterPage.tsx
const handleGoogleSignIn = async () => {
  try {
    setIsLoading(true);
    
    // Step 1: Sign in with Firebase using Google provider
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Google sign-in successful:', {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName
    });
    
    // Step 2: Get the Firebase ID token
    const user = result.user;
    const idToken = await user.getIdToken();
    
    // Step 3: Send the token to the backend auth service
    const backendResponse = await fetch(`${AUTH_SERVICE_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idToken })
    });
    
    if (!backendResponse.ok) {
      throw new Error('Failed to authenticate with backend');
    }
    
    // Step 4: Process the backend response
    const data = await backendResponse.json();
    
    // Step 5: Handle successful authentication
    // (redirect, update state, etc.)
  } catch (error) {
    // Handle errors
  } finally {
    setIsLoading(false);
  }
};
```

#### 4. Using Firebase Tokens in API Calls

When making API calls to protected endpoints, include the Firebase token in the Authorization header:

```typescript
// Example: Submitting onboarding data to the API service
const response = await fetch(`${API_SERVICE_URL}/api/onboarding`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // Firebase token
  },
  body: JSON.stringify({
    ...submissionData,
    userId: user?.id,
  }),
});
```

### Authentication Flow Summary

1. **User Login with Google**:
   - User authenticates with Firebase using Google provider
   - Firebase provides a token
   - The token is sent to the backend auth service for validation
   - User data is stored in Firestore

2. **API Requests**:
   - The Firebase token is included in API requests
   - Backend services validate the token
   - Services perform authorization checks based on user roles and permissions

3. **Token Management**:
   - Firebase handles token refresh automatically
   - The application stores the token in localStorage for persistence
   - The token is included in the application state for easy access

By implementing this dual authentication system, the PrivSchool LMS provides a secure and flexible authentication solution that leverages the strengths of both Firebase and a custom backend authentication service.

## Using Shared Libraries

### Firebase Authentication and Firestore

All portals should use the shared Firebase configuration from `common/lib/firebase.ts`:

```typescript
import { auth, db, googleProvider } from '@privschool-lms/common/lib/firebase';

// Authentication with Firebase
const userCredential = await signInWithPopup(auth, googleProvider);
const { user: firebaseUser } = userCredential;

// Get the ID token
const idToken = await firebaseUser.getIdToken();

// Get user data from Firestore
const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
```

### Backend Service Integration

The application currently uses direct fetch calls to interact with backend services. Service URLs are imported from a config file:

```typescript
// Import service URLs from config
import { API_SERVICE_URL, AUTH_SERVICE_URL } from '../config';

// Example: Submitting onboarding data to the API service
const response = await fetch(`${API_SERVICE_URL}/api/onboarding`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    ...submissionData,
    userId: user?.id,
  }),
});

// Example: User registration with the Auth service
const backendResponse = await fetch(`${AUTH_SERVICE_URL}/api/auth/register`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: formData.email,
    password: formData.password,
    firstName: formData.firstName,
    lastName: formData.lastName,
  }),
});
```

## LLM Service Integration

To use the LLM service for AI-powered features:

```typescript
// Import API service URL from config
import { API_SERVICE_URL } from '../config';

// Generate a roadmap for a student
const roadmapResponse = await fetch(`${API_SERVICE_URL}/generate-roadmap`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'user-id': user?.id?.toString() || '',
  },
  body: JSON.stringify({
    studentProfile: {
      // Student profile data
    },
    targetSchools: [
      // Target schools data
    ]
  }),
});

if (!roadmapResponse.ok) {
  const errorData = await roadmapResponse.json();
  throw new Error(errorData.detail || 'Failed to generate roadmap');
}

const roadmapData = await roadmapResponse.json();
```

## Python Service Integration

When importing between Python services, add the project root to the Python path and use absolute imports:

```python
import sys
import os
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).resolve().parents[3]  # Adjust the number based on the file's location
sys.path.append(str(project_root))

# Now you can import from other services or the db module
from db.firestore_client import FirestoreClient
from services.auth.src.auth.auth_routes import router as auth_router
```

## Development Workflow

1. Run all services and portals in development mode:

```bash
npm run dev
```

This will start all services and portals in parallel using Turbo.

2. Build all packages for production:

```bash
npm run build
```

3. Run linting across all packages:

```bash
npm run lint
```

## Git Workflow and Branching Strategy

To maintain code quality and ensure a smooth development process, we follow a structured Git workflow:

### Branch Structure

- **main**: Production-ready code. This branch should always be stable and deployable.
- **develop**: Integration branch for features that are ready for testing but not yet released to production.
- **feature branches**: Individual developer branches for new features or bug fixes (e.g., `aven-sun/new-feature`).

### Development Process

1. **Never push directly to the main branch**. All changes must go through the proper review process.

2. **Create your personal feature branch** from the develop branch:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b your-name/feature-name
   ```

3. **Make your changes** and commit them to your feature branch:
   ```bash
   git add .
   git commit -m "Descriptive commit message"
   git push origin your-name/feature-name
   ```

4. **Create a Pull Request (PR)** from your feature branch to the develop branch.
   - Add a clear description of the changes
   - Request reviews from team members
   - Address any feedback or comments

5. **After PR approval**, merge your changes into the develop branch.

6. **Testing on develop**: Once features are integrated into the develop branch, they should be tested thoroughly.

7. **Release to production**: When the develop branch is stable and ready for release:
   ```bash
   git checkout main
   git merge develop
   git push origin main
   ```

### Merging Develop to Main

To merge changes from the develop branch to the main branch:

1. Ensure all tests pass on the develop branch
2. Create a Pull Request from develop to main
3. After final review and approval, merge the PR
4. Tag the release with a version number:
   ```bash
   git checkout main
   git pull origin main
   git tag -a v1.0.0 -m "Version 1.0.0"
   git push origin v1.0.0
   ```

This workflow helps maintain a clean repository history and ensures that only reviewed, tested code makes it to production.

## Important Notes

1. When adding new shared components or utilities, place them in the appropriate directory under `common/`.
2. Always use the path alias `@privschool-lms/common/*` to import from the common directory.
3. When creating new Python services, follow the pattern established in the existing services.
4. For authentication and database operations, always use the shared Firebase configuration.
5. When migrating code from other repositories, ensure that imports are updated to use the correct paths.

## Troubleshooting

### Common Issues

1. **Import errors**: Ensure you're using the correct path alias when importing from the common directory.
2. **TypeScript errors**: Make sure your tsconfig.json extends the root tsconfig.json and includes the necessary path aliases.
3. **Python import errors**: Ensure you've added the project root to the Python path before importing from other services.
4. **Firebase authentication issues**: Check that you're using the shared Firebase configuration from `common/lib/firebase.ts`.

### Solutions

1. For import errors, update the import path to use the `@privschool-lms/common/*` alias.
2. For TypeScript errors, ensure your tsconfig.json includes the necessary path aliases:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@privschool-lms/common/*": ["../../common/*"]
    }
  }
}
```

3. For Python import errors, add the project root to the Python path:

```python
import sys
from pathlib import Path

project_root = Path(__file__).resolve().parents[3]  # Adjust as needed
sys.path.append(str(project_root))
```

4. For Firebase issues, ensure you're using the shared configuration:

```typescript
import { auth, db, googleProvider } from '@privschool-lms/common/lib/firebase';
```

## Firebase Service Account Setup and Credentials

To use Firebase services, you need to set up a service account and generate credentials. Here's how:

### Step 1: Create a Firebase Project

Create a new Firebase project in the Firebase console.

### Step 2: Enable Firebase Services

Enable the Firebase services you want to use, such as Firebase Authentication and Firestore.

### Step 3: Create a Service Account

Create a new service account in the Firebase console:

1. Go to the Firebase console and select your project.
2. Click on the "Settings" icon (gear icon) and select "Project settings".
3. Click on the "Service accounts" tab.
4. Click on the "Create service account" button.
5. Enter a name for your service account and select the "Firebase Admin SDK" role.
6. Click on the "Create" button.

### Step 4: Generate Credentials

Generate credentials for your service account:

1. Go to the Firebase console and select your project.
2. Click on the "Settings" icon (gear icon) and select "Project settings".
3. Click on the "Service accounts" tab.
4. Find your service account and click on the three vertical dots next to it.
5. Click on the "Create key" button.
6. Select the "JSON" key type and click on the "Create" button.
7. Save the generated JSON file securely.

### Step 5: Use Credentials in Your Application

Use the generated credentials in your application:

1. Create a new file named `firebase-service-account.json` in the root of your project.
2. Copy the contents of the generated JSON file into `firebase-service-account.json`.
3. Use the `firebase-admin` SDK to initialize the Firebase app with the service account credentials:

```typescript
import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert('firebase-service-account.json'),
  databaseURL: 'https://your-project-id.firebaseio.com',
});
```

Note: Make sure to replace `your-project-id` with your actual Firebase project ID.

By following these steps, you can set up a Firebase service account and generate credentials to use in your application.