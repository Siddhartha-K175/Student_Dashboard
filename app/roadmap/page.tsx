import { createClient } from "@/lib/supabase/server";
import { Nav } from "@/components/nav";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TopicRow } from "@/components/topic-row";
import { addPhase, addTopic } from "./actions";
import type { RoadmapPhase, RoadmapTopic } from "@/lib/types";
import { Plus } from "lucide-react";

export default async function RoadmapPage() {
  const supabase = createClient();

  const { data: phases } = (await supabase
    .from("roadmap_phases")
    .select("*")
    .order("order_index")) as unknown as { data: RoadmapPhase[] };

  const { data: topics } = (await supabase.from("roadmap_topics").select("*")) as unknown as {
    data: RoadmapTopic[];
  };

  const phaseList = phases ?? [];
  const topicList = topics ?? [];

  return (
    <div className="min-h-screen bg-secondary/20">
      <Nav />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Roadmap</h1>
            <p className="text-muted-foreground">48-week placement prep, broken into phases.</p>
          </div>
        </div>

        {phaseList.length === 0 && (
          <Card>
            <CardContent className="py-6 text-sm text-muted-foreground">
              No phases yet. Add your first one below — e.g. "Foundation" (weeks 1–8).
            </CardContent>
          </Card>
        )}

        {phaseList.map((phase) => {
          const phaseTopics = topicList.filter((t) => t.phase_id === phase.id);
          const done = phaseTopics.filter((t) => t.status === "done").length;
          const percent = phaseTopics.length ? Math.round((done / phaseTopics.length) * 100) : 0;

          return (
            <Card key={phase.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{phase.name}</CardTitle>
                    <CardDescription>
                      Weeks {phase.week_start}–{phase.week_end} · {done}/{phaseTopics.length} topics done
                    </CardDescription>
                  </div>
                  <span className="text-sm font-medium">{percent}%</span>
                </div>
                <Progress value={percent} className="mt-2" />
              </CardHeader>
              <CardContent className="space-y-2">
                {phaseTopics.map((topic) => (
                  <TopicRow key={topic.id} topic={topic} />
                ))}

                <form action={addTopic} className="flex gap-2 pt-2">
                  <input type="hidden" name="phase_id" value={phase.id} />
                  <input
                    name="title"
                    placeholder="Add a topic (e.g. Binary Search Trees)"
                    required
                    className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm"
                  />
                  <Button type="submit" size="sm" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          );
        })}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add a new phase</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={addPhase} className="grid gap-3 sm:grid-cols-4">
              <input
                name="name"
                placeholder="Phase name"
                required
                className="rounded-md border border-border bg-background px-3 py-2 text-sm sm:col-span-2"
              />
              <input
                name="week_start"
                type="number"
                placeholder="Start week"
                required
                min={1}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
              <input
                name="week_end"
                type="number"
                placeholder="End week"
                required
                min={1}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
              <input type="hidden" name="order_index" value={phaseList.length} />
              <Button type="submit" className="sm:col-span-4">
                Add phase
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
