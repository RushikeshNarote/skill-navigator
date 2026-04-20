import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard, PageHeader } from "@/components/ui-bits";
import { Users, GraduationCap, Sparkles, Activity } from "lucide-react";
import { MOCK_STUDENTS, MOCK_MENTORS, ACTIVITY_FEED } from "@/lib/mockData";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { Badge } from "@/components/ui/badge";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--success))"];

export default function AdminDashboard() {
  const totalStudents = MOCK_STUDENTS.length;
  const totalMentors = MOCK_MENTORS.length;
  const total = totalStudents + totalMentors + 2; // + admins

  const pieData = [
    { name: "Students", value: totalStudents },
    { name: "Mentors", value: totalMentors },
    { name: "Admins", value: 2 },
  ];

  const activityTrend = [
    { day: "Mon", actions: 12 },
    { day: "Tue", actions: 19 },
    { day: "Wed", actions: 14 },
    { day: "Thu", actions: 25 },
    { day: "Fri", actions: 22 },
    { day: "Sat", actions: 10 },
    { day: "Sun", actions: 8 },
  ];

  return (
    <>
      <PageHeader title="Admin Dashboard" subtitle="System-wide overview & activity." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total users" value={total} accent="primary" />
        <StatCard icon={GraduationCap} label="Students" value={totalStudents} accent="accent" />
        <StatCard icon={Sparkles} label="Mentors" value={totalMentors} accent="success" />
        <StatCard icon={Activity} label="Daily actions" value="110" hint="Last 7 days" accent="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gradient-card border-border/60">
          <CardHeader><CardTitle>Activity (last 7 days)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={activityTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Line type="monotone" dataKey="actions" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 5, fill: "hsl(var(--primary))" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/60">
          <CardHeader><CardTitle>User distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={4}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 text-xs mt-2">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />
                  {d.name} ({d.value})
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-gradient-card border-border/60">
          <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {ACTIVITY_FEED.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Activity className="h-4 w-4" />
                  </div>
                  <span className="text-sm">{a.text}</span>
                </div>
                <Badge variant="secondary" className="text-xs">{a.time}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
