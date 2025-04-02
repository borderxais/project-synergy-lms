import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TeachersPage from './pages/teachers';
import CourseManagementPage from '../../teacher-portal/src/pages/course_setting/course_management';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TeachersPage />} />
        <Route path="/courses/:courseId/manage" element={<CourseManagementPage />} />
      </Routes>
    </BrowserRouter>
  );
}
