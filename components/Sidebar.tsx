"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Users, GraduationCap, UserCheck } from "lucide-react";

export function Sidebar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch role from localStorage or API
    const role = localStorage.getItem("role"); // Assuming role is stored in localStorage

    if (role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
      router.push("/"); // Redirect non-admins to home page
    }
  }, []);

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen p-6">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-4">
        {isAdmin && (
          <>
            <Link href="/AdminDashboard" className="flex items-center gap-3 text-gray-700 hover:text-primary">
              <LayoutDashboard className="h-5 w-5" /> Dashboard
            </Link>
            <Link href="/Secretary" className="flex items-center gap-3 text-gray-700 hover:text-primary">
              <GraduationCap className="h-5 w-5" /> Secretary
            </Link>
            <Link href="/manage-teachers" className="flex items-center gap-3 text-gray-700 hover:text-primary">
              <UserCheck className="h-5 w-5" /> Register Teachers
            </Link>
            <Link href="/AddEventForm" className="flex items-center gap-3 text-gray-700 hover:text-primary">
              <Users className="h-5 w-5" /> Announcement
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
