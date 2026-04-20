import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskStatus, calcProgress } from "@/lib/mockData";
import { PageHeader } from "@/components/ui-bits";
import { Circle, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusMeta: Record<TaskStatus, { icon: any; color: string; bg: string }> = {
  "Not Started": { icon: Circle, color: "text-muted-foreground", bg: "bg-muted" },
  "In Progress": { icon: Clock, color: "text-warning", bg: "bg-warning/15" },
  "Completed": { icon: CheckCircle2, color: "text-success", bg: "bg-success/15" },
};

export default function Roadmap() {
  const { studentProfile, updateStudentProfile } = useAuth();
  if (!studentProfile) return null;

  const progress = calcProgress(studentProfile.roadmap);
  const weeks = [...new Set(studentProfile.roadmap.map((t) => t.week))].sort((a, b) => a - b);

  const setStatus = (id: string, status: TaskStatus) => {
    const updated = {
      ...studentProfile,
      roadmap: studentProfile.roadmap.map((t) => (t.id === id ? { ...t, status } : t)),
    };
    updateStudentProfile(updated);
    if (status === "Completed") toast.success("Task completed! 🎉");
  };

  if (!studentProfile.roadmap.length) {
    return (
      <>
        <PageHeader title="Learning Roadmap" />
        <Card className="bg-gradient-card border-border/60">
          <CardContent className="p-12 text-center text-muted-foreground">
            Set a career goal in your profile to generate your personalized roadmap.
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Learning Roadmap"
        subtitle={`Your personalized path toward becoming a ${studentProfile.careerGoal}`}
      />

      <Card className="bg-gradient-card border-border/60 mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold">Overall progress</div>
            <span className="text-2xl font-bold text-gradient">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </CardContent>
      </Card>

      <div className="space-y-8">
        {weeks.map((w) => (
          <div key={w} className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-primary text-white flex items-center justify-center font-bold shadow-md">
                W{w}
              </div>
              <div>
                <div className="font-semibold">Week {w}</div>
                <div className="text-xs text-muted-foreground">
                  {studentProfile.roadmap.filter((t) => t.week === w && t.status === "Completed").length} of {studentProfile.roadmap.filter((t) => t.week === w).length} completed
                </div>
              </div>
            </div>

            <div className="ml-5 border-l-2 border-dashed border-border pl-8 space-y-3">
              {studentProfile.roadmap.filter((t) => t.week === w).map((task) => {
                const Meta = statusMeta[task.status];
                return (
                  <Card key={task.id} className="bg-gradient-card border-border/60 relative">
                    <div className={cn("absolute -left-[42px] top-5 h-4 w-4 rounded-full border-2 border-background", Meta.bg)}>
                      <Meta.icon className={cn("h-3 w-3 absolute inset-0.5", Meta.color)} />
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold">{task.title}</div>
                          <div className="text-sm text-muted-foreground mt-1">{task.description}</div>
                        </div>
                        <Select value={task.status} onValueChange={(v) => setStatus(task.id, v as TaskStatus)}>
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Not Started">Not Started</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
