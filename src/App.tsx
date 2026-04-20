import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

import StudentDashboard from "./pages/student/Dashboard";
import StudentProfile from "./pages/student/Profile";
import SkillAnalysis from "./pages/student/Analysis";
import Roadmap from "./pages/student/Roadmap";

import MentorDashboard from "./pages/mentor/Dashboard";
import MentorStudents from "./pages/mentor/Students";
import StudentDetail from "./pages/mentor/StudentDetail";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminActivity from "./pages/admin/Activity";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />

            <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />
            <Route path="/student/analysis" element={<ProtectedRoute role="student"><SkillAnalysis /></ProtectedRoute>} />
            <Route path="/student/roadmap" element={<ProtectedRoute role="student"><Roadmap /></ProtectedRoute>} />

            <Route path="/mentor" element={<ProtectedRoute role="mentor"><MentorDashboard /></ProtectedRoute>} />
            <Route path="/mentor/students" element={<ProtectedRoute role="mentor"><MentorStudents /></ProtectedRoute>} />
            <Route path="/mentor/student/:id" element={<ProtectedRoute role="mentor"><StudentDetail /></ProtectedRoute>} />

            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/activity" element={<ProtectedRoute role="admin"><AdminActivity /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
