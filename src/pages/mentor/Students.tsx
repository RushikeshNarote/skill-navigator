import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_STUDENTS, calcProgress, riskLevel } from "@/lib/mockData";
import { PageHeader } from "@/components/ui-bits";
import { cn } from "@/lib/utils";

const riskStyle = {
  Low: "bg-success/15 text-success",
  Medium: "bg-warning/15 text-warning",
  High: "bg-destructive/15 text-destructive",
};

export default function MentorStudents() {
  const navigate = useNavigate();
  const myStudents = MOCK_STUDENTS.filter((s) => s.mentorId === "m1");
  return (
    <>
      <PageHeader title="My Students" subtitle="All students assigned to you." />
      <Card className="bg-gradient-card border-border/60">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Career goal</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myStudents.map((s) => {
                const risk = riskLevel(s);
                return (
                  <TableRow key={s.id} className="hover:bg-muted/40 cursor-pointer" onClick={() => navigate(`/mentor/student/${s.id}`)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-primary text-white flex items-center justify-center text-sm font-semibold">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{s.name}</div>
                          <div className="text-xs text-muted-foreground">{s.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{s.branch}</TableCell>
                    <TableCell className="text-sm">{s.careerGoal}</TableCell>
                    <TableCell><span className="font-semibold">{calcProgress(s.roadmap)}%</span></TableCell>
                    <TableCell><Badge className={cn("border-0", riskStyle[risk])}>{risk}</Badge></TableCell>
                    <TableCell><Button size="sm" variant="ghost">View</Button></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
