import { useRef, useState } from "react";
import "../styles/dashboard-carousel.css";

export default function DashboardCarousel({ slides, label, onOpen }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swipeRef = useRef(null);
  const previous = () => setActiveIndex((index) => (index - 1 + slides.length) % slides.length);
  const next = () => setActiveIndex((index) => (index + 1) % slides.length);

  function handleKeyDown(event) {
    if (event.key === "ArrowLeft") previous();
    else if (event.key === "ArrowRight") next();
    else if (event.key === "Home") setActiveIndex(0);
    else if (event.key === "End") setActiveIndex(slides.length - 1);
    else return;
    event.preventDefault();
  }

  function handleSwipeEnd(event) {
    if (!swipeRef.current) return;
    const dx = event.clientX - swipeRef.current.x;
    const dy = event.clientY - swipeRef.current.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      swipeRef.current.swiped = true;
      if (dx < 0) next();
      else previous();
    }
  }

  return (
    <section className="dashboard-carousel" aria-label={label}
      aria-roledescription="carousel" onKeyDown={handleKeyDown}>
      <div className="dashboard-carousel-stage">
        <button type="button" onClick={previous}
          className="dashboard-carousel-arrow dashboard-carousel-previous" aria-label="Previous slide">‹</button>
        <div className="dashboard-carousel-track"
          onPointerDown={(event) => {
            swipeRef.current = event.pointerType === "mouse" ? null : { x: event.clientX, y: event.clientY, swiped: false };
          }}
          onPointerUp={handleSwipeEnd}
          onPointerCancel={() => { swipeRef.current = null; }}
          onClickCapture={(event) => {
            if (swipeRef.current?.swiped) {
              event.stopPropagation();
              swipeRef.current = null;
            }
          }}>
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;
            const position = isActive ? "active" : index === (activeIndex + 1) % slides.length ? "next" : "previous";
            return (
              <button key={slide.id} type="button"
                onClick={() => isActive ? onOpen(slide) : setActiveIndex(index)}
                className={`dashboard-carousel-card dashboard-carousel-card-${position}`}
                aria-label={`${isActive ? "Open" : "Show"} ${slide.title}`}>
                <img src={slide.image} alt="" className="dashboard-carousel-backdrop" draggable={false} />
                <img src={slide.image} alt="" className="dashboard-carousel-image" draggable={false} />
                <span className="dashboard-carousel-overlay">
                  <span className="dashboard-carousel-title">{slide.title}</span>
                  {slide.subtitle && <span className="dashboard-carousel-subtitle">{slide.subtitle}</span>}
                </span>
              </button>
            );
          })}
        </div>
        <button type="button" onClick={next}
          className="dashboard-carousel-arrow dashboard-carousel-next" aria-label="Next slide">›</button>
      </div>
      <div className="dashboard-carousel-dots">
        {slides.map((slide, index) => (
          <button key={slide.id} type="button" onClick={() => setActiveIndex(index)}
            className="dashboard-carousel-dot" aria-label={`Show ${slide.title}`}
            aria-current={activeIndex === index ? "true" : undefined}><span /></button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {slides[activeIndex].title}, slide {activeIndex + 1} of {slides.length}
      </p>
    </section>
  );
}
