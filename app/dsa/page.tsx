import { createClient } from "@/lib/supabase/server";
import { Nav } from "@/components/nav";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProblemRow } from "@/components/problem-row";
import { addProblem } from "./actions";
import type { DsaProblem } from "@/lib/types";

export default async function DsaPage() {
  const supabase = createClient();
  const { data: problems } = (await supabase
    .from("dsa_problems")
    .select("*")
    .order("created_at", { ascending: false })) as unknown as { data: DsaProblem[] };

  const problemList = problems ?? [];
  const solved = problemList.filter((p) => p.status === "solved").length;

  return (
    <div className="min-h-screen bg-secondary/20">
      <Nav />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <div>
          <h1 className="text-2xl font-bold">DSA Practice Log</h1>
          <p className="text-muted-foreground">
            {solved} solved · {problemList.length} total logged
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Log a problem</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={addProblem} className="grid gap-3 sm:grid-cols-6">
              <input
                name="title"
                placeholder="Problem title"
                required
                className="rounded-md border border-border bg-background px-3 py-2 text-sm sm:col-span-2"
              />
              <input
                name="platform"
                placeholder="Platform (LeetCode)"
                className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
              <select
                name="difficulty"
                defaultValue="medium"
                className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <input
                name="pattern_tag"
                placeholder="Pattern (e.g. sliding window)"
                className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
              <input
                name="link"
                placeholder="Link (optional)"
                className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
              <Button type="submit" className="sm:col-span-6">
                Add problem
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            {problemList.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No problems logged yet. Add your first one above.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                      <th className="pb-2 pr-3 font-medium">Title</th>
                      <th className="pb-2 pr-3 font-medium">Platform</th>
                      <th className="pb-2 pr-3 font-medium">Difficulty</th>
                      <th className="pb-2 pr-3 font-medium">Pattern</th>
                      <th className="pb-2 pr-3 font-medium">Status</th>
                      <th className="pb-2 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {problemList.map((problem) => (
                      <ProblemRow key={problem.id} problem={problem} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
