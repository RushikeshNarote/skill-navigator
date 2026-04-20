import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui-bits";
import { ACTIVITY_FEED } from "@/lib/mockData";
import { Activity, CheckCircle, MessageSquare, UserPlus, FileText, StickyNote } from "lucide-react";

const iconMap: Record<string, any> = {
  task: CheckCircle,
  guidance: MessageSquare,
  signup: UserPlus,
  profile: FileText,
  note: StickyNote,
};

const logs = [
  { time: "10:24:11", level: "INFO", msg: "User session started: aarav@uni.edu" },
  { time: "10:23:45", level: "INFO", msg: "Roadmap task marked complete (id=Pandas-1-2)" },
  { time: "10:21:02", level: "WARN", msg: "Mentor m3 has 0 assigned students" },
  { time: "10:18:33", level: "INFO", msg: "Profile updated: rohan@uni.edu" },
  { time: "10:15:00", level: "INFO", msg: "Skill-gap analysis run for s2" },
  { time: "10:11:48", level: "ERROR", msg: "Mock error: notification queue retry (handled)" },
  { time: "10:08:12", level: "INFO", msg: "New signup: sara@uni.edu (student)" },
];

const levelColor: Record<string, string> = {
  INFO: "text-primary",
  WARN: "text-warning",
  ERROR: "text-destructive",
};

export default function AdminActivity() {
  return (
    <>
      <PageHeader title="Activity & System Logs" subtitle="Monitor what's happening across the platform." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-border/60">
          <CardHeader><CardTitle>Activity feed</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {ACTIVITY_FEED.map((a) => {
              const Icon = iconMap[a.type] || Activity;
              return (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm">{a.text}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">{a.time}</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/60">
          <CardHeader><CardTitle>System logs</CardTitle></CardHeader>
          <CardContent>
            <div className="font-mono text-xs space-y-1.5 bg-muted/30 rounded-lg p-4 max-h-[420px] overflow-y-auto">
              {logs.map((l, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-muted-foreground">{l.time}</span>
                  <span className={`font-semibold ${levelColor[l.level]}`}>{l.level}</span>
                  <span>{l.msg}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
