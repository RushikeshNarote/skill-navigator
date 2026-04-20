import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard, PageHeader } from "@/components/ui-bits";
import { analyzeSkillGap, calcProfileCompletion, calcProgress } from "@/lib/mockData";
import { Target, TrendingUp, BookOpen, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function StudentDashboard() {
  const { user, studentProfile } = useAuth();
  const navigate = useNavigate();
  if (!studentProfile) return null;

  const completion = calcProfileCompletion(studentProfile);
  const progress = calcProgress(studentProfile.roadmap);
  const gap = analyzeSkillGap(studentProfile);
  const completed = studentProfile.roadmap.filter((t) => t.status === "Completed").length;
  const inProgress = studentProfile.roadmap.filter((t) => t.status === "In Progress").length;
  const notStarted = studentProfile.roadmap.filter((t) => t.status === "Not Started").length;
  const latestNote = studentProfile.notes[studentProfile.notes.length - 1];

  // chart data: tasks per week
  const byWeek = studentProfile.roadmap.reduce<Record<number, { week: string; done: number; total: number }>>((acc, t) => {
    const k = t.week;
    acc[k] = acc[k] || { week: `W${k}`, done: 0, total: 0 };
    acc[k].total++;
    if (t.status === "Completed") acc[k].done++;
    return acc;
  }, {});
  const chartData = Object.values(byWeek);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user?.name.split(" ")[0]} 👋`}
        subtitle="Here's a snapshot of your learning journey."
        action={
          <Button onClick={() => navigate("/student/analysis")} className="bg-gradient-primary shadow-md">
            <Sparkles className="h-4 w-4 mr-2" /> Run skill analysis
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Target} label="Profile complete" value={`${completion}%`} accent="primary" />
        <StatCard icon={TrendingUp} label="Roadmap progress" value={`${progress}%`} hint={`${completed} of ${studentProfile.roadmap.length} tasks`} accent="accent" />
        <StatCard icon={BookOpen} label="Skill gaps" value={gap.missing.length} hint="vs. career goal" accent="warning" />
        <StatCard icon={CheckCircle2} label="Match score" value={`${gap.matchScore}%`} hint={studentProfile.careerGoal || "Set a goal"} accent="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gradient-card border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Weekly progress</CardTitle>
            <Badge variant="secondary">{studentProfile.roadmap.length} tasks total</Badge>
          </CardHeader>
          <CardContent>
            {chartData.length ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                  <Bar dataKey="total" fill="hsl(var(--muted))" radius={[6, 6, 0, 0]} name="Total" />
                  <Bar dataKey="done" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">
                Set your career goal to generate your roadmap.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/60">
          <CardHeader>
            <CardTitle className="text-lg">Profile completion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Overall</span>
                <span className="font-semibold">{completion}%</span>
              </div>
              <Progress value={completion} className="h-2" />
            </div>
            <Button variant="outline" className="w-full" onClick={() => navigate("/student/profile")}>
              Update profile <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/60">
          <CardHeader><CardTitle className="text-lg">Strengths</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {gap.strengths.length ? gap.strengths.map((s) => (
              <Badge key={s} className="bg-success text-success-foreground">{s}</Badge>
            )) : <span className="text-sm text-muted-foreground">Add skills to see strengths.</span>}
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/60">
          <CardHeader><CardTitle className="text-lg">Areas to improve</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {[...gap.weaknesses, ...gap.missing].length ? [...gap.weaknesses, ...gap.missing].map((s) => (
              <Badge key={s} variant="outline" className="border-warning text-warning">{s}</Badge>
            )) : <span className="text-sm text-muted-foreground">Looking great — no gaps detected.</span>}
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/60">
          <CardHeader><CardTitle className="text-lg">Latest mentor guidance</CardTitle></CardHeader>
          <CardContent>
            {latestNote ? (
              <div className="space-y-2">
                <div className="text-sm">{latestNote.text}</div>
                <div className="text-xs text-muted-foreground">— {latestNote.from} · {latestNote.date}</div>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">No guidance yet. Your mentor will share tips soon.</span>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Completed", value: completed, color: "bg-success" },
          { label: "In Progress", value: inProgress, color: "bg-warning" },
          { label: "Not Started", value: notStarted, color: "bg-muted-foreground" },
        ].map((s) => (
          <Card key={s.label} className="bg-gradient-card border-border/60">
            <CardContent className="p-5 flex items-center gap-3">
              <div className={`h-10 w-1.5 rounded-full ${s.color}`} />
              <div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
