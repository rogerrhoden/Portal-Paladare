import type { MarketTick } from "@/lib/types";

function deltaClass(dir: MarketTick["dir"]) {
  if (dir === "up") return "delta up";
  if (dir === "down") return "delta down";
  return "delta flat";
}

export function Ticker({ market }: { market: MarketTick[] }) {
  return (
    <div className="ticker-shell">
      <div className="ticker-head">
        <span className="lbl">Mercado · glance do setor</span>
        <span className="badge">atualizado 1x/dia pela rotina automática</span>
      </div>
      <div className="ticker-track">
        {market.map((t) => (
          <div className="tk" key={t.nome}>
            <div className="name">{t.nome}</div>
            <div className="val">{t.val}</div>
            <div className={deltaClass(t.dir)}>
              {t.dir === "stale" ? "indisponível hoje" : t.delta}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
