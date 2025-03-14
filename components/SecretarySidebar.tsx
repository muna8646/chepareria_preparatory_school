"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, UserPlus, UserCheck, LayoutDashboard, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const SecretarySidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    router.push("/");
  };

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/SecretaryDashboard" },
    { label: "Student Admission", icon: UserPlus, href: "/admit-student" },
    { label: "Fee Payment", icon: UserCheck, href: "/fee-payment" },
    { label: "Assign Teachers", icon: Users, href: "/assign-teachers" },
  ];

  return (
    <div className="w-64 bg-green-700 text-white min-h-screen flex flex-col justify-between">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Secretary</h2>

        <nav className="flex flex-col space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-white",
                    isActive ? "bg-green-500 hover:bg-green-600" : "hover:bg-green-600"
                  )}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4">
        <Button
          variant="destructive"
          className="w-full bg-red-600 hover:bg-red-700"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
};
