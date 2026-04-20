import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const dest = user.role === "student" ? "/student" : user.role === "mentor" ? "/mentor" : "/admin";
  return <Navigate to={dest} replace />;
};

export default Index;
