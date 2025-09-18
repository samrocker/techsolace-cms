// components/ui/StatCard.tsx
import React from "react";

// Defined Skeleton locally to resolve the import issue and make the component self-contained.
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-gray-200 animate-pulse rounded-md ${className}`} />
);

export const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-blue-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);
export const ProjectIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-green-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
    />
  </svg>
);

const StatCard = ({
  title,
  value,
  icon,
  loading,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  loading: boolean;
}) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
    <div className="bg-gray-100 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      {loading ? (
        <Skeleton className="h-8 w-20 mt-1" />
      ) : (
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      )}
    </div>
  </div>
);

export default StatCard;
