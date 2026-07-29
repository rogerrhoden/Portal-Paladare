import type { NewsItem } from "@/lib/types";

export function NewsFeed({ feed }: { feed: NewsItem[] }) {
  return (
    <div>
      <div className="mod-title">
        <h2>Feed de notícias</h2>
        <span className="n">{feed.length} itens</span>
      </div>
      <p className="mod-sub">
        O que se moveu no setor. Atualiza sozinho todo dia, via busca automática.
      </p>
      <div>
        {feed.length === 0 && (
          <p className="mod-sub">Nenhuma notícia disponível no momento.</p>
        )}
        {feed.map((item, i) => (
          <div className="feed-item" key={i}>
            <span className="setor">{item.setor}</span>
            <span className="age">{item.age}</span>
            <h3>{item.titulo}</h3>
            <p>{item.texto}</p>
            {item.fonte && <span className="src">Fonte: {item.fonte}</span>}
            {item.impacto && (
              <div className="impact">
                <span className="impact-label">Pra Paladare</span>
                <p>{item.impacto}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
