import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, User, Target, Map, Users, Settings, LogOut,
  GraduationCap, ShieldCheck, Sparkles, Activity,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const studentLinks = [
  { to: "/student", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/student/profile", label: "Profile & Skills", icon: User },
  { to: "/student/analysis", label: "Skill Gap Analysis", icon: Target },
  { to: "/student/roadmap", label: "Learning Roadmap", icon: Map },
];
const mentorLinks = [
  { to: "/mentor", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/mentor/students", label: "My Students", icon: Users },
];
const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "User Management", icon: Users },
  { to: "/admin/activity", label: "Activity & Logs", icon: Activity },
];

const roleIcon = {
  student: GraduationCap,
  mentor: Sparkles,
  admin: ShieldCheck,
};

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;
  const links = user.role === "student" ? studentLinks : user.role === "mentor" ? mentorLinks : adminLinks;
  const RoleIcon = roleIcon[user.role];

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-6 py-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-sidebar-primary-foreground tracking-tight">SkillPath</div>
            <div className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">Learning OS</div>
          </div>
        </div>
      </div>

      <div className="px-3 py-4">
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-sidebar-accent">
          <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-semibold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-sidebar-primary-foreground truncate">{user.name}</div>
            <div className="text-[11px] flex items-center gap-1 text-sidebar-foreground/70 capitalize">
              <RoleIcon className="h-3 w-3" /> {user.role}
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                isActive
                  ? "bg-gradient-primary text-white shadow-md"
                  : "hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-primary-foreground"
              )
            }
          >
            <l.icon className="h-4 w-4" />
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-primary-foreground"
          onClick={() => { logout(); navigate("/login"); }}
        >
          <LogOut className="h-4 w-4 mr-2" /> Sign out
        </Button>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-subtle flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 border-r border-sidebar-border">
        <SidebarInner />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-sidebar border-sidebar-border">
          <SidebarInner onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden h-14 border-b bg-card flex items-center px-4 gap-3">
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="font-semibold text-gradient">SkillPath</div>
        </header>
        <main key={location.pathname} className="flex-1 p-4 md:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
