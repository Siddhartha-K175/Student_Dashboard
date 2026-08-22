"use client";

import { useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateTopicStatus, deleteTopic } from "@/app/roadmap/actions";
import type { RoadmapTopic, TopicStatus } from "@/lib/types";
import { Check, Circle, Loader2, X } from "lucide-react";

const nextStatus: Record<TopicStatus, TopicStatus> = {
  todo: "in_progress",
  in_progress: "done",
  done: "todo",
};

const statusStyles: Record<TopicStatus, "outline" | "warning" | "success"> = {
  todo: "outline",
  in_progress: "warning",
  done: "success",
};

const statusLabel: Record<TopicStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

export function TopicRow({ topic }: { topic: RoadmapTopic }) {
  const [isPending, startTransition] = useTransition();

  const cycleStatus = () => {
    startTransition(() => updateTopicStatus(topic.id, nextStatus[topic.status]));
  };

  const handleDelete = () => {
    startTransition(() => deleteTopic(topic.id));
  };

  return (
    <div className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
      <div className="flex items-center gap-2">
        <button onClick={cycleStatus} disabled={isPending} className="shrink-0">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : topic.status === "done" ? (
            <Check className="h-4 w-4 text-emerald-600" />
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        <span className={topic.status === "done" ? "text-muted-foreground line-through" : ""}>
          {topic.title}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={cycleStatus} disabled={isPending}>
          <Badge variant={statusStyles[topic.status]}>{statusLabel[topic.status]}</Badge>
        </button>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleDelete}>
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
