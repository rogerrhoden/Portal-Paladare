import type { MarketTick } from "@/lib/types";
import { fetchUsdBrl } from "./awesomeapi";
import { fetchBrent } from "./alphavantage";
import { fetchIpca12m } from "./bcb";
import { fetchB3Quotes } from "./brapi";
import type { FetchResult } from "./types";

const NOMES = {
  usd: "Dólar (USD/BRL)",
  brent: "Brent (US$/barril)",
  ipca: "IPCA 12m",
  petr4: "PETR4",
  vale3: "VALE3",
  prio3: "PRIO3",
} as const;

function toTick(
  nome: string,
  result: FetchResult,
  today: string,
  previous: MarketTick[],
): MarketTick {
  if (result.ok) {
    return { nome, val: result.val, delta: result.delta, dir: result.dir, dataFonte: result.asOf ?? today };
  }

  const last = previous.find((t) => t.nome === nome);
  if (last) {
    console.error(`[market] ${nome} falhou (${result.error}); usando último valor de ${last.dataFonte ?? "data desconhecida"}`);
    return { ...last, delta: "sem atualização hoje", dir: "stale" };
  }

  console.error(`[market] ${nome} falhou (${result.error}); sem valor anterior disponível`);
  return { nome, val: "indisponível", delta: "sem dado hoje", dir: "stale" };
}

/**
 * Busca as 6 cotações do ticker nas 4 fontes gratuitas. Se uma fonte falhar,
 * mantém o último valor bom conhecido (marcado como "stale") em vez de
 * inventar ou zerar o número — nunca mostra dado fabricado.
 */
export async function fetchAllMarketData(previous: MarketTick[]): Promise<MarketTick[]> {
  const today = new Date().toISOString();

  const [usd, brent, ipca, b3] = await Promise.all([
    fetchUsdBrl(),
    fetchBrent(),
    fetchIpca12m(),
    fetchB3Quotes(["PETR4", "VALE3", "PRIO3"]),
  ]);

  return [
    toTick(NOMES.usd, usd, today, previous),
    toTick(NOMES.brent, brent, today, previous),
    toTick(NOMES.ipca, ipca, today, previous),
    toTick(NOMES.petr4, b3.PETR4 ?? { ok: false, error: "sem resposta" }, today, previous),
    toTick(NOMES.vale3, b3.VALE3 ?? { ok: false, error: "sem resposta" }, today, previous),
    toTick(NOMES.prio3, b3.PRIO3 ?? { ok: false, error: "sem resposta" }, today, previous),
  ];
}
