import { env } from "@/lib/env";
import type { FetchResult } from "./types";

type BrapiResponse = {
  results?: Array<{
    symbol: string;
    regularMarketPrice?: number;
    regularMarketChangePercent?: number;
    regularMarketTime?: string;
  }>;
};

function formatBrl(value: number): string {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatPct(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
}

async function fetchOne(symbol: string): Promise<FetchResult> {
  try {
    const url = new URL(`https://brapi.dev/api/quote/${symbol}`);
    url.searchParams.set("token", env.brapiToken);

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return { ok: false, error: `brapi.dev respondeu HTTP ${res.status} para ${symbol}` };

    const data = (await res.json()) as BrapiResponse;
    const quote = data.results?.[0];
    const price = quote?.regularMarketPrice;
    const pct = quote?.regularMarketChangePercent;
    if (!Number.isFinite(price) || !Number.isFinite(pct)) {
      return { ok: false, error: `brapi.dev não retornou cotação para ${symbol}` };
    }

    return {
      ok: true,
      val: formatBrl(price as number),
      delta: formatPct(pct as number),
      dir: (pct as number) > 0 ? "up" : (pct as number) < 0 ? "down" : "flat",
      asOf: quote?.regularMarketTime,
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Falha desconhecida" };
  }
}

/**
 * Busca ações da B3. O plano gratuito do brapi.dev permite só 1 ativo por
 * requisição, então cada símbolo vira uma chamada separada, em paralelo.
 */
export async function fetchB3Quotes(
  symbols: string[],
): Promise<Record<string, FetchResult>> {
  const results = await Promise.all(symbols.map((s) => fetchOne(s)));
  const out: Record<string, FetchResult> = {};
  symbols.forEach((s, i) => {
    out[s] = results[i];
  });
  return out;
}
