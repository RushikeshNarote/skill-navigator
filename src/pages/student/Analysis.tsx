import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { analyzeSkillGap } from "@/lib/mockData";
import { PageHeader } from "@/components/ui-bits";
import { CheckCircle2, AlertCircle, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SkillAnalysis() {
  const { studentProfile } = useAuth();
  const navigate = useNavigate();
  if (!studentProfile) return null;

  const gap = analyzeSkillGap(studentProfile);

  if (!studentProfile.careerGoal) {
    return (
      <>
        <PageHeader title="Skill Gap Analysis" />
        <Card className="bg-gradient-card border-border/60">
          <CardContent className="p-12 text-center">
            <Sparkles className="h-10 w-10 text-primary mx-auto mb-3" />
            <div className="font-semibold text-lg">Pick a career goal first</div>
            <div className="text-sm text-muted-foreground mt-1">We need a target role to analyze your skill gaps.</div>
            <Button className="mt-5 bg-gradient-primary" onClick={() => navigate("/student/profile")}>
              Go to profile <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Skill Gap Analysis"
        subtitle={`AI-powered insights for your goal: ${studentProfile.careerGoal}`}
      />

      <Card className="bg-gradient-hero text-white border-0 shadow-glow mb-6">
        <CardContent className="p-7">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-sm uppercase tracking-wider opacity-80">Career match score</div>
              <div className="text-5xl font-bold mt-1">{gap.matchScore}%</div>
              <div className="text-sm opacity-90 mt-2">
                You match {gap.required.length - gap.missing.length} of {gap.required.length} required skills.
              </div>
            </div>
            <div className="h-24 w-24 rounded-full bg-white/15 backdrop-blur flex items-center justify-center text-3xl font-bold">
              {gap.matchScore}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" /> Skills you have
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {studentProfile.skills.map((s) => {
              const v = s.level === "Advanced" ? 100 : s.level === "Intermediate" ? 65 : 30;
              return (
                <div key={s.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-muted-foreground">{s.level}</span>
                  </div>
                  <Progress value={v} className="h-2" />
                </div>
              );
            })}
            {!studentProfile.skills.length && <span className="text-sm text-muted-foreground">Add skills in your profile.</span>}
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" /> Missing skills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {gap.missing.length ? gap.missing.map((s) => (
              <div key={s} className="flex items-center justify-between p-3 rounded-lg border border-warning/30 bg-warning/5">
                <span className="font-medium text-sm">{s}</span>
                <Badge variant="outline" className="border-warning text-warning">Required</Badge>
              </div>
            )) : (
              <div className="text-sm text-muted-foreground">🎉 You've covered all required skills!</div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-gradient-card border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> AI recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              Based on your goal of becoming a <span className="font-semibold text-foreground">{studentProfile.careerGoal}</span>, here's what we recommend you focus on next:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {gap.recommended.length ? gap.recommended.map((s, i) => (
                <div key={s} className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="h-8 w-8 rounded-lg bg-gradient-primary text-white flex items-center justify-center font-bold text-sm">{i + 1}</div>
                  <div>
                    <div className="font-medium text-sm">Learn {s}</div>
                    <div className="text-xs text-muted-foreground">High priority for your goal</div>
                  </div>
                </div>
              )) : <div className="text-sm text-muted-foreground">No additional recommendations right now.</div>}
            </div>
            <Button className="mt-5 bg-gradient-primary" onClick={() => navigate("/student/roadmap")}>
              View learning roadmap <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
