import React from "react";
import { CalendarDays, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

function DueDateBadge({ dueDate }) {
  if (!dueDate) return null;

  const due = new Date(dueDate);
  const now = new Date();
  const diffMs = due - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  let status = "normal";
  let label = "";

  if (diffDays < 0) {
    status = "overdue";
    label = `${Math.abs(diffDays)}d overdue`;
  } else if (diffDays === 0) {
    status = "today";
    label = "Due today";
  } else if (diffDays <= 2) {
    status = "soon";
    label = `Due in ${diffDays}d`;
  } else {
    label = due.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  const styles = {
    overdue:
      "bg-rose-50 text-rose-700 border-rose-200",
    today:
      "bg-amber-50 text-amber-700 border-amber-200",
    soon:
      "bg-blue-50 text-blue-700 border-blue-200",
    normal:
      "bg-gray-100 text-gray-600 border-gray-200",
  };

  const icons = {
    overdue: <AlertTriangle size={11} />,
    today: <Clock size={11} />,
    soon: <Clock size={11} />,
    normal: <CalendarDays size={11} />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${styles[status]}`}
    >
      {icons[status]}
      {label}
    </span>
  );
}

export default DueDateBadge;
