import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import TeacherHome from "./pages/teacher/Home";
import StudentHome from "./pages/student/Home";
import ParentHome from "./pages/parent/Home";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/teacher" element={<TeacherHome />} />
      <Route path="/student" element={<StudentHome />} />
      <Route path="/parent" element={<ParentHome />} />
    </Routes>
  );
}