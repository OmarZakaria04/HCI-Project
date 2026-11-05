import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import TeacherHome from "./pages/teacher/TeacherHome";
import StudentHome from "./pages/student/StudentHome";
import ParentHome from "./pages/parent/ParentHome";
import ParentTeachers from "./pages/parent/ParentTeachers";
import ParentChat from "./pages/parent/ParentChat";
import ParentGrades from "./pages/parent/ParentGrades";
import ParentEmergency from "./pages/parent/ParentEmergency";
import ParentBehavior from "./pages/parent/ParentBehavior";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/teacher" element={<TeacherHome />} />
      <Route path="/student" element={<StudentHome />} />
      <Route path="/parent" element={<ParentHome />} />
      <Route path="/parent/teachers" element={<ParentTeachers />} />
      <Route path="/parent/chat" element={<ParentChat />} />
      <Route path="/parent/chat/:teacherId" element={<ParentChat />} />
      <Route path="/parent/grades" element={<ParentGrades />} />
      <Route path="/parent/emergency" element={<ParentEmergency />} />
      <Route path="/parent/behavior" element={<ParentBehavior />} />
    </Routes>
  );
}