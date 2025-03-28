import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import TeachersPage from './pages/teachers';

export default function App() {
  return (
    <BrowserRouter>
      <TeachersPage />
    </BrowserRouter>
  );
}