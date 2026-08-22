import { createClient } from "@/lib/supabase/server";
import { Nav } from "@/components/nav";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PhaseProgressChart, SolvedOverTimeChart } from "@/components/progress-charts";
import type { RoadmapPhase, RoadmapTopic, DsaProblem } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = createClient();

  const [{ data: phases }, { data: topics }, { data: problems }] = await Promise.all([
    supabase.from("roadmap_phases").select("*").order("order_index") as unknown as Promise<{
      data: RoadmapPhase[];
    }>,
    supabase.from("roadmap_topics").select("*") as unknown as Promise<{ data: RoadmapTopic[] }>,
    supabase.from("dsa_problems").select("*") as unknown as Promise<{ data: DsaProblem[] }>,
  ]);

  const phaseList = phases ?? [];
  const topicList = topics ?? [];
  const problemList = problems ?? [];

  const phaseProgress = phaseList.map((phase) => {
    const phaseTopics = topicList.filter((t) => t.phase_id === phase.id);
    const done = phaseTopics.filter((t) => t.status === "done").length;
    const percent = phaseTopics.length ? Math.round((done / phaseTopics.length) * 100) : 0;
    return { name: phase.name, percent };
  });

  const overallPercent = topicList.length
    ? Math.round((topicList.filter((t) => t.status === "done").length / topicList.length) * 100)
    : 0;

  const solvedCount = problemList.filter((p) => p.status === "solved").length;

  const solvedOverTime = buildSolvedOverTime(problemList);

  const currentWeek = getCurrentWeek(phaseList);

  return (
    <div className="min-h-screen bg-secondary/20">
      <Nav />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome back 👋</h1>
          <p className="text-muted-foreground">
            {currentWeek ? `You're in Week ${currentWeek} of your roadmap.` : "Set up your roadmap to get started."}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Overall roadmap progress</CardDescription>
              <CardTitle className="text-3xl">{overallPercent}%</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={overallPercent} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>DSA problems solved</CardDescription>
              <CardTitle className="text-3xl">{solvedCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {problemList.length} total logged
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Phases in progress</CardDescription>
              <CardTitle className="text-3xl">
                {phaseProgress.filter((p) => p.percent > 0 && p.percent < 100).length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">of {phaseList.length} total phases</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Progress by phase</CardTitle>
            </CardHeader>
            <CardContent>
              {phaseProgress.length ? (
                <PhaseProgressChart data={phaseProgress} />
              ) : (
                <EmptyState text="Add phases in the Roadmap tab to see progress here." />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Problems solved (last 14 days)</CardTitle>
            </CardHeader>
            <CardContent>
              {solvedOverTime.some((d) => d.solved > 0) ? (
                <SolvedOverTimeChart data={solvedOverTime} />
              ) : (
                <EmptyState text="Solve and log a problem in the DSA tab to see your trend." />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex h-[240px] items-center justify-center text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}

function getCurrentWeek(phases: RoadmapPhase[]): number | null {
  if (!phases.length) return null;
  // Placeholder heuristic: first phase that isn't fully in the past.
  // Replace with a real "roadmap start date" field for precise tracking.
  return phases[0]?.week_start ?? null;
}

function buildSolvedOverTime(problems: DsaProblem[]) {
  const days: { date: string; solved: number }[] = [];
  const today = new Date();

  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const dayKey = d.toISOString().slice(0, 10);

    const solved = problems.filter(
      (p) => p.solved_at && p.solved_at.slice(0, 10) === dayKey
    ).length;

    days.push({ date: label, solved });
  }

  return days;
}
