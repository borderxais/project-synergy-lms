// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { ProgressProvider } from './context/ProgressContext';
// import {HomePage} from './pages/HomePage';
// import {DemoPage} from './pages/DemoPage';
// import DashboardPage from './pages/DashboardPage';
// import {ResourcesPage} from './pages/ResourcesPage';
// import {CalendarPage} from './pages/CalendarPage';
// import {OnboardingPage} from './pages/OnboardingPage';
// import {LoginPage} from './pages/LoginPage';
// import {RegisterPage} from './pages/RegisterPage';
// import { AuthCallback } from './pages/AuthCallback';
// import { ProtectedRoute } from './components/auth/ProtectedRoute';
// import { AuthProvider } from './components/auth/AuthContext';
// import RoadmapGenerationPage from './pages/RoadmapGenerationPage';
// import {DataRetrievalPage} from './pages/DataRetrievalPage';

// export function App() {
//   return (
//     <ProgressProvider>
//       <AuthProvider>
//         <Router>
//           <Routes>
//             {/* Public Routes */}
//             {/* <Route path="/" element={<HomePage />} /> */}
//             <Route path="/" element={<HomePage />} />
//             <Route path="/home" element={<HomePage />} />

//             <Route path="/demo" element={<DemoPage />} />
//             <Route path="/login" element={<LoginPage />} />
//             <Route path="/register" element={<RegisterPage />} />
//             <Route path="/auth/callback" element={<AuthCallback />} />
            
//             {/* Protected Routes */}
//             <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
//             <Route path="/roadmap-generation" element={<ProtectedRoute><RoadmapGenerationPage /></ProtectedRoute>} />
//             <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
//             <Route path="/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />
//             <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
//             <Route path="/data-retrieval" element={<ProtectedRoute><DataRetrievalPage /></ProtectedRoute>} />
//           </Routes>
//         </Router>
//       </AuthProvider>
//     </ProgressProvider>
//   );
// }

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import {HomePage} from './pages/HomePage';
import {DemoPage} from './pages/DemoPage';
import DashboardPage from './pages/DashboardPage';
import HomeDashboardPage from './pages/HomeDashboardPage';
import {ResourcesPage} from './pages/ResourcesPage';
import {CalendarPage} from './pages/CalendarPage';
import {OnboardingPage} from './pages/OnboardingPage';
import {LoginPage} from './pages/LoginPage';
import {RegisterPage} from './pages/RegisterPage';
import { AuthCallback } from './pages/AuthCallback';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthProvider } from './components/auth/AuthContext';
import RoadmapGenerationPage from './pages/RoadmapGenerationPage';
import {DataRetrievalPage} from './pages/DataRetrievalPage';

export function App() {
  return (
    <ProgressProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Protected Routes */}
            <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
            <Route path="/roadmap-generation" element={<ProtectedRoute><RoadmapGenerationPage /></ProtectedRoute>} />
            <Route path="/home-dashboard" element={<ProtectedRoute><HomeDashboardPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
            <Route path="/data-retrieval" element={<ProtectedRoute><DataRetrievalPage /></ProtectedRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ProgressProvider>
  );
}