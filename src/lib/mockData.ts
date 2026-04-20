// Mock data + fake AI logic for the Skill-Gap Analysis system

export type Role = "student" | "mentor" | "admin";

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";
export type TaskStatus = "Not Started" | "In Progress" | "Completed";

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  week: number;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  branch: string;
  year: string;
  skills: Skill[];
  careerGoal: string;
  challenges: string;
  mentorId?: string;
  roadmap: RoadmapTask[];
  notes: { id: string; from: string; text: string; date: string }[];
}

export const ALL_SKILLS = [
  "Python", "JavaScript", "TypeScript", "React", "Node.js", "SQL",
  "Machine Learning", "Deep Learning", "Data Analysis", "Statistics",
  "HTML/CSS", "Git", "Docker", "AWS", "System Design", "Algorithms",
  "TensorFlow", "Pandas", "NumPy", "REST APIs",
];

export const CAREER_GOALS = [
  "Software Engineer",
  "Data Scientist",
  "AI/ML Engineer",
  "Full-Stack Developer",
  "DevOps Engineer",
  "Product Manager",
];

// Required skills per career goal — used by the "AI" simulation
export const CAREER_REQUIREMENTS: Record<string, string[]> = {
  "Software Engineer": ["JavaScript", "Algorithms", "Git", "System Design", "REST APIs"],
  "Data Scientist": ["Python", "Statistics", "Pandas", "Machine Learning", "SQL"],
  "AI/ML Engineer": ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "NumPy"],
  "Full-Stack Developer": ["React", "Node.js", "TypeScript", "SQL", "REST APIs"],
  "DevOps Engineer": ["Docker", "AWS", "Git", "System Design", "Python"],
  "Product Manager": ["Data Analysis", "SQL", "System Design", "Statistics"],
};

const sampleRoadmap = (goal: string): RoadmapTask[] => {
  const reqs = CAREER_REQUIREMENTS[goal] ?? [];
  return reqs.flatMap((skill, i) => [
    {
      id: `${skill}-1-${i}`,
      title: `Learn ${skill} fundamentals`,
      description: `Cover the core concepts of ${skill} via tutorials and docs.`,
      status: "Not Started" as TaskStatus,
      week: i + 1,
    },
    {
      id: `${skill}-2-${i}`,
      title: `Build a project using ${skill}`,
      description: `Apply ${skill} in a small portfolio project.`,
      status: "Not Started" as TaskStatus,
      week: i + 1,
    },
  ]);
};

export const MOCK_STUDENTS: StudentProfile[] = [
  {
    id: "s1",
    name: "Aarav Sharma",
    email: "aarav@uni.edu",
    branch: "Computer Science",
    year: "3rd Year",
    skills: [
      { name: "Python", level: "Intermediate" },
      { name: "SQL", level: "Beginner" },
      { name: "HTML/CSS", level: "Advanced" },
    ],
    careerGoal: "Data Scientist",
    challenges: "Struggling with statistics and ML math.",
    mentorId: "m1",
    roadmap: sampleRoadmap("Data Scientist").map((t, i) => ({
      ...t,
      status: i < 3 ? "Completed" : i < 5 ? "In Progress" : "Not Started",
    })),
    notes: [
      { id: "n1", from: "Dr. Mehta", text: "Focus on Pandas this week.", date: "2025-04-10" },
    ],
  },
  {
    id: "s2",
    name: "Priya Verma",
    email: "priya@uni.edu",
    branch: "Information Technology",
    year: "2nd Year",
    skills: [
      { name: "JavaScript", level: "Intermediate" },
      { name: "React", level: "Beginner" },
    ],
    careerGoal: "Full-Stack Developer",
    challenges: "Need to learn backend and databases.",
    mentorId: "m1",
    roadmap: sampleRoadmap("Full-Stack Developer").map((t, i) => ({
      ...t, status: i < 2 ? "Completed" : "Not Started",
    })),
    notes: [],
  },
  {
    id: "s3",
    name: "Rohan Iyer",
    email: "rohan@uni.edu",
    branch: "Computer Science",
    year: "4th Year",
    skills: [
      { name: "Python", level: "Advanced" },
      { name: "Machine Learning", level: "Intermediate" },
      { name: "NumPy", level: "Advanced" },
    ],
    careerGoal: "AI/ML Engineer",
    challenges: "Want to dive into deep learning.",
    mentorId: "m1",
    roadmap: sampleRoadmap("AI/ML Engineer").map((t, i) => ({
      ...t, status: i < 6 ? "Completed" : i < 8 ? "In Progress" : "Not Started",
    })),
    notes: [],
  },
  {
    id: "s4",
    name: "Sara Khan",
    email: "sara@uni.edu",
    branch: "Electronics",
    year: "3rd Year",
    skills: [{ name: "HTML/CSS", level: "Beginner" }],
    careerGoal: "Software Engineer",
    challenges: "Just getting started with coding.",
    mentorId: "m2",
    roadmap: sampleRoadmap("Software Engineer"),
    notes: [],
  },
];

