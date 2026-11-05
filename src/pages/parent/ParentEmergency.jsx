import { useState } from "react";
import Header from "../../components/Header";
import ParentChildBar from "../../components/ParentChildBar";
import ConfirmModal from "../../components/ConfirmModal";
import Toast from "../../components/Toast";
import { parentData } from "../../data/parentData";
import "../../styles/parent.css";

// Nielsen H6 (Recognition over Recall) Emergency Presets
const EMERGENCY_PRESETS = [
  {
    label: "Sudden Severe Allergy",
    title: "Urgent Food Allergy Notice for Lunch Period",
    details: "Ahmed had a mild reaction to peanut oil yesterday evening. Please ensure the cafeteria staff and nurse are alerted.",
    type: "Allergy or Medication Notice",
  },
  {
    label: "Authorized Early Pickup",
    title: "Authorized Early Family Pickup at 1:30 PM",
    details: "Grandmother Mrs. Nadia will pick up Ahmed at the main gate at 1:30 PM for a dental surgery appointment.",
    type: "Urgent Pickup Notice",
  },
  {
    label: "Medication Schedule",
    title: "Prescription Inhaler Reminder for PE Class",
    details: "Ahmed needs to use his preventive inhaler 15 minutes before 5th-period sports activities. Inhaler is in his locker.",
    type: "Allergy or Medication Notice",
  },
];

