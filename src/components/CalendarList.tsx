import type { CalendarItem } from "@/lib/types";

export function CalendarList({ calendar }: { calendar: CalendarItem[] }) {
  return (
    <div>
      <div className="mod-title">
        <h2>Agenda</h2>
      </div>
      <p className="mod-sub">Feiras, prazos e datas da empresa.</p>
      <div>
        {calendar.length === 0 && (
          <p className="mod-sub">Nenhum evento cadastrado ainda.</p>
        )}
        {calendar.map((c) => (
          <div className="cal-item" key={c.id}>
            <div className={`cal-date${c.hot ? " hot" : ""}`}>
              <span className="d">{c.dia}</span>
              <span className="m">{c.mes}</span>
            </div>
            <div className="cal-body">
              <h3>{c.nome}</h3>
              <div className={`meta${c.hot ? " hot" : ""}`}>{c.meta}</div>
              {c.impacto && (
                <div className="impact">
                  <span className="impact-label">Pra Paladare</span>
                  <p>{c.impacto}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
