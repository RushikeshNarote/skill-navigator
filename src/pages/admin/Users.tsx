import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MOCK_STUDENTS, MOCK_MENTORS } from "@/lib/mockData";
import { PageHeader } from "@/components/ui-bits";
import { toast } from "sonner";

export default function AdminUsers() {
  const [students, setStudents] = useState(MOCK_STUDENTS);

  const assign = (studentId: string, mentorId: string) => {
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, mentorId } : s)));
    const m = MOCK_MENTORS.find((x) => x.id === mentorId);
    toast.success(`Assigned to ${m?.name}`);
  };

  return (
    <>
      <PageHeader title="User Management" subtitle="View users and assign mentors to students." />

      <Tabs defaultValue="students">
        <TabsList>
          <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
          <TabsTrigger value="mentors">Mentors ({MOCK_MENTORS.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-4">
          <Card className="bg-gradient-card border-border/60">
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Career goal</TableHead>
                    <TableHead>Assigned mentor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-gradient-primary text-white flex items-center justify-center text-xs font-semibold">
                            {s.name.charAt(0)}
                          </div>
                          <span className="font-medium">{s.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{s.email}</TableCell>
                      <TableCell className="text-sm">{s.branch}</TableCell>
                      <TableCell className="text-sm">{s.careerGoal}</TableCell>
                      <TableCell>
                        <Select value={s.mentorId} onValueChange={(v) => assign(s.id, v)}>
                          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Assign mentor" /></SelectTrigger>
                          <SelectContent>
                            {MOCK_MENTORS.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mentors" className="mt-4">
          <Card className="bg-gradient-card border-border/60">
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Expertise</TableHead>
                    <TableHead>Students</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_MENTORS.map((m) => {
                    const count = students.filter((s) => s.mentorId === m.id).length;
                    return (
                      <TableRow key={m.id}>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-gradient-accent text-white flex items-center justify-center text-xs font-semibold">
                              {m.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                            </div>
                            <span className="font-medium">{m.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{m.email}</TableCell>
                        <TableCell><Badge variant="secondary">{m.expertise}</Badge></TableCell>
                        <TableCell><span className="font-semibold">{count}</span></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
