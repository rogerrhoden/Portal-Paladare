import { Ticker } from "@/components/Ticker";
import { DashboardHeader } from "@/components/DashboardHeader";
import { NewsFeed } from "@/components/NewsFeed";
import { CalendarList } from "@/components/CalendarList";
import { StudyCenter } from "@/components/StudyCenter";
import { SEED_DASHBOARD } from "@/lib/seed-data";

// TODO(#2): substituir SEED_DASHBOARD pela leitura do payload mais recente
// gravado no Supabase pela rotina diária (Vercel Cron) e pela curadoria do time.
export default function Home() {
  const dashboard = SEED_DASHBOARD;

  return (
    <div className="wrap">
      <Ticker market={dashboard.market} />
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
      </p>
    </div>
  );
}
