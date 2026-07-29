import type { NextRequest } from "next/server";
import { env } from "@/lib/env";
import { fetchAllMarketData } from "@/lib/market";
import {
  getLatestSnapshot,
  saveSnapshot,
  getCalendarItems,
  getStudyItems,
  addCalendarItem,
  addStudyItem,
} from "@/lib/dashboard-repo";
import { generateDailyReport } from "@/lib/intelligence/daily-report";

export const maxDuration = 300;

function isAuthorized(req: NextRequest): boolean {
  const secret = env.cronSecret;
  // Sem CRON_SECRET configurado (ex: ainda em desenvolvimento local), não bloqueia.
  if (!secret) return true;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const [previousSnapshot, existingCalendar, existingStudy] = await Promise.all([
    getLatestSnapshot(),
    getCalendarItems(),
    getStudyItems(),
  ]);

  const market = await fetchAllMarketData(previousSnapshot?.market ?? []);

  const report = await generateDailyReport({
    existingCalendarTitles: existingCalendar.map((c) => c.nome),
    existingStudyUrls: existingStudy.map((s) => s.url).filter((u): u is string => Boolean(u)),
  });

  if (!report) {
    console.error("[cron/daily] geração via Anthropic falhou; mantendo feed do dia anterior");
  }
  const feed = report?.feed ?? previousSnapshot?.feed ?? [];

  const atualizadoEm = new Date().toISOString();
  await saveSnapshot({ atualizadoEm, market, feed });

  let studiesAdded = 0;
  let eventsAdded = 0;

  if (report) {
    const existingUrls = new Set(existingStudy.map((s) => s.url).filter(Boolean));
    for (const s of report.study_suggestions) {
      if (!s.url || existingUrls.has(s.url)) continue;
      await addStudyItem({
        kind: s.kind,
        title: s.titulo,
        description: s.texto,
        url: s.url,
        source: "automatico",
      });
      studiesAdded++;
    }

    const existingTitles = new Set(existingCalendar.map((c) => c.nome.trim().toLowerCase()));
    for (const e of report.new_calendar_events) {
      if (existingTitles.has(e.title.trim().toLowerCase())) continue;
      await addCalendarItem({
        startDate: e.start_date,
        endDate: e.end_date ?? null,
        title: e.title,
        location: e.location,
        isDeadline: e.is_deadline,
        impact: e.impact,
        source: "automatico",
      });
      eventsAdded++;
    }
  }

  return Response.json({
    ok: true,
    atualizadoEm,
    market: market.map((m) => ({ nome: m.nome, val: m.val, dir: m.dir })),
    feedCount: feed.length,
    reportOk: Boolean(report),
    studiesAdded,
    eventsAdded,
  });
}
