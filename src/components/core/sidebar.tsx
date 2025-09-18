// components/Sidebar.tsx
"use client"; // Add this directive for Next.js App Router

import React, { useState } from "react";
import Image from "next/image";
import {
  LayoutGrid,
  Users,
  ClipboardList,
  Clock,
  CalendarCheck,
  FileText,
  GitBranch,
  ChevronDown,
  ChevronUp,
  Video,
  User,
  LogOut,
} from "lucide-react";
import Logo from "../../../public/images/TechsolaceLogoBlack.png";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Define the type for a navigation item
type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  hasDropdown?: boolean;
};

// Array of navigation items - removed 'active' property
const navItems: NavItem[] = [
  {
    name: "Dashboard",
    icon: LayoutGrid,
    href: "/dashboard",
    hasDropdown: false,
  },
  { name: "Employees", icon: Users, href: "/employees", hasDropdown: true },
  {
    name: "Checklist",
    icon: ClipboardList,
    href: "/checklist",
    hasDropdown: true,
  },
  { name: "Time Off", icon: Clock, href: "/time-off", hasDropdown: true },
  {
    name: "Attendance",
    icon: CalendarCheck,
    href: "/attendance",
    hasDropdown: true,
  },
  { name: "Payroll", icon: FileText, href: "/payroll", hasDropdown: true },
  {
    name: "Recruitment",
    icon: GitBranch,
    href: "/recruitment",
    hasDropdown: true,
  },
];

// Sidebar Component
const Sidebar = () => {
  const pathname = usePathname();
  const [isProfileOpen, setProfileOpen] = useState(false);

  return (
    <aside className="w-72 bg-gray-50 h-screen flex flex-col justify-between p-5 rounded-r-2xl border-r-[1px] relative">
      <div>
        {/* Logo */}
        <div className="w-full flex-between gap-1 mb-10">
          <Link href="/dashboard">
            <Image
              src={Logo}
              alt="Techsolace Logo"
              width={1920}
              height={1920}
              className="h-16 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between p-3 rounded-lg font-medium text-base transition-colors duration-200 ${
                      isActive
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        size={20}
                        className={isActive ? "text-white" : "text-gray-500"}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.hasDropdown && <ChevronDown size={20} />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="flex flex-col gap-6">
        {/* Daily Meeting Card */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="flex -space-x-2">
              <Image
                src="https://i.pravatar.cc/150?img=1"
                alt="User 1"
                width={32}
                height={32}
                className="rounded-full border-2 border-white"
              />
              <Image
                src="https://i.pravatar.cc/150?img=2"
                alt="User 2"
                width={32}
                height={32}
                className="rounded-full border-2 border-white"
              />
              <Image
                src="https://i.pravatar.cc/150?img=3"
                alt="User 3"
                width={32}
                height={32}
                className="rounded-full border-2 border-white"
              />
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Video size={20} className="text-green-600" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-semibold text-gray-800">Daily Meeting</h3>
            <p className="text-sm text-gray-500">9:30 - 10:30 AM on Zoom</p>
          </div>
          <a
            href="https://zoom.us/" // Example meeting link
            target="_blank"
            rel="noopener noreferrer"
            className="w-full block text-center bg-gray-900 text-white font-semibold text-sm py-2.5 mt-4 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Join now
          </a>
        </div>

        {/* User Profile Section */}
        <div className="relative">
          {isProfileOpen && (
            <div className="absolute bottom-full mb-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-2">
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <User size={16} />
                Profile
              </Link>
              <button
                onClick={() => alert("Logging out...")}
                className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
          <div
            className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-gray-200"
            onClick={() => setProfileOpen(!isProfileOpen)}
          >
            <div className="flex items-center gap-3">
              <Image
                src="https://i.pravatar.cc/150?img=5"
                alt="Jaydon Levin"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold text-sm text-gray-800">
                  Jaydon Levin
                </p>
                <p className="text-xs text-gray-500">kevin@gmail.com</p>
              </div>
            </div>
            {isProfileOpen ? (
              <ChevronUp size={20} className="text-gray-500" />
            ) : (
              <ChevronDown size={20} className="text-gray-500" />
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
