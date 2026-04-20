import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MOCK_STUDENTS, analyzeSkillGap, calcProgress, generateAISummary, riskLevel } from "@/lib/mockData";
import { PageHeader } from "@/components/ui-bits";
import { Sparkles, MessageSquarePlus, Plus, X, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = MOCK_STUDENTS.find((s) => s.id === id);
  const [notes, setNotes] = useState(student?.notes ?? []);
  const [advice, setAdvice] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);
  const [taskInput, setTaskInput] = useState("");
  const [open, setOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  if (!student) return <div>Student not found</div>;

  const gap = analyzeSkillGap(student);
  const progress = calcProgress(student.roadmap);
  const risk = riskLevel(student);
  const summary = generateAISummary(student);

  const addTask = () => {
    if (!taskInput.trim()) return;
    setTasks([...tasks, taskInput.trim()]);
    setTaskInput("");
  };

  const sendGuidance = () => {
    if (!advice.trim() && !tasks.length) { toast.error("Add advice or tasks"); return; }
    const newNote = {
      id: "n-" + Date.now(),
      from: "You (Mentor)",
      text: `${advice}${tasks.length ? `\n\nAction items:\n• ${tasks.join("\n• ")}` : ""}`,
      date: new Date().toISOString().slice(0, 10),
    };
    setNotes([...notes, newNote]);
    setAdvice(""); setTasks([]); setOpen(false);
    toast.success("Guidance sent to student");
  };

  const addNote = () => {
    if (!noteText.trim()) return;
    setNotes([...notes, { id: "n-" + Date.now(), from: "You (Mentor)", text: noteText, date: new Date().toISOString().slice(0, 10) }]);
    setNoteText("");
    toast.success("Note added");
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-3">
        <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
      </Button>

      <div className="flex items-start gap-4 mb-8 flex-wrap">
        <div className="h-16 w-16 rounded-2xl bg-gradient-primary text-white flex items-center justify-center text-2xl font-bold shadow-glow">
          {student.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold tracking-tight">{student.name}</h1>
          <div className="text-muted-foreground text-sm mt-1">{student.email} · {student.branch} · {student.year}</div>
          <div className="flex gap-2 mt-2 flex-wrap">
            <Badge variant="secondary">{student.careerGoal}</Badge>
            <Badge className={
              risk === "Low" ? "bg-success text-success-foreground" :
              risk === "Medium" ? "bg-warning text-warning-foreground" :
              "bg-destructive text-destructive-foreground"
            }>{risk} risk</Badge>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary shadow-md">
              <MessageSquarePlus className="h-4 w-4 mr-2" /> Provide guidance
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Provide guidance to {student.name}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Your advice</label>
                <Textarea value={advice} onChange={(e) => setAdvice(e.target.value)} placeholder="Share insights, encouragement, or feedback…" rows={4} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Action items</label>
                <div className="flex gap-2">
                  <Input value={taskInput} onChange={(e) => setTaskInput(e.target.value)} placeholder="e.g. Complete Pandas tutorial"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTask())} />
                  <Button type="button" variant="outline" onClick={addTask}><Plus className="h-4 w-4" /></Button>
                </div>
                <div className="space-y-1.5 mt-2">
                  {tasks.map((t, i) => (
                    <div key={i} className="flex items-center justify-between text-sm p-2 rounded-md bg-muted">
                      <span>• {t}</span>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setTasks(tasks.filter((_, ix) => ix !== i))}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={sendGuidance} className="bg-gradient-primary">Send guidance</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* AI Summary */}
      <Card className="bg-gradient-hero text-white border-0 shadow-glow mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-sm uppercase tracking-wider opacity-80 mb-2">
            <Sparkles className="h-4 w-4" /> AI-generated summary
          </div>
          <p className="text-lg leading-relaxed">{summary}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-border/60">
          <CardHeader><CardTitle>Skill profile</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {student.skills.map((s) => {
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
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/60">
          <CardHeader><CardTitle>Skill gaps</CardTitle></CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-3">Match score: <span className="font-semibold text-foreground">{gap.matchScore}%</span></div>
            <div className="flex flex-wrap gap-2">
              {gap.missing.map((s) => <Badge key={s} variant="outline" className="border-warning text-warning">{s}</Badge>)}
              {!gap.missing.length && <span className="text-sm text-success">All required skills covered ✓</span>}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/60 lg:col-span-2">
          <CardHeader>
            <CardTitle>Progress history</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Roadmap completion</span>
              <span className="text-2xl font-bold text-gradient">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3 mb-4" />
            <div className="grid grid-cols-3 gap-3 text-center">
              {(["Completed", "In Progress", "Not Started"] as const).map((s) => (
                <div key={s} className="p-3 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">{student.roadmap.filter((t) => t.status === s).length}</div>
                  <div className="text-xs text-muted-foreground">{s}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/60 lg:col-span-2">
          <CardHeader><CardTitle>Notes & history</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Add a quick note…" />
              <Button onClick={addNote} variant="outline"><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-3">
              {notes.length ? notes.slice().reverse().map((n) => (
                <div key={n.id} className="p-4 rounded-lg border bg-card">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span className="font-medium text-foreground">{n.from}</span>
                    <span>{n.date}</span>
                  </div>
                  <p className="text-sm whitespace-pre-line">{n.text}</p>
                </div>
              )) : <div className="text-sm text-muted-foreground text-center py-6">No notes yet.</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
