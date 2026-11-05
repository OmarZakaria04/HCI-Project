import { useState } from "react";
import Header from "../../components/Header";
import ParentChildBar from "../../components/ParentChildBar";
import Toast from "../../components/Toast";
import { parentData } from "../../data/parentData";
import "../../styles/parent.css";

// Nielsen H6 Recognition over Recall: Quick Home Update Chips
const HOME_UPDATE_PRESETS = [
  "Reviewed step-by-step calculation proofs together over the weekend.",
  "Practiced dinner table debate; confidence notably improved.",
  "Set up 15-minute quiet focus block before dinner.",
  "Reinforced double-checking minus signs and algebraic signs.",
];

export default function ParentBehavior() {
  const [activeChildId, setActiveChildId] = useState(() => {
    return localStorage.getItem("parent_active_child") || "ahmed";
  });

  const handleSelectChild = (id) => {
    setActiveChildId(id);
    localStorage.setItem("parent_active_child", id);
  };

  const child =
    parentData.children.find((c) => c.id === activeChildId) ||
    parentData.children[0];

  const [concerns, setConcerns] = useState(child.behavioralConcerns || []);
  const [replyTextMap, setReplyTextMap] = useState({});
  const [loadingConcernId, setLoadingConcernId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const handleSendParentReply = (concernId) => {
    const text = replyTextMap[concernId]?.trim();
    if (!text) return;

    setLoadingConcernId(concernId);

    setTimeout(() => {
      setConcerns((prev) =>
        prev.map((c) =>
          c.id === concernId
            ? {
                ...c,
                parentNote: text,
              }
            : c
        )
      );

      setLoadingConcernId(null);
      setReplyTextMap((prev) => ({ ...prev, [concernId]: "" }));
      setToastMessage("Home practice update shared with the teacher!");
    }, 450);
  };

  return (
    <div className="parent-page-wrapper">
      <Header role="parent" />
      <ParentChildBar
        activeChildId={activeChildId}
        onSelectChild={handleSelectChild}
        showBack={true}
        backTo="/parent"
        breadcrumbText="Behavioral & Growth Notes"
      />

      <main className="parent-container">
        {/* Wireframe Hero Banner (Item 1 Core Action) */}
        <section className="wireframe-hero">
          <h2 className="wireframe-hero-title">Behavioral & Growth Notes</h2>
          <p className="wireframe-hero-subtitle">
            Teacher observations & home partnership action plans for{" "}
            <strong>{child.name}</strong>
          </p>
        </section>

        {/* Section 1: Overview Card */}
        <section className="parent-card">
          <div className="parent-card-header">
            <div>
              <h3 className="parent-card-title">
                <span>Teacher Guidance & Home Partnership (P8)</span>
              </h3>
              <p className="text-[11px] text-forest/70 mt-0.5">
                Constructive feedback shared voluntarily by teachers to align school & home environments
              </p>
            </div>
            <span className="text-xs font-bold text-forest bg-sage/20 px-3 py-1 rounded-full">
              {concerns.length} Observation Records
            </span>
          </div>

          {concerns.length === 0 ? (
            <div className="text-center py-10 bg-cream/30 rounded-2xl border border-sand/30 space-y-2">
              <span className="text-3xl">🌟</span>
              <h4 className="text-sm font-bold text-forest">
                No Behavioral Concerns Logged
              </h4>
              <p className="text-xs text-forest/70 max-w-md mx-auto">
                Teachers have reported exemplary conduct, focus, and classroom peer engagement for {child.name}.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {concerns.map((item) => {
                const isResolved = item.status === "Resolved";
                const isItemLoading = loadingConcernId === item.id;

                return (
                  <div key={item.id} className="behavior-card">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-sand/30">
                      <div>
                        <span className="text-xs font-extrabold text-forest uppercase tracking-wider">
                          {item.category}
                        </span>
                        <p className="text-[11px] text-forest/70">
                          Shared by <strong>{item.teacher}</strong> ({item.subject}) • {item.date}
                        </p>
                      </div>

                      <span
                        className={`behavior-status-badge ${
                          isResolved
                            ? "bg-green-100 text-green-800 border-green-300"
                            : "bg-amber-100 text-amber-900 border-amber-300"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    {/* Teacher Observation */}
                    <div>
                      <h5 className="text-xs font-bold text-forest mb-1">
                        Teacher Observation:
                      </h5>
                      <p className="text-xs text-forest/90 leading-relaxed bg-cream/40 p-3 rounded-xl border border-sand/30 italic">
                        "{item.concern}"
                      </p>
                    </div>

                    {/* Recommended Home Action Plan */}
                    <div className="home-action-box">
                      <h5 className="font-bold text-xs uppercase tracking-wider text-forest flex items-center gap-1.5">
                        <span>🏡</span>
                        <span>Recommended Home Action Plan:</span>
                      </h5>
                      <ul className="space-y-1.5 pl-4 list-disc text-forest/90 leading-relaxed text-xs">
                        {item.homeActionPlan.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Parent Feedback & Home Progress Loop */}
                    <div className="pt-2 border-t border-sand/20 space-y-2">
                      <h5 className="text-xs font-bold text-forest flex items-center justify-between">
                        <span>Home Feedback & Response:</span>
                        {item.parentNote && (
                          <span className="text-[10px] text-sage font-bold">
                            ✓ Response Shared with Teacher
                          </span>
                        )}
                      </h5>

                      {item.parentNote ? (
                        <div className="p-3 rounded-xl bg-forest/5 border border-forest/15 text-xs text-forest">
                          <span className="font-bold">Mr. Ehab Tawfeek: </span>
                          <span>"{item.parentNote}"</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {/* Nielsen H6: Recognition suggestions for reply */}
                          <div className="flex flex-wrap gap-1.5">
                            {HOME_UPDATE_PRESETS.map((preset) => (
                              <button
                                key={preset}
                                type="button"
                                onClick={() =>
                                  setReplyTextMap({
                                    ...replyTextMap,
                                    [item.id]: preset,
                                  })
                                }
                                className="suggestion-chip"
                              >
                                {preset}
                              </button>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={replyTextMap[item.id] || ""}
                              onChange={(e) =>
                                setReplyTextMap({
                                  ...replyTextMap,
                                  [item.id]: e.target.value,
                                })
                              }
                              placeholder="Or write custom home progress update..."
                              className="flex-1 h-10 rounded-xl bg-cream/40 border border-sand/40 px-3 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-sand"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleSendParentReply(item.id);
                                }
                              }}
                            />
                            <button
                              type="button"
                              disabled={isItemLoading}
                              onClick={() => handleSendParentReply(item.id)}
                              className="btn-primary shrink-0"
                            >
                              {isItemLoading ? (
                                <>
                                  <span className="loading-spinner" />
                                  <span>Sharing...</span>
                                </>
                              ) : (
                                <span>Update Teacher</span>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Toast
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
