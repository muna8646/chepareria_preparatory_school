import { useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole: string;
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const rolesString = localStorage.getItem("roles");

    // Debug logs to confirm what's being read
    console.log("Token:", token);
    console.log("Roles String:", rolesString);

    if (!token || !rolesString) {
      console.warn("Missing token or roles → redirecting...");
      router.push("/");
      return;
    }

    let roles: string[] = [];
    try {
      roles = JSON.parse(rolesString);
      console.log("Parsed Roles Array:", roles);
    } catch (error) {
      console.error("Failed to parse roles:", error);
      router.push("/");
      return;
    }

    if (!roles.includes(allowedRole)) {
      console.warn(`Role ${allowedRole} not authorized → redirecting...`);
      router.push("/");
      return;
    }

    // Authorized!
    setIsAuthorized(true);
    setLoading(false);
  }, [allowedRole, router]);

  if (loading) return <div>Loading...</div>;
  if (!isAuthorized) return null;

  return <>{children}</>;
}
