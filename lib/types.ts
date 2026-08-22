export type TopicStatus = "todo" | "in_progress" | "done";
export type ProblemStatus = "todo" | "attempted" | "solved";
export type Difficulty = "easy" | "medium" | "hard";

export interface RoadmapPhase {
  id: string;
  user_id: string;
  name: string;
  week_start: number;
  week_end: number;
  order_index: number;
  created_at: string;
}

export interface RoadmapTopic {
  id: string;
  phase_id: string;
  title: string;
  status: TopicStatus;
  notes: string | null;
  created_at: string;
}

export interface DsaProblem {
  id: string;
  user_id: string;
  title: string;
  platform: string;
  difficulty: Difficulty;
  pattern_tag: string;
  status: ProblemStatus;
  link: string | null;
  notes: string | null;
  solved_at: string | null;
  created_at: string;
}
