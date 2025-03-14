"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, UserPlus, ClipboardList, CheckSquare, LogOut } from "lucide-react";

export default function TeacherSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { label: "Dashboard Home", href: "/TeacherDashboard", icon: Home },
    { label: "My Students", href: "/Mystudents", icon: UserPlus },
    { label: "Academics", href: "/upload-academic", icon: ClipboardList },
    { label: "Announcement", href: "/TeacherEventForm", icon: ClipboardList },
  ];

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    router.push("/");
  }

  return (
    <aside className="w-64 bg-white border-r shadow-md flex flex-col justify-between h-screen">
      <div>
        <div className="flex items-center justify-center h-16 border-b px-4">
          <h2 className="text-lg font-bold">Teacher Panel</h2>
        </div>

        <nav className="flex flex-col py-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center px-5 py-3 text-sm font-medium cursor-pointer transition-colors hover:bg-primary/10 ${
                    isActive ? "bg-primary/20 text-primary font-semibold" : "text-gray-700"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" /> Logout
        </button>
      </div>
    </aside>
  );
}

export { TeacherSidebar };
