import "server-only";
import { supabaseAdmin } from "./supabase";
import { formatCalendarDate } from "./format";
import type { CalendarItem, MarketTick, NewsItem, StudyItem } from "./types";

type SnapshotRow = {
  atualizado_em: string;
  market: MarketTick[];
  feed: NewsItem[];
};

export async function getLatestSnapshot(): Promise<SnapshotRow | null> {
  const { data, error } = await supabaseAdmin()
    .from("dashboard_snapshot")
    .select("atualizado_em, market, feed")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[dashboard-repo] getLatestSnapshot falhou:", error.message);
    return null;
  }
  return data as SnapshotRow | null;
}

export async function saveSnapshot(input: {
  atualizadoEm: string;
  market: MarketTick[];
  feed: NewsItem[];
}): Promise<void> {
  const { error } = await supabaseAdmin().from("dashboard_snapshot").insert({
    atualizado_em: input.atualizadoEm,
    market: input.market,
    feed: input.feed,
  });
  if (error) throw new Error(`Falha ao gravar snapshot no Supabase: ${error.message}`);
}

type CalendarRow = {
  id: string;
  start_date: string;
  end_date: string | null;
  title: string;
  location: string | null;
  is_deadline: boolean;
  impact: string | null;
};

export async function getCalendarItems(): Promise<CalendarItem[]> {
  const todayIso = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabaseAdmin()
    .from("calendar_items")
    .select("id, start_date, end_date, title, location, is_deadline, impact")
    .or(`end_date.gte.${todayIso},and(end_date.is.null,start_date.gte.${todayIso})`)
    .order("start_date", { ascending: true });

  if (error) {
    console.error("[dashboard-repo] getCalendarItems falhou:", error.message);
    return [];
  }

  return (data as CalendarRow[]).map((row) => {
    const { dia, mes } = formatCalendarDate(row.start_date, row.end_date);
    return {
      id: row.id,
      dia,
      mes,
      nome: row.title,
      meta: row.location ?? "",
      hot: row.is_deadline,
      impacto: row.impact ?? "",
    };
  });
}

export type CalendarItemFull = {
  id: string;
  startDate: string;
  endDate: string | null;
  title: string;
  location: string;
  isDeadline: boolean;
  impact: string;
  source: "equipe" | "automatico";
};

/** Todos os eventos, incluindo os passados — usado na área de curadoria. */
export async function getAllCalendarItems(): Promise<CalendarItemFull[]> {
  const { data, error } = await supabaseAdmin()
    .from("calendar_items")
    .select("id, start_date, end_date, title, location, is_deadline, impact, source")
    .order("start_date", { ascending: false });

  if (error) {
    console.error("[dashboard-repo] getAllCalendarItems falhou:", error.message);
    return [];
  }

  return (data as (CalendarRow & { source: "equipe" | "automatico" })[]).map((row) => ({
    id: row.id,
    startDate: row.start_date,
    endDate: row.end_date,
    title: row.title,
    location: row.location ?? "",
    isDeadline: row.is_deadline,
    impact: row.impact ?? "",
    source: row.source,
  }));
}

export async function deleteCalendarItem(id: string): Promise<void> {
  const { error } = await supabaseAdmin().from("calendar_items").delete().eq("id", id);
  if (error) throw new Error(`Falha ao excluir evento no Supabase: ${error.message}`);
}

export async function addCalendarItem(input: {
  startDate: string;
  endDate?: string | null;
  title: string;
  location?: string;
  isDeadline?: boolean;
  impact?: string;
  source?: "equipe" | "automatico";
}): Promise<void> {
  const { error } = await supabaseAdmin().from("calendar_items").insert({
    start_date: input.startDate,
    end_date: input.endDate ?? null,
    title: input.title,
    location: input.location ?? null,
    is_deadline: input.isDeadline ?? false,
    impact: input.impact ?? null,
    source: input.source ?? "equipe",
  });
  if (error) throw new Error(`Falha ao gravar evento no Supabase: ${error.message}`);
}

type StudyRow = {
  id: string;
  kind: string;
  title: string;
  description: string;
  url: string | null;
  source: "equipe" | "automatico";
};

export async function getStudyItems(): Promise<StudyItem[]> {
  const { data, error } = await supabaseAdmin()
    .from("study_items")
    .select("id, kind, title, description, url, source")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[dashboard-repo] getStudyItems falhou:", error.message);
    return [];
  }

  return (data as StudyRow[]).map((row) => ({
    id: row.id,
    kind: row.kind,
    titulo: row.title,
    texto: row.description,
    url: row.url ?? undefined,
    origem: row.source === "automatico" ? "automatico" : "curado",
  }));
}

export async function addStudyItem(input: {
  kind: string;
  title: string;
  description: string;
  url?: string;
  source?: "equipe" | "automatico";
}): Promise<void> {
  const { error } = await supabaseAdmin().from("study_items").insert({
    kind: input.kind,
    title: input.title,
    description: input.description,
    url: input.url ?? null,
    source: input.source ?? "equipe",
  });
  if (error) throw new Error(`Falha ao gravar conteúdo no Supabase: ${error.message}`);
}

export async function deleteStudyItem(id: string): Promise<void> {
  const { error } = await supabaseAdmin().from("study_items").delete().eq("id", id);
  if (error) throw new Error(`Falha ao excluir conteúdo no Supabase: ${error.message}`);
}
