import React from 'react';
import TeacherDashboard from './teachers/index';
import CreateCoursePage from './course_setting/new_course';
import CourseAnnouncementPage from './course_setting/new_announcement';
import HomeworkPage from './course_setting/new_homework';
import CourseManagementPage from './course_setting/course_management';
import CourseSchedulePage from './course_setting/course_schedule';

export default function TeachersPage() {
  return <CourseSchedulePage />;
}