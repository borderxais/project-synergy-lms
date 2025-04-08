import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TeachersPage from './pages/teachers';
import CourseManagementPage from './pages/course_setting/course_management';
import CreateAssignmentPage from './pages/course_setting/new_homework';
import CreateAnnouncementPage from './pages/course_setting/new_announcement';
import CourseSchedulePage from './pages/course_setting/new_course';
import MessagingPage from './pages/messages/messagingPage';
import StudentDetailPage from './pages/teachers/studentDetail';
import AttendanceSheet from './pages/course_setting/AttendanceSheet';
import ParticipationSheet from './pages/course_setting/ParticipationSheet';
import GradebookSheet from './pages/course_setting/GradebookSheet';
import AllMessagesPage from './pages/messages/AllMessagePage';
import NewMessagePage from './pages/messages/NewMessagePage';
import EditAnnouncementPage from './pages/course_setting/EditAnnouncementPage';
import EditAssignmentPage from './pages/course_setting/EditAssignmentPage';





export default function App() {
  return (
    // <BrowserRouter>
      <Routes>
        <Route path="/" element={<TeachersPage />} />
        <Route path="/courses/:courseId/manage" element={<CourseManagementPage />} />
        <Route path="/courses/:courseId/schedule" element={<CourseSchedulePage />} />
        <Route path="/courses/:courseId/create-assignment" element={<CreateAssignmentPage />} />
        <Route path="/courses/:courseId/create-announcement" element={<CreateAnnouncementPage />} />
        <Route path="/messages/:messageId" element={<MessagingPage />} />
        <Route path="/students/:studentId" element={<StudentDetailPage />} />
        <Route path="/courses/:courseId/attendance-sheet" element={<AttendanceSheet />} />
        <Route path="/courses/:courseId/participation-sheet" element={<ParticipationSheet />} />
        <Route path="/courses/:courseId/gradebook" element={<GradebookSheet />} />
        <Route path="/messages" element={<AllMessagesPage />} />
        <Route path="/messages/:messageId" element={<MessagingPage />} />
        <Route path="/messages/new" element={<NewMessagePage />} />
        <Route path="/courses/:courseId/announcements/:announcementId/edit" element={<EditAnnouncementPage />} />
        <Route path="/courses/:courseId/assignments/:assignmentId/edit" element={<EditAssignmentPage />} />
      </Routes>
    // </BrowserRouter>
  );
}
