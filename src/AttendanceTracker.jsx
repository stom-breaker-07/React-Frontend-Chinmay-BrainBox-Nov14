import React, { useEffect, useMemo, useState } from "react";
import StudentRow from "./StudentRow";

/**
 * AttendanceTracker
 *
 * Props:
 * - students: array of { id, name, roll }  (optional; sample data used if not provided)
 * - date: ISO date string or Date object (optional; defaults to today)
 * - onAttendanceChange: (attendanceMap) => void (optional callback when attendance changes)
 *
 * Notes:
 * - Uses local useState to store attendance in the shape { [id]: 'present'|'absent'|'late' | null }
 * - Responsive and designed to be embedded into an existing CMS layout.
 */


const CLASS_OPTIONS = [
  { id: "10A", label: "Class 10 · Section A" },
  { id: "10B", label: "Class 10 · Section B" },
  { id: "11A", label: "Class 11 · Section A" },
];

export default function AttendanceTracker({
  students = [],
  date = new Date(),
  onAttendanceChange,
}) {
  // Normalize date to string yyyy-mm-dd for display/state (so child components can rely on stable value)
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const formattedDate = useMemo(
    () =>
      dateObj.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    [dateObj]
  );

  const dayName = useMemo(
    () =>
      dateObj.toLocaleDateString(undefined, {
        weekday: "long",
      }),
    [dateObj]
  );

  const [selectedClass, setSelectedClass] = useState(CLASS_OPTIONS[0].id);

  // Attendance map: { [id]: 'present' | 'absent' | 'late' | null }
  const [attendance, setAttendance] = useState(() => {
    const initial = {};
    students.forEach((s) => (initial[s.id] = null));
    return initial;
  });

  // Reset attendance if student list changes
  useEffect(() => {
    setAttendance((prev) => {
      const next = {};
      students.forEach((s) => {
        // keep previous value if id exists, else null
        next[s.id] = prev.hasOwnProperty(s.id) ? prev[s.id] : null;
      });
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students.map((s) => s.id).join(",")]);

  // Notify parent when attendance changes (if callback provided)
  useEffect(() => {
    if (onAttendanceChange) onAttendanceChange(attendance);
  }, [attendance, onAttendanceChange]);

  // Handler to toggle student's attendance
  function handleChange(id, newStatus) {
    setAttendance((prev) => ({ ...prev, [id]: newStatus }));
  }

  // Quick actions
  function markAll(status) {
    const next = {};
    students.forEach((s) => (next[s.id] = status));
    setAttendance(next);
  }

  function clearAll() {
    const next = {};
    students.forEach((s) => (next[s.id] = null));
    setAttendance(next);
  }

  // Totals
  const totals = useMemo(() => {
    let present = 0,
      absent = 0,
      late = 0;
    Object.values(attendance).forEach((v) => {
      if (v === "present") present++;
      if (v === "absent") absent++;
      if (v === "late") late++;
    });
    return { present, absent, late, total: students.length };
  }, [attendance, students.length]);

  const completion = useMemo(() => {
    const marked = totals.present + totals.absent + totals.late;
    const percent =
      totals.total > 0 ? Math.round((marked / totals.total) * 100) : 0;
    return { marked, percent };
  }, [totals.present, totals.absent, totals.late, totals.total]);

  const summaryConfig = useMemo(
    () => [
      {
        label: "Marked",
        value: completion.marked,
        subtext: `${completion.percent}% complete`,
        classes: "bg-[#b383ff]/10 text-[#7b2fff] border-[#b383ff]/30",
      },
      {
        label: "Present",
        value: totals.present,
        subtext: "Ready to learn",
        classes: "bg-emerald-50 text-emerald-900 border-emerald-100",
      },
      {
        label: "Absent",
        value: totals.absent,
        subtext: "Follow up needed",
        classes: "bg-rose-50 text-rose-900 border-rose-100",
      },
      {
        label: "Late",
        value: totals.late,
        subtext: "Arrivals pending",
        classes: "bg-amber-50 text-amber-900 border-amber-100",
      },
    ],
    [completion.marked, completion.percent, totals.present, totals.absent, totals.late]
  );

  return (
    <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/60">
      {/* Header: Title + Date + Quick actions */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-1">
              Daily Overview
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">Attendance Dashboard</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {dayName}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#b383ff]/10 text-[#7b2fff]">
                {formattedDate}
              </span>
              <label className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                <span>Class</span>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="bg-transparent text-slate-700 font-semibold focus:outline-none"
                  aria-label="Select class"
                >
                  {CLASS_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id} className="text-slate-900">
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-white border border-slate-100 shadow-sm">
            {/* Date selector */}
            <label className="text-xs font-semibold text-slate-500 flex flex-col gap-1">
              <span>Date</span>
              <input
                type="date"
                defaultValue={dateObj.toISOString().slice(0, 10)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#b383ff]/30 transition"
                onChange={(e) => {
                  // naive local handling: changing date does not change state; parent should control date if needed
                }}
                aria-label="Select date"
              />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              {/* Quick action buttons */}
              <button
                onClick={() => markAll("present")}
                className="px-3 py-2 bg-[#7b2fff] text-white rounded-xl text-sm font-semibold hover:bg-[#6a1fe6] transition-shadow shadow-sm"
                title="Mark all present"
              >
                Mark All Present
              </button>

              <button
                onClick={() => markAll("absent")}
                className="px-3 py-2 border border-[#7b2fff] text-[#7b2fff] rounded-xl text-sm font-semibold hover:bg-[#b383ff]/10 transition-shadow"
                title="Mark all absent"
              >
                Mark All Absent
              </button>

              <button
                onClick={clearAll}
                className="px-3 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl text-sm font-semibold hover:shadow-sm transition-shadow"
                title="Clear all"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {summaryConfig.map((card) => (
            <div
              key={card.label}
              className={`rounded-2xl border p-4 shadow-sm ${card.classes}`}
            >
              <div className="text-xs uppercase tracking-wide text-slate-500/80">
                {card.label}
              </div>
              <div className="text-2xl font-semibold text-slate-900 mt-1">{card.value}</div>
              <div className="text-xs text-slate-600 mt-1">{card.subtext}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Student list container */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        {/* Sticky header row */}
        <div className="sticky top-0 bg-white/95 backdrop-blur z-10 border-b px-4 py-3 flex items-center justify-between">
          <div className="text-sm font-medium text-slate-700 tracking-wide">Students</div>
          <div className="text-xs text-slate-500 hidden sm:block uppercase tracking-[0.2em]">
            Actions
          </div>
        </div>

        {/* Scrollable list */}
        <div className="max-h-[360px] overflow-y-auto">
          {students.map((s) => (
            <StudentRow
              key={s.id}
              student={s}
              status={attendance[s.id] ?? null}
              onChange={handleChange}
            />
          ))}

          {/* If no students */}
          {students.length === 0 && (
            <div className="p-6 text-sm text-slate-500">No students available.</div>
          )}
        </div>

        {/* Summary footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-4 border-t bg-slate-50 rounded-b-2xl">
          <div className="text-sm text-slate-700">
            <span className="font-semibold">{totals.total}</span> students
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <div>
              Present: <span className="font-semibold text-slate-800">{totals.present}</span>
            </div>
            <div>
              Absent: <span className="font-semibold text-slate-800">{totals.absent}</span>
            </div>
            <div>
              Late: <span className="font-semibold text-slate-800">{totals.late}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#b383ff]/10 rounded-lg border border-[#b383ff]/30">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-[#7b2fff]">Completion:</span>
                <span className="w-20 h-2 rounded-full bg-[#b383ff]/30 overflow-hidden shadow-inner">
                  <span
                    className="block h-full rounded-full bg-[#7b2fff] transition-all duration-300 ease-out"
                    style={{ width: `${completion.percent}%` }}
                  />
                </span>
              </div>
              <span className="text-sm font-bold text-[#7b2fff] min-w-[3rem]">
                {completion.percent}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

