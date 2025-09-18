import { useMemo } from "react";
import { Project } from "@/types";

export const StatusBadge = ({ status }: { status: Project["status"] }) => {
  const styles = useMemo(() => ({
    COMPLETED: "bg-green-100 text-green-800 border-green-200",
    IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200",
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  }), []);

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles[status]}`}>
      {status.replace("_", " ")}
    </span>
  );
};