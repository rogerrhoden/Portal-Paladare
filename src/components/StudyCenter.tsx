import type { StudyItem } from "@/lib/types";

export function StudyCenter({ study }: { study: StudyItem[] }) {
  return (
    <div>
      <div className="mod-title">
        <h2>Central de estudos</h2>
      </div>
      <p className="mod-sub">Lives, vídeos e fontes para o time se aprofundar.</p>
      <div>
        {study.length === 0 && (
          <p className="mod-sub">Nenhum conteúdo cadastrado ainda.</p>
        )}
        {study.map((s) => (
          <div
            className={`study${s.origem === "automatico" ? " auto" : ""}`}
            key={s.id}
          >
            <div className="kind">
              <span>{s.kind}</span>
              {s.origem === "automatico" && (
                <span className="auto-tag">sugerido automaticamente</span>
              )}
            </div>
            <h3>{s.titulo}</h3>
            <p>{s.texto}</p>
            {s.url && (
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                abrir ↗
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
