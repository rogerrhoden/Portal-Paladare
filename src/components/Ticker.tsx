import type { MarketTick } from "@/lib/types";

function deltaClass(dir: MarketTick["dir"]) {
  if (dir === "up") return "delta up";
  if (dir === "down") return "delta down";
  return "delta flat";
}

function staleLabel(t: MarketTick): string {
  if (t.val === "indisponível") return "sem dado hoje";
  if (!t.dataFonte) return "sem atualização hoje";
  const d = new Date(t.dataFonte);
  if (Number.isNaN(d.getTime())) return "sem atualização hoje";
  const dia = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  return `último valor · ${dia}`;
}

const DIAS_ATRASO_AVISO = 3;

/** Algumas fontes (ex: Brent via Alpha Vantage) divulgam com dias de atraso.
 * Isso não é falha — é a defasagem normal da fonte — mas precisa ficar visível.
 * IPCA fica de fora: por natureza é um índice mensal, "atraso" é o esperado. */
function readingLag(t: MarketTick): string | null {
  if (t.nome.startsWith("IPCA")) return null;
  if (!t.dataFonte) return null;
  const d = new Date(t.dataFonte);
  if (Number.isNaN(d.getTime())) return null;
  const diffDias = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (diffDias < DIAS_ATRASO_AVISO) return null;
  return `leitura de ${d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}`;
}

export function Ticker({
  market,
  semDadoReal,
}: {
  market: MarketTick[];
  semDadoReal?: boolean;
}) {
  return (
    <div className="ticker-shell">
      <div className="ticker-head">
        <span className="lbl">Mercado · glance do setor</span>
        <span className="badge">
          {semDadoReal
            ? "exemplo — aguardando a 1ª rodada da rotina diária"
            : "atualizado 1x/dia pela rotina automática"}
        </span>
      </div>
      <div className="ticker-track">
        {market.map((t) => {
          const lag = t.dir === "stale" ? null : readingLag(t);
          return (
            <div className="tk" key={t.nome}>
              <div className="name">{t.nome}</div>
              <div className="val">{t.val}</div>
              <div className={deltaClass(t.dir)}>
                {t.dir === "stale" ? staleLabel(t) : t.delta}
              </div>
              {lag && <div className="delta flat">{lag}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
