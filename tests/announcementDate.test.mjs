import assert from "node:assert/strict";
import { test } from "node:test";
import { announcementDate } from "../src/utils/announcementDate.js";

test("announcement dates normalize both sources without guessing or rolling invalid days forward", () => {
  for (const [input, expected] of [
    ["14-10-2026", "2026-10-14"],
    ["14.10.2026", "2026-10-14"],
    ["2026-11-13", "2026-11-13"],
    ["29-02-2024", "2024-02-29"],
    ["29-02-2026", ""],
    ["29.02.2026", ""],
    ["2026-02-30", ""],
    ["31-04-2026", ""],
    ["2026-13-01", ""],
    ["2026-00-10", ""],
    ["2026-01-00", ""],
    ["10/11/2026", ""],
    ["", ""],
    [null, ""],
    [undefined, ""],
  ]) assert.equal(announcementDate(input), expected, String(input));

  const dates = ["09-10-2026", "2026-01-01", "2026-11-13", "14-10-2026", "invalid"];
  assert.deepEqual(dates.map(announcementDate).sort((a, b) => b.localeCompare(a)), [
    "2026-11-13", "2026-10-14", "2026-10-09", "2026-01-01", "",
  ]);
});
