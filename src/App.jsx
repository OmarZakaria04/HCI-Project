import { Routes, Route, Link } from "react-router-dom";
import LanguageProvider from "./i18n/LanguageProvider";
import { useLanguage } from "./i18n/useLanguage";
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
import TeacherCommunication from "./pages/teacher/TeacherCommunication";
import ItSupportWidget from "./components/ItSupportWidget";


export default function App() {
  return (
    <LanguageProvider>
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
        <Route path="messages" element={<TeacherCommunication />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ItSupportWidget />
    </LanguageProvider>
  );
}

function NotFoundPage() {
  const { tr } = useLanguage();
  return (
    <main className="min-h-screen bg-cream text-forest flex items-center justify-center p-6">
      <section className="max-w-lg w-full rounded-2xl border border-sand bg-white p-8 shadow-sm space-y-4">
        <h1 className="text-2xl font-bold">{tr("Page not found", "Seite nicht gefunden")}</h1>
        <p className="text-forest/80">
          {tr(
            "We couldn't find that page. Check the web address or jump back to one of your portals below.",
            "Diese Seite wurde nicht gefunden. Prüfen Sie die Adresse oder kehren Sie unten zu einem Portal zurück."
          )}
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link to="/" className="rounded-xl bg-forest text-cream px-4 py-2.5 font-semibold">
            {tr("Back to Sign in", "Zur Anmeldung")}
          </Link>
          <Link to="/student" className="rounded-xl border border-sand px-4 py-2.5 font-semibold text-forest">
            {tr("Student Portal", "Schülerportal")}
          </Link>
          <Link to="/parent" className="rounded-xl border border-sand px-4 py-2.5 font-semibold text-forest">
            {tr("Parent Portal", "Elternportal")}
          </Link>
          <Link to="/teacher" className="rounded-xl border border-sand px-4 py-2.5 font-semibold text-forest">
            {tr("Teacher Portal", "Lehrkräfteportal")}
          </Link>
        </div>
      </section>
    </main>
  );
}
