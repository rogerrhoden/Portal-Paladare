import { env } from "@/lib/env";
import type { FetchResult } from "./types";

type BrentResponse = {
  data?: Array<{ date: string; value: string }>;
  Information?: string;
  Note?: string;
};

function formatUsd(value: number): string {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatPct(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
}

/** Brent, US$/barril, via Alpha Vantage (free tier: 25 chamadas/dia — de sobra pra 1x/dia). */
export async function fetchBrent(): Promise<FetchResult> {
  try {
    const url = new URL("https://www.alphavantage.co/query");
    url.searchParams.set("function", "BRENT");
    url.searchParams.set("interval", "daily");
    url.searchParams.set("apikey", env.alphaVantageApiKey);

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return { ok: false, error: `Alpha Vantage respondeu HTTP ${res.status}` };

    const data = (await res.json()) as BrentResponse;
    if (data.Information || data.Note) {
      return { ok: false, error: data.Information || data.Note || "limite de uso atingido" };
    }
    const series = data.data;
    if (!series || series.length < 1) {
      return { ok: false, error: "Alpha Vantage retornou série vazia" };
    }

    const latest = Number(series[0]?.value);
    const previous = series.length > 1 ? Number(series[1]?.value) : null;
    if (!Number.isFinite(latest)) {
      return { ok: false, error: "Alpha Vantage retornou valor inválido" };
    }

    const pct = previous && Number.isFinite(previous) && previous !== 0
      ? ((latest - previous) / previous) * 100
      : null;

    return {
      ok: true,
      val: formatUsd(latest),
      delta: pct === null ? "—" : Math.abs(pct) < 0.05 ? "estável" : formatPct(pct),
      dir: pct === null ? "flat" : pct > 0.05 ? "up" : pct < -0.05 ? "down" : "flat",
      asOf: series[0]?.date,
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Falha desconhecida" };
  }
}
