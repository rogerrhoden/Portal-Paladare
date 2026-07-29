import type { FetchResult } from "./types";

type SgsEntry = { data: string; valor: string };

const IPCA_12M_SERIES = 13522;

function formatPct(value: number, decimals = 2): string {
  return `${value.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}%`;
}

/** IPCA acumulado 12 meses, série SGS 13522 do Banco Central. Sem chave. */
export async function fetchIpca12m(): Promise<FetchResult> {
  try {
    const res = await fetch(
      `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${IPCA_12M_SERIES}/dados/ultimos/2?formato=json`,
      { cache: "no-store" },
    );
    if (!res.ok) return { ok: false, error: `BCB/SGS respondeu HTTP ${res.status}` };

    const data = (await res.json()) as SgsEntry[];
    if (!Array.isArray(data) || data.length === 0) {
      return { ok: false, error: "BCB/SGS retornou série vazia" };
    }

    const latest = Number(data[data.length - 1]?.valor);
    const previous = data.length > 1 ? Number(data[data.length - 2]?.valor) : null;
    if (!Number.isFinite(latest)) {
      return { ok: false, error: "BCB/SGS retornou valor inválido" };
    }

    const diff = previous !== null && Number.isFinite(previous) ? latest - previous : 0;

    // "data" vem como DD/MM/YYYY (mês de referência do índice, não o dia de hoje).
    const [dd, mm, yyyy] = (data[data.length - 1]?.data ?? "").split("/");
    const asOf = dd && mm && yyyy ? `${yyyy}-${mm}-${dd}` : undefined;

    return {
      ok: true,
      val: formatPct(latest),
      delta:
        previous === null
          ? "—"
          : Math.abs(diff) < 0.005
            ? "estável"
            : `${diff > 0 ? "+" : ""}${diff.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} p.p.`,
      dir: diff > 0.005 ? "up" : diff < -0.005 ? "down" : "flat",
      asOf,
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Falha desconhecida" };
  }
}
