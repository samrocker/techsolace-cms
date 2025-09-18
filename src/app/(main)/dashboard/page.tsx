"use client";
import { getAccessToken } from "@/lib/auth";
import { GRAPHQL_API_URL } from "@/lib/env";
import React, { useState, useEffect, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

// ----------------------------------------------------

// --- TYPE DEFINITIONS ---
interface Role {
  name: string;
}

interface User {
  id: string;
  email: string;
  username: string;
  phone: string;
  roleId: string;
  role: Role | null;
  createdAt: string;
  updatedAt: string;
}

interface MeData extends Omit<User, "role"> {
  role: Role;
}

interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

interface Company {
  id: string;
  name: string;
  logo: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING";
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ProjectsResponse {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
}

interface DashboardData {
  me: MeData;
  company: Company;
  usersData: UsersResponse;
  projectsData: ProjectsResponse;
}

// --- API SERVICE LAYER ---
const api = {
  fetchGraphQL: async (query: string, variables: Record<string, any> = {}) => {
    const token = getAccessToken();
    const response = await fetch(`${GRAPHQL_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables }),
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error("GraphQL HTTP Error:", response.status, errorBody);
      throw new Error(`Network error: ${response.statusText}`);
    }
    const jsonResponse = await response.json();
    if (jsonResponse.errors) {
      console.error("GraphQL Errors:", jsonResponse.errors);
      throw new Error(
        jsonResponse.errors.map((e: any) => e.message).join(", ")
      );
    }
    return jsonResponse.data;
  },

  getMe: () =>
    api.fetchGraphQL(
      `query GetMe { me { id email username phone roleId createdAt updatedAt role { name } } }`
    ),
  getCompany: () =>
    api.fetchGraphQL(
      `query GetCompany { company { id name logo createdAt updatedAt } }`
    ),
  getUsers: (page = 1, limit = 5) =>
    api.fetchGraphQL(
      `
    query GetUsers($page: Int, $limit: Int) {
      users(page: $page, limit: $limit) {
        users { id email username phone roleId role { name } createdAt updatedAt }
        total page limit
      }
    }`,
      { page, limit }
    ),
  getProjects: (page = 1, limit = 5) =>
    api.fetchGraphQL(
      `
    query GetProjects($page: Int, $limit: Int) {
      projects(page: $page, limit: $limit) {
        projects { id name description status startDate endDate createdAt updatedAt }
        total page limit
      }
    }`,
      { page, limit }
    ),
};

// --- CUSTOM HOOK for DATA FETCHING ---
const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [meData, companyData, usersData, projectsData] =
          await Promise.all([
            api.getMe(),
            api.getCompany(),
            api.getUsers(),
            api.getProjects(),
          ]);
        setData({
          me: meData.me,
          company: companyData.company,
          usersData: usersData.users,
          projectsData: projectsData.projects,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred.";
        setError(`Failed to fetch dashboard data: ${errorMessage}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  return { data, loading, error };
};

// --- UI HELPER & GENERIC COMPONENTS ---
const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-gray-200 animate-pulse rounded-md ${className}`} />
);

const UserIcon = () => (
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
const ProjectIcon = () => (
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
const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-yellow-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-purple-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const StatusBadge = ({ status }: { status: Project["status"] }) => {
  const styles = useMemo(
    () => ({
      COMPLETED: "bg-green-100 text-green-800 border-green-200",
      IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    }),
    []
  );
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
};

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

// --- DASHBOARD SUB-COMPONENTS (REDESIGNED) ---
const DashboardHeader = ({
  loading,
  me,
  company,
}: {
  loading: boolean;
  me?: MeData;
  company?: Company;
}) => (
  <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8">
    <div>
      {loading ? (
        <>
          <Skeleton className="h-9 w-72 mb-2" />
          <Skeleton className="h-5 w-96" />
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {me?.username || "User"}!
          </h1>
          <p className="text-gray-500 mt-1">
            Here's a snapshot of {company?.name || "your company"}'s activity.
          </p>
        </>
      )}
    </div>
  </header>
);

const ProjectStatusChart = ({
  loading,
  data,
}: {
  loading: boolean;
  data: { name: string; value: number }[];
}) => {
  const COLORS = {
    "In Progress": "#3b82f6",
    Completed: "#16a34a", 
    Pending: "#f59e0b", 
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        Project Status
      </h2>
      {loading ? (
        <div className="flex-grow flex items-center justify-center">
          <Skeleton className="h-48 w-48 rounded-full" />
        </div>
      ) : (
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={COLORS[entry.name as keyof typeof COLORS]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

const ProjectsTable = ({
  loading,
  projects,
}: {
  loading: boolean;
  projects?: Project[];
}) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <h2 className="text-xl font-semibold mb-4 text-gray-900">
      Recent Projects
    </h2>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500 text-sm">
            <th className="py-3 px-2 font-medium">Name</th>
            <th className="py-3 px-2 font-medium">Status</th>
            <th className="py-3 px-2 font-medium">End Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  <td className="py-4 px-2">
                    <Skeleton className="h-5 w-24" />
                  </td>
                  <td className="py-4 px-2">
                    <Skeleton className="h-6 w-28" />
                  </td>
                  <td className="py-4 px-2">
                    <Skeleton className="h-5 w-20" />
                  </td>
                </tr>
              ))
            : projects?.map((p) => (
                <tr key={p.id}>
                  <td className="py-4 px-2 font-medium text-gray-800">
                    {p.name}
                  </td>
                  <td className="py-4 px-2">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="py-4 px-2 text-gray-600">
                    {formatDate(p.endDate)}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  </div>
);

const UsersTable = ({
  loading,
  users,
}: {
  loading: boolean;
  users?: User[];
}) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <h2 className="text-xl font-semibold mb-4 text-gray-900">New Users</h2>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500 text-sm">
            <th className="py-3 px-2 font-medium">Username</th>
            <th className="py-3 px-2 font-medium">Email</th>
            <th className="py-3 px-2 font-medium">Date Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  <td className="py-4 px-2">
                    <Skeleton className="h-5 w-24" />
                  </td>
                  <td className="py-4 px-2">
                    <Skeleton className="h-5 w-32" />
                  </td>
                  <td className="py-4 px-2">
                    <Skeleton className="h-5 w-20" />
                  </td>
                </tr>
              ))
            : users?.map((u) => (
                <tr key={u.id}>
                  <td className="py-4 px-2 font-medium text-gray-800">
                    {u.username}
                  </td>
                  <td className="py-4 px-2 text-gray-600">{u.email}</td>
                  <td className="py-4 px-2 text-gray-600">
                    {formatDate(u.createdAt)}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT (REDESIGNED) ---
const DashboardPage = () => {
  const { data, loading, error } = useDashboardData();

  const analytics = useMemo(() => {
    if (!data?.projectsData?.projects) {
      return {
        inProgressCount: 0,
        completedCount: 0,
        chartData: [],
      };
    }
    const projects = data.projectsData.projects;
    const inProgressCount = projects.filter(
      (p) => p.status === "IN_PROGRESS"
    ).length;
    const completedCount = projects.filter(
      (p) => p.status === "COMPLETED"
    ).length;
    const pendingCount = projects.filter((p) => p.status === "PENDING").length;

    const chartData = [
      { name: "In Progress", value: inProgressCount },
      { name: "Completed", value: completedCount },
      { name: "Pending", value: pendingCount },
    ].filter((item) => item.value > 0); // Only show statuses with projects

    return { inProgressCount, completedCount, chartData };
  }, [data]);

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* ROW 1: HEADER */}
        <DashboardHeader
          loading={loading}
          me={data?.me}
          company={data?.company}
        />

        {error && (
          <div className="bg-red-100 text-red-800 border border-red-200 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* ROW 2: AT-A-GLANCE STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={data?.usersData?.total ?? 0}
            icon={<UserIcon />}
            loading={loading}
          />
          <StatCard
            title="Total Projects"
            value={data?.projectsData?.total ?? 0}
            icon={<ProjectIcon />}
            loading={loading}
          />
          <StatCard
            title="In Progress"
            value={analytics.inProgressCount}
            icon={<ClockIcon />}
            loading={loading}
          />
          <StatCard
            title="Completed"
            value={analytics.completedCount}
            icon={<CheckCircleIcon />}
            loading={loading}
          />
        </div>

        {/* ROW 3: MAIN ANALYTICS */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
          <div className="lg:col-span-2">
            <ProjectStatusChart loading={loading} data={analytics.chartData} />
          </div>
          <div className="lg:col-span-3">
            <ProjectsTable
              loading={loading}
              projects={data?.projectsData.projects}
            />
          </div>
        </div>

        {/* ROW 4: SECONDARY DATA */}
        <UsersTable loading={loading} users={data?.usersData.users} />
      </div>
    </div>
  );
};

export default DashboardPage;
