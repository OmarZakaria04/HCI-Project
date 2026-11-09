import { Navigate, Outlet, useMatch } from "react-router-dom";
import Header from "./Header";

export default function TeacherLayout() {
  const isDashboard = useMatch({ path: "/teacher", end: true });
  const isPapers = useMatch({ path: "/teacher/papers", end: false });
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user || user.role !== "teacher") return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-cream">
      <Header role="teacher" />
      <main className={isDashboard || isPapers ? "w-full max-w-[1248px] mx-auto px-6 pt-6 pb-16" : "max-w-6xl mx-auto p-6"}>
        <Outlet />
      </main>
    </div>
  );
}
