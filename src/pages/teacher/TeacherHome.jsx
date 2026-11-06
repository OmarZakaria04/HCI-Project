import HeroCarousel from "../../components/HeroCarousel";
import AnalyticsCarousel from "../../components/AnalyticsCarousel";
import "../../styles/teacher.css";

export default function TeacherHome() {
  return (
    <div className="teacher-page">
      <h1 className="teacher-heading">Teacher Dashboard</h1>
      <HeroCarousel />
      <AnalyticsCarousel />
    </div>
  );
}