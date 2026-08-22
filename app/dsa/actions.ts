"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ProblemStatus } from "@/lib/types";

export async function addProblem(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("dsa_problems").insert({
    user_id: user.id,
    title: formData.get("title") as string,
    platform: (formData.get("platform") as string) || "LeetCode",
    difficulty: (formData.get("difficulty") as string) || "medium",
    pattern_tag: (formData.get("pattern_tag") as string) || "",
    link: (formData.get("link") as string) || null,
    status: "todo",
  });

  revalidatePath("/dsa");
  revalidatePath("/dashboard");
}

export async function updateProblemStatus(problemId: string, status: ProblemStatus) {
  "use server";
  const supabase = createClient();
  await supabase
    .from("dsa_problems")
    .update({
      status,
      solved_at: status === "solved" ? new Date().toISOString() : null,
    })
    .eq("id", problemId);

  revalidatePath("/dsa");
  revalidatePath("/dashboard");
}

export async function deleteProblem(problemId: string) {
  "use server";
  const supabase = createClient();
  await supabase.from("dsa_problems").delete().eq("id", problemId);
  revalidatePath("/dsa");
  revalidatePath("/dashboard");
}
