import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import ConfirmModal from "../../components/ConfirmModal";
import Toast from "../../components/Toast";
import { onlineWorkspaceAssessments } from "../../data/studentData";
import {
  AssessmentIcon,
  CheckIcon,
  ChatIcon,
  HomeworkIcon,
  CalculatorIcon,
  StarIcon,
  LightbulbIcon,
} from "../../components/StudentIcons";
import "../../styles/student.css";

export default function StudentSolvingWorkspace() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  // Find active assessment or fallback to assess-1
  const assessment =
    onlineWorkspaceAssessments[assessmentId] || onlineWorkspaceAssessments["assess-1"];

  const questions = assessment.questions;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Student answers state: { [qId]: selectedOption }
  const [answers, setAnswers] = useState({});

  // S8: Hard-question marking state: { [qId]: boolean }
  const [markedHard, setMarkedHard] = useState({});

  // S4: Time spent per question tracking in seconds: { [qId]: seconds }
  const [questionTimes, setQuestionTimes] = useState(
    questions.reduce((acc, q) => ({ ...acc, [q.id]: 0 }), {})
  );

  // Interactive Tools state
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [scratchpadNote, setScratchpadNote] = useState("");
  const [calcDisplay, setCalcDisplay] = useState("");

  // Submission state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const activeQuestion = questions[currentQuestionIndex];

  // Timer effect: counts seconds spent on active question while not submitted
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setQuestionTimes((prev) => ({
        ...prev,
        [activeQuestion.id]: (prev[activeQuestion.id] || 0) + 1,
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeQuestion.id, isSubmitted]);

  // Format seconds to mm:ss
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;
  };

  const handleSelectOption = (opt) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [activeQuestion.id]: opt }));
  };

  // S8: Toggle hard question mark
  const handleToggleHard = () => {
    if (isSubmitted) return;
    const isNowHard = !markedHard[activeQuestion.id];
    setMarkedHard((prev) => ({ ...prev, [activeQuestion.id]: isNowHard }));
    if (isNowHard) {
      setToastMessage(
        `Question ${activeQuestion.number} marked as Hard. It will be flagged to review with your teacher.`
      );
    }
  };

  const handleSubmit = () => {
    setIsConfirmOpen(false);
    setIsSubmitted(true);
    setToastMessage("Assessment submitted successfully! Teacher will review your answers and timings.");
  };

  // Calculator button handler
  const handleCalcClick = (val) => {
    if (val === "C") setCalcDisplay("");
    else if (val === "=") {
      try {
        const sanitized = calcDisplay.replace(/[^0-9+\-*/.]/g, "");
        if (sanitized) {
          const result = new Function(`return (${sanitized})`)();
          setCalcDisplay(String(result ?? ""));
        }
      } catch {
        setCalcDisplay("Error");
      }
    } else {
      setCalcDisplay((prev) => prev + val);
    }
  };

  const hardCount = Object.values(markedHard).filter(Boolean).length;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="student-page-wrapper">
      <Header role="student" />

      <main className="student-container">
        {/* Workspace Top Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-sand/50 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center shrink-0">
              <AssessmentIcon className="w-5 h-5 text-forest" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-forest/60 uppercase tracking-wider">
                Online Solving Workspace • {assessment.subject}
              </span>
              <h1 className="text-base sm:text-lg font-bold text-forest">
                {assessment.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Question Timer (S4 requirement) */}
            <div className="bg-cream/70 border border-sand/40 px-3 py-1.5 rounded-xl text-xs font-semibold text-forest flex items-center gap-2">
              <span className="text-[11px] text-forest/60">Time on this question:</span>
              <span className="font-mono font-bold text-forest">
                {formatTime(questionTimes[activeQuestion.id] || 0)}
              </span>
            </div>

            {/* Tools Drawer Toggle */}
            <button
              type="button"
              onClick={() => setIsToolsOpen((prev) => !prev)}
              className="btn-secondary text-xs inline-flex items-center gap-1.5"
              title="Open Scratchpad & Calculator"
            >
              <CalculatorIcon className="w-3.5 h-3.5 text-forest" /> Tools
            </button>
          </div>
        </div>

        {/* Tools Drawer */}
        {isToolsOpen && (
          <div className="p-5 rounded-2xl bg-linear-to-r from-cream/80 to-white border border-sand/50 shadow-xs grid sm:grid-cols-2 gap-4 animate-in fade-in">
            {/* Mini Calculator */}
            <div className="bg-white p-3.5 rounded-xl border border-sand/40 space-y-2">
              <span className="text-xs font-bold text-forest block">Quick Calculator</span>
              <div className="bg-cream/60 border border-sand/40 rounded-lg p-2 text-right font-mono text-sm h-9 flex items-center justify-end font-bold text-forest">
                {calcDisplay || "0"}
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", "C", "=", "+"].map(
                  (btn) => (
                    <button
                      key={btn}
                      type="button"
                      onClick={() => handleCalcClick(btn)}
                      className={`p-1.5 rounded-md font-bold transition-all ${
                        btn === "="
                          ? "bg-forest text-cream"
                          : btn === "C"
                          ? "bg-sand/30 text-forest"
                          : "bg-cream text-forest hover:bg-sand/20"
                      }`}
                    >
                      {btn}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Fraction & Scratchpad Notes */}
            <div className="bg-white p-3.5 rounded-xl border border-sand/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-forest">Scratchpad & Fraction Notes</span>
                <span className="text-[10px] text-forest/50">Stored locally</span>
              </div>
              <textarea
                rows="4"
                value={scratchpadNote}
                onChange={(e) => setScratchpadNote(e.target.value)}
                placeholder="Write your intermediate working steps or LCM factors here..."
                className="w-full bg-cream/40 border border-sand/40 rounded-lg p-2.5 text-xs text-forest placeholder:text-forest/40 focus:outline-none focus:ring-1 focus:ring-sand resize-none"
              />
            </div>
          </div>
        )}

        {/* Post-submission Review Screen */}
        {isSubmitted ? (
          <div className="student-card space-y-6 text-center py-8">
            <div className="w-16 h-16 rounded-3xl bg-forest/10 text-forest flex items-center justify-center mx-auto text-3xl">
              <CheckIcon className="w-8 h-8 text-forest" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-forest">Assessment Submitted!</h2>
              <p className="text-xs sm:text-sm text-forest/70 max-w-md mx-auto mt-1">
                Your answers and exact time spent on each question have been securely recorded for{" "}
                <strong className="text-forest">{assessment.teacher}&apos;s</strong> review.
              </p>
            </div>

            {/* S4 Time Tracking & S8 Hard Question Review Summary */}
            <div className="max-w-md mx-auto p-4 rounded-xl bg-cream/40 border border-sand/40 text-left space-y-3">
              <span className="text-xs font-bold text-forest block uppercase tracking-wider">
                Submission Breakdown for Teacher:
              </span>
              <div className="space-y-1.5 text-xs">
                {questions.map((q) => (
                  <div
                    key={q.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-sand/30"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-forest">Q{q.number}:</span>
                      <span className="text-forest/80">{q.topic}</span>
                      {markedHard[q.id] && (
                        <span className="text-[10px] bg-sand/30 text-forest px-1.5 py-0.5 rounded font-bold inline-flex items-center gap-1">
                          <StarIcon className="w-3 h-3 text-forest" /> Marked Hard
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-forest/60">
                      {formatTime(questionTimes[q.id] || 0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* S9 Action: Chat with teacher to review marked questions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/student/teachers")}
                className="btn-primary text-xs w-full sm:w-auto"
              >
                <ChatIcon className="w-4 h-4" /> Message Teacher About Marked Questions
              </button>
              <button
                type="button"
                onClick={() => navigate("/student")}
                className="btn-secondary text-xs w-full sm:w-auto"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Main Question Solving Panel */
          <div className="student-card space-y-6">
            {/* Question Selector & Hard Question Marker (S8) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-sand/30">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-forest/70 uppercase">Questions:</span>
                <div className="flex gap-1.5">
                  {questions.map((q, idx) => {
                    const isAnswered = Boolean(answers[q.id]);
                    const isCurrent = idx === currentQuestionIndex;
                    const isHard = Boolean(markedHard[q.id]);
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
                          isCurrent
                            ? "bg-forest text-cream ring-2 ring-sand"
                            : isAnswered
                            ? "bg-sage/30 text-forest border border-sage/40"
                            : "bg-cream text-forest/70 border border-sand/40"
                        }`}
                      >
                        {q.number}
                        {isHard && (
                          <span className="absolute -top-1 -right-1 text-sand">
                            <StarIcon className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* S8: Hard Question Marking Button */}
              <button
                type="button"
                onClick={handleToggleHard}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  markedHard[activeQuestion.id]
                    ? "bg-sand text-forest border-sand shadow-xs"
                    : "bg-cream/60 hover:bg-sand/20 text-forest/80 border-sand/50"
                }`}
                title="Mark this question to review later with teacher"
              >
                <StarIcon className={`w-3.5 h-3.5 ${markedHard[activeQuestion.id] ? "text-forest" : "text-sand"}`} />
                <span>
                  {markedHard[activeQuestion.id]
                    ? "Marked as Hard Question"
                    : "Mark as Hard Question"}
                </span>
              </button>
            </div>

            {/* Question Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-forest/60">
                  Question {activeQuestion.number} of {questions.length} • {activeQuestion.topic}
                </span>
                <span className="text-xs text-forest/50">
                  Recorded Time: {formatTime(questionTimes[activeQuestion.id] || 0)}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-forest leading-relaxed">
                {activeQuestion.prompt}
              </h2>

              {/* Hint Box */}
              {activeQuestion.hint && (
                <div className="p-3 rounded-xl bg-sand/15 border border-sand/40 text-xs text-forest flex items-start gap-2">
                  <span className="font-bold text-sand shrink-0 inline-flex items-center gap-1">
                    <LightbulbIcon className="w-3.5 h-3.5" /> Helpful Tip:
                  </span>
                  <span>{activeQuestion.hint}</span>
                </div>
              )}

              {/* Multiple Choice Options */}
              <div className="space-y-2.5 pt-2">
                {activeQuestion.options.map((opt, i) => {
                  const isSelected = answers[activeQuestion.id] === opt;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm font-medium transition-all cursor-pointer border flex items-center justify-between ${
                        isSelected
                          ? "bg-forest/10 border-forest text-forest font-bold ring-1 ring-forest"
                          : "bg-white hover:bg-cream/40 border-sand/40 text-forest/85"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? "bg-forest text-cream border-forest"
                              : "bg-cream text-forest/60 border-sand/40"
                          }`}
                        >
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isSelected && <CheckIcon className="w-4 h-4 text-forest" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation & Submit Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-sand/30">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                  className="btn-secondary text-xs flex-1 sm:flex-none"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  disabled={currentQuestionIndex === questions.length - 1}
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  className="btn-secondary text-xs flex-1 sm:flex-none"
                >
                  Next →
                </button>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <span className="text-xs text-forest/60">
                  {answeredCount} of {questions.length} answered
                </span>
                <button
                  type="button"
                  onClick={() => setIsConfirmOpen(true)}
                  className="btn-primary text-xs"
                >
                  Submit Assessment
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title={`Submit ${assessment.title}?`}
        message={`You have answered ${answeredCount} of ${questions.length} questions.${
          hardCount > 0 ? ` ${hardCount} question(s) marked for teacher review.` : ""
        } Once submitted, your answers and question times will be forwarded to ${assessment.teacher}.`}
        confirmLabel="Yes, Submit"
        cancelLabel="Continue Solving"
        onConfirm={handleSubmit}
        onCancel={() => setIsConfirmOpen(false)}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
