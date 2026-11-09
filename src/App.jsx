import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import TeacherHome from "./pages/teacher/TeacherHome";
import StudentHome from "./pages/student/StudentHome";
import StudentGrades from "./pages/student/StudentGrades";
import StudentTeachers from "./pages/student/StudentTeachers";
import StudentAnnouncements from "./pages/student/StudentAnnouncements";
import StudentSolvingWorkspace from "./pages/student/StudentSolvingWorkspace";
import ParentHome from "./pages/parent/ParentHome";
import ParentTeachers from "./pages/parent/ParentTeachers";
import ParentChat from "./pages/parent/ParentChat";
import ParentGrades from "./pages/parent/ParentGrades";
import ParentEmergency from "./pages/parent/ParentEmergency";
import ParentBehavior from "./pages/parent/ParentBehavior";
import TeacherLayout from "./components/TeacherLayout";
import TeacherPapers from "./pages/teacher/TeacherPapers";
import TeacherSchedule from "./pages/teacher/TeacherSchedule";
import TeacherClasses from "./pages/teacher/TeacherClasses";
import TeacherStudentDetails from "./pages/teacher/TeacherStudentDetails";
import TeacherGrading from "./pages/teacher/TeacherGrading.jsx";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/student" element={<StudentHome />} />
      <Route path="/student/grades" element={<StudentGrades />} />
      <Route path="/student/grades/:subjectId" element={<StudentGrades />} />
      <Route path="/student/teachers" element={<StudentTeachers />} />
      <Route path="/student/teachers/:teacherId" element={<StudentTeachers />} />
      <Route path="/student/announcements" element={<StudentAnnouncements />} />
      <Route path="/student/workspace/:assessmentId" element={<StudentSolvingWorkspace />} />
      <Route path="/student/workspace" element={<StudentSolvingWorkspace />} />
      <Route path="/parent" element={<ParentHome />} />
      <Route path="/parent/teachers" element={<ParentTeachers />} />
      <Route path="/parent/chat" element={<ParentChat />} />
      <Route path="/parent/chat/:teacherId" element={<ParentChat />} />
      <Route path="/parent/grades" element={<ParentGrades />} />
      <Route path="/parent/emergency" element={<ParentEmergency />} />
      <Route path="/parent/behavior" element={<ParentBehavior />} />
      <Route path="/teacher" element={<TeacherLayout />}>
      <Route index element={<TeacherHome />} />
      <Route path="papers" element={<TeacherPapers />} />
      <Route path="schedule" element={<TeacherSchedule />} />
      <Route path="classes" element={<TeacherClasses />} />
      <Route path="classes/:classId" element={<TeacherClasses />} />
      <Route path="classes/:classId/students/:studentId" element={<TeacherStudentDetails />} />
      <Route path="papers/:paperId" element={<TeacherGrading />} />
      </Route>
    </Routes>
  );
}
