import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classImg from "../assets/class.png";
import papersImg from "../assets/papers.png";
import scheduleImg from "../assets/schedule.png";

const slides = [
  {
    title: "Classes",
    text: "Browse your classes and students",
    img: classImg,
    to: "/teacher/classes",
    bgColor: "#F8F7F3",
  },
  {
    title: "Papers",
    text: "Verify, grade and review submissions",
    img: papersImg,
    to: "/teacher/papers",
    bgColor: "#F2EEE3",
  },
  {
    title: "Schedule",
    text: "Plan assignments and quizzes",
    img: scheduleImg,
    to: "/teacher/schedule",
    bgColor: "#F3EFE4",
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance. The cleanup stops the old timer whenever `paused` changes or the page unmounts.
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [paused]);

  const go = (n) => setIndex((n + slides.length) % slides.length);

  return (
    <section
      className="hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Teacher Dashboard Carousel"
    >
      {slides.map((s, i) => (
        <Link
          key={s.title}
          to={s.to}
          tabIndex={i === index ? 0 : -1}
          style={{ backgroundColor: s.bgColor }}
          className={`hero-slide ${i === index ? "hero-slide-active" : ""}`}
        >
          {/* Ambient blurred backdrop so the colors fill the entire card edge-to-edge */}
          <img
            src={s.img}
            alt=""
            aria-hidden="true"
            className="hero-img-backdrop"
          />

          {/* Sharp, completely uncropped image scaled to fit without cutting any pixels */}
          <img
            src={s.img}
            alt={s.title}
            className="hero-img"
          />

          {/* Bottom text overlay with ample clearance from navigation arrows */}
          <div className="hero-overlay">
            <h2 className="hero-title">{s.title}</h2>
            <p className="hero-text">{s.text}</p>
          </div>
        </Link>
      ))}

      <button
        type="button"
        className="hero-arrow hero-arrow-left"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          go(index - 1);
        }}
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        type="button"
        className="hero-arrow hero-arrow-right"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          go(index + 1);
        }}
        aria-label="Next slide"
      >
        ›
      </button>

      <div className="hero-dots">
        {slides.map((s, i) => (
          <button
            key={s.title}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIndex(i);
            }}
            aria-label={`Show ${s.title}`}
            className={`hero-dot ${i === index ? "hero-dot-active" : ""}`}
          />
        ))}
      </div>
    </section>
  );
}
