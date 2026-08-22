"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TopicStatus } from "@/lib/types";

export async function addPhase(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("roadmap_phases").insert({
    user_id: user.id,
    name: formData.get("name") as string,
    week_start: Number(formData.get("week_start")),
    week_end: Number(formData.get("week_end")),
    order_index: Number(formData.get("order_index") ?? 0),
  });

  revalidatePath("/roadmap");
}

export async function addTopic(formData: FormData) {
  const supabase = createClient();
  await supabase.from("roadmap_topics").insert({
    phase_id: formData.get("phase_id") as string,
    title: formData.get("title") as string,
  });
  revalidatePath("/roadmap");
}

export async function updateTopicStatus(topicId: string, status: TopicStatus) {
  "use server";
  const supabase = createClient();
  await supabase.from("roadmap_topics").update({ status }).eq("id", topicId);
  revalidatePath("/roadmap");
  revalidatePath("/dashboard");
}

export async function deleteTopic(topicId: string) {
  "use server";
  const supabase = createClient();
  await supabase.from("roadmap_topics").delete().eq("id", topicId);
  revalidatePath("/roadmap");
  revalidatePath("/dashboard");
}
