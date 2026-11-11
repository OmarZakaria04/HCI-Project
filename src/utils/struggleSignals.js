export const NOISE_SIGNAL_THRESHOLD = 25;
export const TIME_SIGNAL_MULTIPLIER = 2;

export function formatDuration(totalSeconds, lang = "en") {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "—";
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.round(totalSeconds % 60);
  if (lang === "de") {
    return mins > 0 ? `${mins} Min. ${secs} Sek.` : `${secs} Sek.`;
  }
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

/**
 * Evaluates non-punitive T10 struggle signals for a single question.
 * Returns { hasSignal, hasHighNoise, hasLongTime, noisePercent, timeSpentSec, expectedTimeSec }.
 * These signals only point to questions worth a closer look; they never affect grades or red flags.
 */
export function getStruggleSignal(item, submissionType = "scan") {
  const noisePercent = Number.isFinite(item?.erasingNoise)
    ? item.erasingNoise
    : Number.isFinite(item?.noise)
      ? item.noise
      : null;
  const timeSpentSec = Number.isFinite(item?.timeSpentSec) ? item.timeSpentSec : null;
  const expectedTimeSec = Number.isFinite(item?.expectedTimeSec) ? item.expectedTimeSec : 60;

  const hasHighNoise =
    submissionType !== "online" &&
    noisePercent !== null &&
    noisePercent >= NOISE_SIGNAL_THRESHOLD;

  const hasLongTime =
    submissionType === "online" &&
    timeSpentSec !== null &&
    timeSpentSec >= Math.max(90, expectedTimeSec * TIME_SIGNAL_MULTIPLIER);

  return {
    hasSignal: hasHighNoise || hasLongTime,
    hasHighNoise,
    hasLongTime,
    noisePercent,
    timeSpentSec,
    expectedTimeSec,
  };
}

