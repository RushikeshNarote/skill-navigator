import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/lib/mockData";
import { GraduationCap, Sparkles, ShieldCheck, ArrowRight, Target, Map, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const roleOptions: { value: Role; label: string; desc: string; icon: any }[] = [
  { value: "student", label: "Student", desc: "Identify gaps & track learning", icon: GraduationCap },
  { value: "mentor", label: "Mentor", desc: "Guide assigned students", icon: Sparkles },
  { value: "admin", label: "Admin", desc: "Manage the platform", icon: ShieldCheck },
];

export default function Login() {
  const { user, login, signup } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("demo1234");
  const [mode, setMode] = useState<"login" | "signup">("login");

  if (user) {
    const dest = user.role === "student" ? "/student" : user.role === "mentor" ? "/mentor" : "/admin";
    return <Navigate to={dest} replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || (mode === "signup" && !name)) {
      toast.error("Please fill in all fields");
      return;
    }
    if (mode === "login") login(email, role);
    else signup(name, email, role);
    toast.success(`Welcome${mode === "signup" ? "" : " back"}!`);
    const dest = role === "student" ? "/student" : role === "mentor" ? "/mentor" : "/admin";
    navigate(dest);
  };

  const quickDemo = (r: Role) => {
    login(`demo.${r}@uni.edu`, r);
    toast.success(`Logged in as demo ${r}`);
    navigate(r === "student" ? "/student" : r === "mentor" ? "/mentor" : "/admin");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left: Hero */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-hero text-white overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <div className="font-bold text-lg">SkillPath</div>
            <div className="text-xs opacity-80">Learning OS</div>
          </div>
        </div>

        <div className="relative z-10 space-y-8 max-w-md">
          <div>
            <h1 className="text-5xl font-bold tracking-tight leading-tight">
              Bridge the gap between<br/>
              <span className="text-white/80">where you are</span> and where you're going.
            </h1>
            <p className="mt-5 text-white/80 text-lg leading-relaxed">
              AI-powered skill-gap analysis and personalized learning roadmaps — built for students, mentors, and institutions.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Target, label: "Gap analysis" },
              { icon: Map, label: "Roadmap" },
              { icon: BarChart3, label: "Progress" },
            ].map((f) => (
              <div key={f.label} className="rounded-xl bg-white/10 backdrop-blur border border-white/15 p-4">
                <f.icon className="h-5 w-5 mb-2" />
                <div className="text-sm font-medium">{f.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs opacity-70">© 2025 SkillPath · Demo build</div>
      </div>

      {/* Right: Form */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="font-bold text-xl text-gradient">SkillPath</div>
          </div>

          <h2 className="text-3xl font-bold tracking-tight">{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          <p className="text-muted-foreground mt-1.5">
            {mode === "login" ? "Sign in to your account to continue." : "Pick your role to get started."}
          </p>

          <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="mt-7">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value={mode} className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">I am a</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {roleOptions.map((r) => (
                      <button
                        type="button"
                        key={r.value}
                        onClick={() => setRole(r.value)}
                        className={cn(
                          "p-3 rounded-xl border-2 transition-all text-left",
                          role === r.value
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        <r.icon className={cn("h-4 w-4 mb-1.5", role === r.value ? "text-primary" : "text-muted-foreground")} />
                        <div className="text-sm font-semibold">{r.label}</div>
                        <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">{r.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {mode === "signup" && (
                  <div>
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Aarav Sharma" className="mt-1.5" />
                  </div>
                )}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@uni.edu" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
                </div>

                <Button type="submit" className="w-full bg-gradient-primary hover:opacity-95 shadow-md">
                  {mode === "login" ? "Sign in" : "Create account"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-8 pt-6 border-t">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Try a demo account</div>
            <div className="grid grid-cols-3 gap-2">
              {roleOptions.map((r) => (
                <Button key={r.value} variant="outline" size="sm" onClick={() => quickDemo(r.value)} className="text-xs">
                  <r.icon className="h-3 w-3 mr-1.5" /> {r.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
