import { useNavigate } from "react-router-dom";
import DashboardCarousel from "./DashboardCarousel";
import classImg from "../assets/class.png";
import papersImg from "../assets/papers.png";
import scheduleImg from "../assets/schedule.png";

const slides = [
  {
    id: "papers",
    title: "Papers",
    image: papersImg,
    to: "/teacher/papers",
  },
  {
    id: "schedule",
    title: "Schedule",
    image: scheduleImg,
    to: "/teacher/schedule",
  },
  {
    id: "classes",
    title: "Classes",
    image: classImg,
    to: "/teacher/classes",
  },
];

export default function TeacherQuickLinks({ pendingCount }) {
  const navigate = useNavigate();
  return (
    <DashboardCarousel label="Teacher navigation"
      slides={slides.map((slide) => ({ ...slide,
        subtitle: slide.id === "papers" ? `${pendingCount} pending ${pendingCount === 1 ? "paper" : "papers"}` : undefined,
      }))}
      onOpen={(slide) => navigate(slide.to)} />
  );
}
