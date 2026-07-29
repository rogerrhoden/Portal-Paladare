import { Ticker } from "@/components/Ticker";
import { DashboardHeader } from "@/components/DashboardHeader";
import { NewsFeed } from "@/components/NewsFeed";
import { CalendarList } from "@/components/CalendarList";
import { StudyCenter } from "@/components/StudyCenter";
import { SEED_DASHBOARD } from "@/lib/seed-data";
import { getLatestSnapshot, getCalendarItems, getStudyItems } from "@/lib/dashboard-repo";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [snapshot, calendar, study] = await Promise.all([
    getLatestSnapshot(),
    getCalendarItems(),
    getStudyItems(),
  ]);

  const dashboard = {
    atualizadoEm: snapshot?.atualizado_em ?? SEED_DASHBOARD.atualizadoEm,
    market: snapshot?.market ?? SEED_DASHBOARD.market,
    feed: snapshot?.feed ?? SEED_DASHBOARD.feed,
    calendar: calendar.length > 0 ? calendar : SEED_DASHBOARD.calendar,
    study: study.length > 0 ? study : SEED_DASHBOARD.study,
  };
  const semDadoReal = snapshot === null;

  return (
    <div className="wrap">
      <Ticker market={dashboard.market} semDadoReal={semDadoReal} />
      <DashboardHeader atualizadoEm={dashboard.atualizadoEm} />

      <div className="grid">
        <div className="col-main">
          <NewsFeed feed={dashboard.feed} />
        </div>

        <div className="col-side">
          <CalendarList calendar={dashboard.calendar} />
          <StudyCenter study={dashboard.study} />
        </div>
      </div>

      <p className="note">
        Versão única e compartilhada: quando a rotina diária ou o time atualiza,
        todo mundo vê o mesmo conteúdo. O feed e o mercado são atualizados
        automaticamente 1x/dia; agenda e central de estudos são mantidas pela
        equipe.
        <br />
        O briefing comercial acionável (alvos, prazos, estratégia) é entregue à
        parte, só para o dono da conta.
        <br />
        Time: adicione links de estudo e datas da agenda na{" "}
        <a href="/equipe" style={{ color: "var(--amber)" }}>
          área de curadoria
        </a>
        .
      </p>
    </div>
  );
}
