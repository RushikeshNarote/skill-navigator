import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Role, StudentProfile, MOCK_STUDENTS, initialStudentForSignup, sampleRoadmap as _ } from "@/lib/mockData";
import { CAREER_REQUIREMENTS } from "@/lib/mockData";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthCtx {
  user: User | null;
  studentProfile: StudentProfile | null;
  login: (email: string, role: Role) => void;
  signup: (name: string, email: string, role: Role) => void;
  logout: () => void;
  updateStudentProfile: (p: StudentProfile) => void;
}

const Ctx = createContext<AuthCtx | null>(null);

const STORAGE_KEY = "skillgap.user";
const PROFILE_KEY = "skillgap.profile";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const profRaw = localStorage.getItem(PROFILE_KEY);
    if (raw) setUser(JSON.parse(raw));
    if (profRaw) setStudentProfile(JSON.parse(profRaw));
  }, []);

  const persist = (u: User | null, p: StudentProfile | null) => {
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
    if (p) localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    else localStorage.removeItem(PROFILE_KEY);
  };

  const login = (email: string, role: Role) => {
    const name = email.split("@")[0].replace(/\b\w/g, (c) => c.toUpperCase());
    const u: User = { id: "u-" + Date.now(), name, email, role };
    let prof: StudentProfile | null = null;
    if (role === "student") {
      // load demo student so the dashboard has data
      prof = { ...MOCK_STUDENTS[0], name, email };
    }
    setUser(u);
    setStudentProfile(prof);
    persist(u, prof);
  };

  const signup = (name: string, email: string, role: Role) => {
    const u: User = { id: "u-" + Date.now(), name, email, role };
    let prof: StudentProfile | null = null;
    if (role === "student") {
      prof = initialStudentForSignup(name, email);
    }
    setUser(u);
    setStudentProfile(prof);
    persist(u, prof);
  };

  const logout = () => {
    setUser(null);
    setStudentProfile(null);
    persist(null, null);
  };

  const updateStudentProfile = (p: StudentProfile) => {
    setStudentProfile(p);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  };

  return (
    <Ctx.Provider value={{ user, studentProfile, login, signup, logout, updateStudentProfile }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
