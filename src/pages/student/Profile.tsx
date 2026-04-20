import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ALL_SKILLS, CAREER_GOALS, SkillLevel, Skill, CAREER_REQUIREMENTS } from "@/lib/mockData";
import { PageHeader } from "@/components/ui-bits";
import { Plus, X, Save } from "lucide-react";
import { toast } from "sonner";

const sampleRoadmap = (goal: string) => {
  const reqs = CAREER_REQUIREMENTS[goal] ?? [];
  return reqs.flatMap((skill, i) => [
    { id: `${skill}-1-${i}`, title: `Learn ${skill} fundamentals`, description: `Cover the core concepts of ${skill}.`, status: "Not Started" as const, week: i + 1 },
    { id: `${skill}-2-${i}`, title: `Build a project using ${skill}`, description: `Apply ${skill} in a portfolio project.`, status: "Not Started" as const, week: i + 1 },
  ]);
};

export default function StudentProfile() {
  const { studentProfile, updateStudentProfile } = useAuth();
  const [p, setP] = useState(studentProfile!);
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("Beginner");

  const addSkill = () => {
    if (!skillName) return;
    if (p.skills.some((s) => s.name === skillName)) { toast.error("Skill already added"); return; }
    setP({ ...p, skills: [...p.skills, { name: skillName, level: skillLevel }] });
    setSkillName("");
  };

  const removeSkill = (n: string) => setP({ ...p, skills: p.skills.filter((s) => s.name !== n) });

  const save = () => {
    let updated = { ...p };
    // regenerate roadmap if career goal changed and roadmap empty / different
    if (p.careerGoal && p.roadmap.length === 0) {
      updated.roadmap = sampleRoadmap(p.careerGoal);
    }
    updateStudentProfile(updated);
    setP(updated);
    toast.success("Profile saved successfully");
  };

  return (
    <>
      <PageHeader title="Profile & Skills" subtitle="Tell us about yourself so we can personalize your roadmap." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gradient-card border-border/60">
          <CardHeader><CardTitle>Personal info</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Full name</Label>
              <Input value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} className="mt-1.5" />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={p.email} onChange={(e) => setP({ ...p, email: e.target.value })} className="mt-1.5" />
            </div>
            <div>
              <Label>Branch</Label>
              <Input value={p.branch} onChange={(e) => setP({ ...p, branch: e.target.value })} placeholder="e.g. Computer Science" className="mt-1.5" />
            </div>
            <div>
              <Label>Year</Label>
              <Select value={p.year} onValueChange={(v) => setP({ ...p, year: v })}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select year" /></SelectTrigger>
                <SelectContent>
                  {["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgrad"].map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Career goal</Label>
              <Select value={p.careerGoal} onValueChange={(v) => setP({ ...p, careerGoal: v, roadmap: sampleRoadmap(v) })}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Pick a career path" /></SelectTrigger>
                <SelectContent>
                  {CAREER_GOALS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Challenges & goals</Label>
              <Textarea value={p.challenges} onChange={(e) => setP({ ...p, challenges: e.target.value })}
                placeholder="What are you struggling with? What do you want to achieve?" rows={4} className="mt-1.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/60">
          <CardHeader><CardTitle>Your skills</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Select value={skillName} onValueChange={setSkillName}>
                <SelectTrigger><SelectValue placeholder="Select a skill" /></SelectTrigger>
                <SelectContent>
                  {ALL_SKILLS.filter((s) => !p.skills.some((x) => x.name === s)).map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={skillLevel} onValueChange={(v) => setSkillLevel(v as SkillLevel)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addSkill} className="w-full" variant="outline">
                <Plus className="h-4 w-4 mr-2" /> Add skill
              </Button>
            </div>

            <div className="space-y-2">
              {p.skills.map((s) => (
                <div key={s.name} className="flex items-center justify-between p-2.5 rounded-lg border bg-card">
                  <div>
                    <div className="text-sm font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.level}</div>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => removeSkill(s.name)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {!p.skills.length && <div className="text-xs text-muted-foreground text-center py-4">No skills added yet.</div>}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={save} className="bg-gradient-primary shadow-md">
          <Save className="h-4 w-4 mr-2" /> Save profile
        </Button>
      </div>
    </>
  );
}
