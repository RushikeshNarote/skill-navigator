import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/lib/mockData";
import DashboardLayout from "./DashboardLayout";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: ReactNode;
  role: Role;
}) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) {
    const dest = user.role === "student" ? "/student" : user.role === "mentor" ? "/mentor" : "/admin";
    return <Navigate to={dest} replace />;
  }
  return <DashboardLayout>{children}</DashboardLayout>;
}