export default function ParentEmergency() {
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

  const [alerts, setAlerts] = useState(child.emergencies || []);
  const [reportTitle, setReportTitle] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [priorityLevel, setPriorityLevel] = useState("High Priority (Health/Safety)");

  // Nielsen H1 (Status) & H5 (Error Prevention)
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const applyPreset = (preset) => {
    setReportTitle(preset.title);
    setReportDetails(preset.details);
    setPriorityLevel(preset.type);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!reportTitle.trim() || !reportDetails.trim()) return;
    // Nielsen H5 Error Prevention: Guard emergency alert with a confirmation check
    setShowConfirmModal(true);
  };

  const executeSendUrgentAlert = () => {
    setShowConfirmModal(false);
    setIsTransmitting(true);

    setTimeout(() => {
      const newAlert = {
        id: `em-parent-${Date.now()}`,
        severity: "alert",
        title: `[Parent Alert] ${reportTitle.trim()}`,
        sender: "Mr. Ehab Tawfeek (Parent)",
        date: "Just now",
        status: "Dispatched to Administration & Clinic",
        message: reportDetails.trim(),
        actionTaken: "School emergency duty officer notified instantly via priority route.",
        contactNumber: "+20 100 000 9999",
      };

      setAlerts((prev) => [newAlert, ...prev]);
      setIsTransmitting(false);
      setToastMessage("Emergency notice transmitted to school duty officers.");
      setReportTitle("");
      setReportDetails("");
    }, 600);
  };

  return (
    <div className="parent-page-wrapper">
      <Header role="parent" />
      <ParentChildBar
        activeChildId={activeChildId}
        onSelectChild={handleSelectChild}
        showBack={true}
        backTo="/parent"
        breadcrumbText="Emergency & Health Channel"
      />

      <main className="parent-container">
        {/* Dedicated Emergency Protocol Banner (Item 1 Core Object) */}
        <section className="bg-red-800 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 bg-red-700 rounded-lg text-lg">🚨</span>
                <span className="text-[11px] font-black uppercase tracking-widest text-red-200">
                  Priority Route • P7 Isolated Channel
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Emergency & Health Channel
              </h2>
              <p className="text-xs text-red-100/90 mt-1 max-w-xl leading-relaxed">
                This channel is strictly isolated for urgent student medical notices, clinic incident logs, and immediate crisis communications regarding{" "}
                <strong>{child.name}</strong>.
              </p>
            </div>

            <div className="flex flex-col gap-1 text-right shrink-0">
              <span className="text-xs font-bold text-red-200">
                Clinic Hotlines Active
              </span>
              <span className="text-[10px] bg-red-900/80 px-3 py-1 rounded-full text-red-100 border border-red-700">
                24/7 Response Desk
              </span>
            </div>
          </div>
        </section>

        {/* Section 1: Active Emergency & Health Log */}
        <section className="parent-card">
          <div className="parent-card-header">
            <div>
              <h3 className="parent-card-title">
                <span>Emergency Broadcasts & Clinic Incident Reports</span>
              </h3>
              <p className="text-[11px] text-forest/70 mt-0.5">
                Official health, safety, and campus notices regarding {child.name}
              </p>
            </div>
            <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
              {alerts.length} Incident Records
            </span>
          </div>

          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-xs text-forest/65 bg-cream/30 rounded-xl border border-sand/30">
                No active health or emergency alerts on record for {child.name}.
              </div>
            ) : (
              alerts.map((item) => {
                const isUrgent = item.severity === "alert";
                return (
                  <div
                    key={item.id}
                    className={`emergency-card-row ${
                      isUrgent ? "emergency-card-alert" : "emergency-card-info"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{isUrgent ? "⚠️" : "📢"}</span>
                        <h4 className="text-sm font-extrabold text-forest">
                          {item.title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white border border-sand/40 text-forest">
                        {item.status}
                      </span>
                    </div>

                    <p className="text-xs text-forest/90 leading-relaxed mb-3">
                      {item.message}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-sand/30 text-[11px] text-forest/75">
                      <div>
                        <strong>Reported by:</strong> {item.sender} • {item.date}
                      </div>
                      <div>
                        <strong>Action:</strong>{" "}
                        <span className="font-semibold text-forest">
                          {item.actionTaken}
                        </span>
                      </div>
                      {item.contactNumber && (
                        <div className="font-bold text-forest">
                          📞 {item.contactNumber}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Section 2: Parent Emergency Contact & Dispatch Form */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Dispatch Urgent Notice to School */}
          <div className="md:col-span-7 parent-card">
            <h3 className="parent-card-title mb-2">
              <span>Send Urgent Parent Notice to School</span>
            </h3>
            <p className="text-xs text-forest/75 mb-3 leading-relaxed">
              Use this priority form for sudden clinic alerts, authorized early pickups, or critical medication warnings.
            </p>

            {/* Nielsen H6 Recognition: Quick Presets */}
            <div className="mb-4">
              <span className="text-[11px] font-bold text-forest block mb-1.5">
                Quick Preset Templates (Click to fill):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {EMERGENCY_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="suggestion-chip"
                  >
                    ⚡ {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              <div>
                <label htmlFor="urgency-class-select" className="block font-bold text-forest mb-1">
                  Urgency Classification:
                </label>
                <select
                  id="urgency-class-select"
                  value={priorityLevel}
                  onChange={(e) => setPriorityLevel(e.target.value)}
                  className="w-full h-10 rounded-xl bg-cream/40 border border-sand/40 px-3 text-xs text-forest font-semibold"
                >
                  <option value="High Priority (Health/Safety)">
                    🚨 High Priority (Immediate Medical/Safety Concern)
                  </option>
                  <option value="Urgent Pickup Notice">
                    🚗 Urgent Authorized Pickup Request
                  </option>
                  <option value="Allergy or Medication Notice">
                    💊 Medication / Food Allergy Warning
                  </option>
                </select>
              </div>

              <div>
                <label htmlFor="emergency-title-input" className="block font-bold text-forest mb-1">
                  Subject / Summary:
                </label>
                <input
                  id="emergency-title-input"
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="e.g. Sudden severe allergy notice for lunch period"
                  className="w-full h-10 rounded-xl bg-cream/40 border border-sand/40 px-3 text-xs text-forest"
                  required
                />
              </div>

              <div>
                <label htmlFor="emergency-details-input" className="block font-bold text-forest mb-1">
                  Detailed Instructions & Incident Details:
                </label>
                <textarea
                  id="emergency-details-input"
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Provide precise details, medication names, emergency contacts, or authorized person info..."
                  rows={3}
                  className="w-full rounded-xl bg-cream/40 border border-sand/40 p-3 text-xs text-forest"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isTransmitting}
                className="btn-destructive w-full"
              >
                {isTransmitting ? (
                  <>
                    <span className="loading-spinner" />
                    <span>Broadcasting Alert...</span>
                  </>
                ) : (
                  <>
                    <span>🚨</span>
                    <span>Transmit Emergency Alert Instantly</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* School Emergency Directory */}
          <div className="md:col-span-5 parent-card space-y-4">
            <h3 className="parent-card-title">
              <span>Emergency Direct Lines</span>
            </h3>
            <p className="text-xs text-forest/75">
              Direct campus hotlines bypassing the automated switchboard:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-cream/60 border border-sand/40 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-forest">School Clinic & Nurse</h5>
                  <p className="text-[11px] text-forest/70">Nurse Hoda (Room 102)</p>
                  <span className="font-semibold text-forest text-xs">
                    +20 100 000 1122
                  </span>
                </div>
                <a
                  href="tel:+201000001122"
                  className="h-8 px-3 rounded-lg bg-forest text-cream font-bold text-xs flex items-center justify-center"
                >
                  Call
                </a>
              </div>

              <div className="p-3 rounded-xl bg-cream/60 border border-sand/40 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-forest">Campus Security Desk</h5>
                  <p className="text-[11px] text-forest/70">Main Gate / Safe Transport</p>
                  <span className="font-semibold text-forest text-xs">
                    +20 100 000 9999
                  </span>
                </div>
                <a
                  href="tel:+201000009999"
                  className="h-8 px-3 rounded-lg bg-forest text-cream font-bold text-xs flex items-center justify-center"
                >
                  Call
                </a>
              </div>

              <div className="p-3 rounded-xl bg-cream/60 border border-sand/40 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-forest">Principal Emergency Line</h5>
                  <p className="text-[11px] text-forest/70">Administration Office</p>
                  <span className="font-semibold text-forest text-xs">
                    +20 100 000 3344
                  </span>
                </div>
                <a
                  href="tel:+201000003344"
                  className="h-8 px-3 rounded-lg bg-forest text-cream font-bold text-xs flex items-center justify-center"
                >
                  Call
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Nielsen H5 Error Prevention Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Confirm Urgent Broadcast Dispatch?"
        message={`Are you sure you want to broadcast this urgent alert regarding ${child.name}? This alert will immediately ring on the clinic and administration duty phones.`}
        confirmLabel="Yes, Dispatch Emergency Alert"
        cancelLabel="Review Alert (Safe)"
        isDestructive={true}
        onConfirm={executeSendUrgentAlert}
        onCancel={() => setShowConfirmModal(false)}
      />

      <Toast
        message={toastMessage}
        type="warning"
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
