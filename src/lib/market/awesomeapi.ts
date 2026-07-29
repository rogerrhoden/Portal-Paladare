import type { FetchResult } from "./types";

type AwesomeApiResponse = {
  USDBRL: {
    bid: string;
    pctChange: string;
    create_date: string;
  };
};

function formatBrl(value: number): string {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatPct(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
}

export async function fetchUsdBrl(): Promise<FetchResult> {
  try {
    const res = await fetch("https://economia.awesomeapi.com.br/last/USD-BRL", {
      cache: "no-store",
    });
    if (!res.ok) return { ok: false, error: `AwesomeAPI respondeu HTTP ${res.status}` };

    const data = (await res.json()) as AwesomeApiResponse;
    const bid = Number(data.USDBRL?.bid);
    const pctChange = Number(data.USDBRL?.pctChange);
    if (!Number.isFinite(bid) || !Number.isFinite(pctChange)) {
      return { ok: false, error: "AwesomeAPI retornou dados incompletos" };
    }

    // create_date vem como "YYYY-MM-DD HH:mm:ss" em horário de Brasília.
    const asOf = data.USDBRL?.create_date
      ? data.USDBRL.create_date.replace(" ", "T") + "-03:00"
      : undefined;

    return {
      ok: true,
      val: formatBrl(bid),
      delta: Math.abs(pctChange) < 0.05 ? "estável" : formatPct(pctChange),
      dir: pctChange > 0.05 ? "up" : pctChange < -0.05 ? "down" : "flat",
      asOf,
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Falha desconhecida" };
  }
}