export const MOCK_MENTORS = [
  { id: "m1", name: "Dr. Anjali Mehta", email: "mehta@uni.edu", expertise: "AI / Data Science", students: 3 },
  { id: "m2", name: "Prof. Vikram Rao", email: "vrao@uni.edu", expertise: "Web Development", students: 1 },
  { id: "m3", name: "Dr. Neha Kapoor", email: "nkapoor@uni.edu", expertise: "Cloud / DevOps", students: 0 },
];

export const ACTIVITY_FEED = [
  { id: "a1", text: "Aarav completed 'Learn Pandas fundamentals'", time: "2h ago", type: "task" },
  { id: "a2", text: "Dr. Mehta sent guidance to Priya", time: "5h ago", type: "guidance" },
  { id: "a3", text: "New student 'Sara Khan' signed up", time: "1d ago", type: "signup" },
  { id: "a4", text: "Rohan updated his skill profile", time: "1d ago", type: "profile" },
  { id: "a5", text: "Prof. Rao added a note to Sara", time: "2d ago", type: "note" },
];

// === "AI" simulation ===
export function analyzeSkillGap(profile: { skills: Skill[]; careerGoal: string }) {
  const required = CAREER_REQUIREMENTS[profile.careerGoal] ?? [];
  const owned = new Set(profile.skills.map((s) => s.name));
  const missing = required.filter((s) => !owned.has(s));
  const strengths = profile.skills
    .filter((s) => s.level === "Advanced" || s.level === "Intermediate")
    .map((s) => s.name);
  const weaknesses = profile.skills.filter((s) => s.level === "Beginner").map((s) => s.name);
  const recommended = missing.slice(0, 5);
  const matchScore = required.length === 0 ? 0 : Math.round(((required.length - missing.length) / required.length) * 100);
  return { missing, recommended, strengths, weaknesses, matchScore, required };
}

export function calcProgress(roadmap: RoadmapTask[]) {
  if (!roadmap.length) return 0;
  const done = roadmap.filter((t) => t.status === "Completed").length;
  return Math.round((done / roadmap.length) * 100);
}

export function calcProfileCompletion(p: StudentProfile) {
  let score = 0;
  if (p.name) score += 15;
  if (p.branch) score += 15;
  if (p.year) score += 10;
  if (p.skills.length >= 3) score += 25;
  else if (p.skills.length > 0) score += 10;
  if (p.careerGoal) score += 20;
  if (p.challenges && p.challenges.length > 10) score += 15;
  return Math.min(100, score);
}

export function riskLevel(p: StudentProfile): "Low" | "Medium" | "High" {
  const progress = calcProgress(p.roadmap);
  const gap = analyzeSkillGap(p);
  if (progress >= 60 && gap.matchScore >= 50) return "Low";
  if (progress >= 30 || gap.matchScore >= 30) return "Medium";
  return "High";
}

export function generateAISummary(p: StudentProfile) {
  const gap = analyzeSkillGap(p);
  const progress = calcProgress(p.roadmap);
  return `${p.name} is targeting a career as a ${p.careerGoal}. Currently ${gap.matchScore}% aligned with required skills, with ${gap.missing.length} skill gap(s): ${gap.missing.join(", ") || "none"}. Roadmap progress sits at ${progress}%. Recommended focus: ${gap.recommended.slice(0, 3).join(", ") || "maintain current trajectory"}.`;
}

export const initialStudentForSignup = (name: string, email: string): StudentProfile => ({
  id: "me-" + Date.now(),
  name,
  email,
  branch: "",
  year: "",
  skills: [],
  careerGoal: "",
  challenges: "",
  roadmap: [],
  notes: [],
});
