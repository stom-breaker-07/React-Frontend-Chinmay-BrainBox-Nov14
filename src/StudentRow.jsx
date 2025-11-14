import React from "react";

/**
 * StudentRow
 * Renders a single student's row with Present / Absent / Late buttons.
 *
 * Props:
 * - student: { id, name, roll }
 * - status: 'present' | 'absent' | 'late' | null
 * - onChange: (id, newStatus) => void
 */
export default function StudentRow({ student, status, onChange }) {
  const btnBase =
    "px-3 py-1 rounded-full text-sm font-medium transition-shadow focus:outline-none focus:ring-2";

  const statusStyles = {
    present: {
      container: "border-l-4 border-l-emerald-400 bg-emerald-50/70",
      badge: "bg-emerald-100 text-emerald-700",
    },
    absent: {
      container: "border-l-4 border-l-rose-400 bg-rose-50/70",
      badge: "bg-rose-100 text-rose-700",
    },
    late: {
      container: "border-l-4 border-l-amber-400 bg-amber-50/70",
      badge: "bg-amber-100 text-amber-700",
    },
    default: {
      container: "bg-white hover:bg-slate-50",
      badge: "bg-slate-100 text-slate-600",
    },
  };

  const currentStyle = statusStyles[status] ?? statusStyles.default;

  return (
    <div
      className={`flex items-center justify-between gap-4 py-3 px-4 border-b last:border-b-0 transition-colors ${
        currentStyle.container
      }`}
    >
      {/* Left: avatar + name */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-11 h-11 rounded-2xl bg-[#b383ff]/10 flex items-center justify-center text-[#7b2fff] font-semibold text-sm shrink-0 shadow-inner">
          {student.name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")}
        </div>

        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-800 truncate">
            {student.name}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Roll {student.roll}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${currentStyle.badge}`}
            >
              {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Not Marked"}
            </span>
          </div>
        </div>
      </div>

      {/* Right: status buttons */}
      <div className="flex items-center gap-2">
        <button
          aria-pressed={status === "present"}
          aria-label={`Mark ${student.name} present`}
          className={`${btnBase} ${
            status === "present"
              ? "bg-emerald-100 text-emerald-700 shadow-sm"
              : "bg-white text-slate-700 border border-transparent hover:shadow-sm"
          }`}
          onClick={() => onChange(student.id, status === "present" ? null : "present")}
        >
          Present
        </button>

        <button
          aria-pressed={status === "absent"}
          aria-label={`Mark ${student.name} absent`}
          className={`${btnBase} ${
            status === "absent"
              ? "bg-rose-100 text-rose-700 shadow-sm"
              : "bg-white text-slate-700 border border-transparent hover:shadow-sm"
          }`}
          onClick={() => onChange(student.id, status === "absent" ? null : "absent")}
        >
          Absent
        </button>

        <button
          aria-pressed={status === "late"}
          aria-label={`Mark ${student.name} late`}
          className={`${btnBase} ${
            status === "late"
              ? "bg-amber-100 text-amber-700 shadow-sm"
              : "bg-white text-slate-700 border border-transparent hover:shadow-sm"
          }`}
          onClick={() => onChange(student.id, status === "late" ? null : "late")}
        >
          Late
        </button>
      </div>
    </div>
  );
}
