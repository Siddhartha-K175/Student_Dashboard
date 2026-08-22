"use client";

import { useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateProblemStatus, deleteProblem } from "@/app/dsa/actions";
import type { DsaProblem, ProblemStatus } from "@/lib/types";
import { ExternalLink, Loader2, X } from "lucide-react";

const difficultyVariant: Record<string, "success" | "warning" | "default"> = {
  easy: "success",
  medium: "warning",
  hard: "default",
};

const statusOptions: ProblemStatus[] = ["todo", "attempted", "solved"];

export function ProblemRow({ problem }: { problem: DsaProblem }) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (status: ProblemStatus) => {
    startTransition(() => updateProblemStatus(problem.id, status));
  };

  const handleDelete = () => {
    startTransition(() => deleteProblem(problem.id));
  };

  return (
    <tr className="border-b border-border text-sm last:border-0">
      <td className="py-2 pr-3">
        <div className="flex items-center gap-1.5">
          {problem.title}
          {problem.link && (
            <a href={problem.link} target="_blank" rel="noreferrer" className="text-muted-foreground">
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </td>
      <td className="py-2 pr-3 text-muted-foreground">{problem.platform}</td>
      <td className="py-2 pr-3">
        <Badge variant={difficultyVariant[problem.difficulty]}>{problem.difficulty}</Badge>
      </td>
      <td className="py-2 pr-3 text-muted-foreground">{problem.pattern_tag || "—"}</td>
      <td className="py-2 pr-3">
        <select
          value={problem.status}
          disabled={isPending}
          onChange={(e) => handleStatusChange(e.target.value as ProblemStatus)}
          className="rounded-md border border-border bg-background px-2 py-1 text-xs"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </td>
      <td className="py-2 text-right">
        {isPending ? (
          <Loader2 className="ml-auto h-3.5 w-3.5 animate-spin text-muted-foreground" />
        ) : (
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleDelete}>
            <X className="h-3 w-3" />
          </Button>
        )}
      </td>
    </tr>
  );
}
