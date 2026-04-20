import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent = "primary",
}: {
  icon: any;
  label: string;
  value: string | number;
  hint?: string;
  accent?: "primary" | "accent" | "success" | "warning";
}) {
  const accents: Record<string, string> = {
    primary: "from-primary to-primary-glow",
    accent: "from-accent to-primary",
    success: "from-success to-emerald-400",
    warning: "from-warning to-amber-400",
  };
  return (
    <Card className="border-border/60 bg-gradient-card shadow-sm hover:shadow-elegant transition-all hover:-translate-y-0.5">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
            <div className="mt-2 text-3xl font-bold tracking-tight">{value}</div>
            {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
          </div>
          <div className={cn("h-11 w-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-md", accents[accent])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
