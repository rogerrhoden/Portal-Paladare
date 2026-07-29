import { formatUpdatedAt } from "@/lib/format";

export function DashboardHeader({ atualizadoEm }: { atualizadoEm: string }) {
  return (
    <div className="head">
      <div>
        <div className="kicker">Paladare · Catering e Hotelaria — Portal do time</div>
        <h1>
          Portal <span className="thin">Paladare</span>
        </h1>
        <p className="tagline">
          Notícias, mercado, agenda e estudo do setor de energia e mineração, num
          lugar só. Para o time comercial e a diretoria.
        </p>
      </div>
      <div className="head-right">
        <div className="stamp">
          ATUALIZADO EM <b>{formatUpdatedAt(atualizadoEm)}</b>
        </div>
      </div>
    </div>
  );
}
