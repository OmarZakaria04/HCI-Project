import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classImg from "../assets/class.png";
import papersImg from "../assets/papers.png";
import scheduleImg from "../assets/schedule.png";

const slides = [
  { title: "Classes", text: "Browse your classes and students", img: classImg, to: "/teacher/students" },
  { title: "Papers", text: "Verify, grade and review submissions", img: papersImg, to: "/teacher/papers" },
  { title: "Schedule", text: "Plan assignments and quizzes", img: scheduleImg, to: "/teacher/schedule" },
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
    >
      {slides.map((s, i) => (
        <Link
          key={s.title}
          to={s.to}
          tabIndex={i === index ? 0 : -1}
          className={`hero-slide ${i === index ? "hero-slide-active" : ""}`}
        >
          <img src={s.img} alt="" className="hero-img" />
          <div className="hero-overlay">
            <h2 className="hero-title">{s.title}</h2>
            <p className="hero-text">{s.text}</p>
          </div>
        </Link>
      ))}

      <button className="hero-arrow hero-arrow-left" onClick={() => go(index - 1)} aria-label="Previous slide">‹</button>
      <button className="hero-arrow hero-arrow-right" onClick={() => go(index + 1)} aria-label="Next slide">›</button>

      <div className="hero-dots">
        {slides.map((s, i) => (
          <button
            key={s.title}
            onClick={() => setIndex(i)}
            aria-label={`Show ${s.title}`}
            className={`hero-dot ${i === index ? "hero-dot-active" : ""}`}
          />
        ))}
      </div>
    </section>
  );
}