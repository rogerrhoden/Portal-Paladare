import { getAllCalendarItems, getStudyItems } from "@/lib/dashboard-repo";
import {
  addStudyAction,
  deleteStudyAction,
  addCalendarAction,
  deleteCalendarAction,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function EquipePage() {
  const [calendar, study] = await Promise.all([getAllCalendarItems(), getStudyItems()]);

  return (
    <div className="wrap">
      <div className="head">
        <div>
          <div className="kicker">Paladare · Área do time</div>
          <h1>
            Curadoria <span className="thin">do time</span>
          </h1>
          <p className="tagline">
            Adicione links de estudo e datas da agenda. O que você salvar aqui aparece
            direto no dashboard compartilhado.
          </p>
        </div>
        <div className="head-right">
          <form method="POST" action="/api/auth/logout">
            <button type="submit" className="btn btn-secondary">
              Sair
            </button>
          </form>
        </div>
      </div>

      <div className="curation-section">
        <div className="mod-title">
          <h2>Central de estudos</h2>
        </div>
        <p className="mod-sub">Cole o link de uma live ou vídeo que valha a pena, com título e uma linha de descrição.</p>

        <form action={addStudyAction} className="curation-form">
          <div className="field">
            <label htmlFor="study-title">Título</label>
            <input id="study-title" name="title" type="text" required />
          </div>
          <div className="field">
            <label htmlFor="study-description">Descrição (1 linha)</label>
            <input id="study-description" name="description" type="text" required />
          </div>
          <div className="field">
            <label htmlFor="study-url">Link</label>
            <input id="study-url" name="url" type="url" required placeholder="https://" />
          </div>
          <button type="submit" className="btn">
            Adicionar
          </button>
        </form>

        {study.length === 0 && <p className="mod-sub">Nada cadastrado ainda.</p>}
        {study.map((s) => (
          <div className="curation-list-item" key={s.id}>
            <div className="info">
              <span className={`curation-tag${s.origem === "automatico" ? " hot" : ""}`}>
                {s.origem === "automatico" ? "automático" : "equipe"}
              </span>
              <h4>{s.titulo}</h4>
              <p>{s.texto}</p>
            </div>
            <form action={deleteStudyAction}>
              <input type="hidden" name="id" value={s.id} />
              <button type="submit" className="btn btn-danger">
                Excluir
              </button>
            </form>
          </div>
        ))}
      </div>

      <div className="curation-section">
        <div className="mod-title">
          <h2>Agenda</h2>
        </div>
        <p className="mod-sub">Feiras, prazos e datas internas da Paladare.</p>

        <form action={addCalendarAction} className="curation-form">
          <div className="field">
            <label htmlFor="cal-title">Título</label>
            <input id="cal-title" name="title" type="text" required />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="cal-start">Data de início</label>
              <input id="cal-start" name="startDate" type="date" required />
            </div>
            <div className="field">
              <label htmlFor="cal-end">Data final (se for período)</label>
              <input id="cal-end" name="endDate" type="date" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="cal-location">Local</label>
            <input id="cal-location" name="location" type="text" />
          </div>
          <div className="field">
            <label htmlFor="cal-impact">Por que isso importa pra Paladare (opcional)</label>
            <input id="cal-impact" name="impact" type="text" />
          </div>
          <label className="field-check">
            <input type="checkbox" name="isDeadline" />É um prazo/inscrição (aparece em destaque)
          </label>
          <button type="submit" className="btn">
            Adicionar
          </button>
        </form>

        {calendar.length === 0 && <p className="mod-sub">Nada cadastrado ainda.</p>}
        {calendar.map((c) => (
          <div className="curation-list-item" key={c.id}>
            <div className="info">
              <span className={`curation-tag${c.source === "automatico" ? " hot" : ""}`}>
                {c.source === "automatico" ? "automático" : "equipe"}
              </span>
              <h4>{c.title}</h4>
              <p>
                {c.startDate}
                {c.endDate ? ` – ${c.endDate}` : ""} {c.location ? `· ${c.location}` : ""}
              </p>
            </div>
            <form action={deleteCalendarAction}>
              <input type="hidden" name="id" value={c.id} />
              <button type="submit" className="btn btn-danger">
                Excluir
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
