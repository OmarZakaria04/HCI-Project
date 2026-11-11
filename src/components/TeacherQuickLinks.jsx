import { useNavigate } from "react-router-dom";
import DashboardCarousel from "./DashboardCarousel";
import { useLanguage } from "../i18n/useLanguage";
import classImg from "../assets/class.png";
import papersImg from "../assets/papers.png";
import scheduleImg from "../assets/schedule.png";

export default function TeacherQuickLinks({ pendingCount }) {
  const navigate = useNavigate();
  const { tr } = useLanguage();

  const slides = [
    {
      id: "papers",
      title: tr("Papers", "Abgaben"),
      image: papersImg,
      to: "/teacher/papers",
    },
    {
      id: "schedule",
      title: tr("Schedule", "Stundenplan"),
      image: scheduleImg,
      to: "/teacher/schedule",
    },
    {
      id: "classes",
      title: tr("Classes", "Klassen"),
      image: classImg,
      to: "/teacher/classes",
    },
  ];

  return (
    <DashboardCarousel
      label={tr("Teacher navigation", "Lehrkräfte-Navigation")}
      slides={slides.map((slide) => ({
        ...slide,
        subtitle:
          slide.id === "papers"
            ? tr(
                `${pendingCount} pending ${pendingCount === 1 ? "paper" : "papers"}`,
                `${pendingCount} ausstehende ${pendingCount === 1 ? "Abgabe" : "Abgaben"}`
              )
            : undefined,
      }))}
      onOpen={(slide) => navigate(slide.to)}
    />
  );
}
