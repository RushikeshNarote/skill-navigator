import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard, PageHeader } from "@/components/ui-bits";
import { MOCK_STUDENTS, calcProgress, riskLevel, analyzeSkillGap } from "@/lib/mockData";
import { Users, AlertTriangle, TrendingUp, GraduationCap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const riskStyle = {
  Low: "bg-success/15 text-success border-success/30",
  Medium: "bg-warning/15 text-warning border-warning/30",
  High: "bg-destructive/15 text-destructive border-destructive/30",
};

export default function MentorDashboard() {
  const navigate = useNavigate();
  const myStudents = MOCK_STUDENTS.filter((s) => s.mentorId === "m1");
  const high = myStudents.filter((s) => riskLevel(s) === "High").length;
  const avgProgress = Math.round(myStudents.reduce((a, s) => a + calcProgress(s.roadmap), 0) / Math.max(1, myStudents.length));

  return (
    <>
      <PageHeader title="Mentor Dashboard" subtitle="Monitor your students and provide guidance." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={Users} label="Assigned students" value={myStudents.length} accent="primary" />
        <StatCard icon={AlertTriangle} label="At-risk students" value={high} hint="Need attention" accent="warning" />
        <StatCard icon={TrendingUp} label="Avg. progress" value={`${avgProgress}%`} accent="success" />
      </div>

      <h2 className="text-lg font-semibold mb-4">Your students</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {myStudents.map((s) => {
          const progress = calcProgress(s.roadmap);
          const risk = riskLevel(s);
          const gap = analyzeSkillGap(s);
          const topLevel = s.skills.find((x) => x.level === "Advanced")?.level
            ?? s.skills.find((x) => x.level === "Intermediate")?.level
            ?? s.skills[0]?.level ?? "—";
          return (
            <Card key={s.id} className="bg-gradient-card border-border/60 hover:shadow-elegant transition-all hover:-translate-y-0.5 cursor-pointer" onClick={() => navigate(`/mentor/student/${s.id}`)}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-primary text-white flex items-center justify-center font-bold shadow-md">
                    {s.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{s.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{s.branch} · {s.year}</div>
                  </div>
                  <Badge variant="outline" className={cn("border", riskStyle[risk])}>{risk} risk</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Career goal</span>
                    <span className="font-medium">{s.careerGoal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Top skill level</span>
                    <span className="font-medium">{topLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Skill gaps</span>
                    <span className="font-medium">{gap.missing.length}</span>
                  </div>
                </div>

                <Button variant="ghost" size="sm" className="w-full mt-4 justify-between hover:bg-primary/5">
                  View details <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
