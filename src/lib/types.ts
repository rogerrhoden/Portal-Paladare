export type MarketDirection = "up" | "down" | "flat" | "stale";

export type MarketTick = {
  nome: string;
  val: string;
  delta: string;
  dir: MarketDirection;
  /** ISO date of the underlying quote, for staleness checks. */
  dataFonte?: string;
};

export type NewsItem = {
  setor: string;
  age: string;
  titulo: string;
  texto: string;
  fonte: string;
  /** Leitura curta: o que esse fato muda pra operação/comercial da Paladare. */
  impacto: string;
};

export type CalendarItem = {
  id: string;
  dia: string;
  mes: string;
  nome: string;
  meta: string;
  hot: boolean;
  /** Leitura curta: o que essa data muda pra operação/comercial da Paladare. */
  impacto: string;
};

export type StudyItem = {
  id: string;
  kind: string;
  titulo: string;
  texto: string;
  url?: string;
  origem: "curado" | "automatico";
};

export type DashboardPayload = {
  atualizadoEm: string;
  market: MarketTick[];
  feed: NewsItem[];
  calendar: CalendarItem[];
  study: StudyItem[];
};
