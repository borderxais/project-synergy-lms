import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ParentDashboard from './pages/ParentDashboard';
import SubjectDetail from './pages/SubjectDetail';
import SendMessage from './pages/SendMessage';
import LeaveApplication from './pages/LeaveApplication';
import ReportDownload from './pages/ReportDownload';
import EventDetails from './pages/EventDetails';
import ExamDetails from './pages/ExamDetails';
import AIAdvice from './pages/AIAdvice';
import NotificationDetail from './pages/NotificationDetail';
import SchoolActivities from './pages/SchoolActivities';
import SchoolNotices from './pages/SchoolNotices';
import Volunteer from './pages/Volunteer';

function App() {
  return (
    <Routes>
      {/* 主要页面路由 */}
      <Route path="/" element={<ParentDashboard />} />
      <Route path="/subject/:subjectName" element={<SubjectDetail />} />
      <Route path="/message" element={<SendMessage />} />
      <Route path="/leave" element={<LeaveApplication />} />
      <Route path="/report" element={<ReportDownload />} />
      
      {/* 考试和活动详情路由 */}
      <Route path="/exam-details" element={<ExamDetails />} />
      <Route path="/event-details/:eventId" element={<EventDetails />} />
      
      {/* AI建议路由 */}
      <Route path="/ai-advice" element={<AIAdvice />} />

      {/* 新增路由 */}
      <Route path="/notification/:id" element={<NotificationDetail />} />
      <Route path="/school-activities" element={<SchoolActivities />} />
      <Route path="/school-notices" element={<SchoolNotices />} />
      <Route path="/volunteer" element={<Volunteer />} />
    </Routes>
  );
}

export default App;