import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/lib/env";

const MODEL = "claude-sonnet-5";

export type FeedItemDraft = {
  setor: string;
  age: string;
  titulo: string;
  texto: string;
  fonte: string;
  impacto: string;
};

export type StudySuggestionDraft = {
  kind: string;
  titulo: string;
  texto: string;
  url: string;
};

export type CalendarEventDraft = {
  title: string;
  start_date: string;
  end_date?: string;
  location: string;
  is_deadline: boolean;
  impact: string;
};

export type DeadlineDraft = { title: string; date: string; note: string };
export type BiddingOpportunityDraft = { title: string; portal: string; note: string; url?: string };
export type ProspectingTargetDraft = { company: string; reason: string };
export type CompetitorMoveDraft = { title: string; detail: string; date: string };

export type PrivateBriefingDraft = {
  deadlines: DeadlineDraft[];
  bidding_opportunities: BiddingOpportunityDraft[];
  prospecting_targets: ProspectingTargetDraft[];
  competitor_moves: CompetitorMoveDraft[];
};

export type DailyReport = {
  feed: FeedItemDraft[];
  study_suggestions: StudySuggestionDraft[];
  new_calendar_events: CalendarEventDraft[];
  private_briefing: PrivateBriefingDraft;
};

const SUBMIT_REPORT_TOOL: Anthropic.Tool = {
  name: "submit_report",
  description:
    "Envia o relatório final estruturado do dia. Chame esta ferramenta uma única vez, como última ação, depois de pesquisar na web.",
  input_schema: {
    type: "object",
    properties: {
      feed: {
        type: "array",
        minItems: 6,
        maxItems: 10,
        description:
          "Entre 6 e 10 notícias recentes e verificadas, cobrindo setores diferentes (nunca todas do mesmo setor ou das mesmas 2-3 empresas), para o dashboard compartilhado. Traga só itens reais — se não encontrar o suficiente com qualidade, devolva menos itens em vez de inventar ou repetir.",
        items: {
          type: "object",
          properties: {
            setor: {
              type: "string",
              description:
                "Ex: 'Óleo e Gás · Nacional', 'Mineração · Nacional', 'Catering Público · Prisional', 'Restaurante Popular', 'Cesta Básica', 'Catering Privado · Facilities'",
            },
            age: { type: "string", description: "Ex: 'hoje', 'esta semana', 'fecha 31/07'" },
            titulo: { type: "string" },
            texto: { type: "string", description: "1-2 frases, fatos concretos: nomes, datas, números." },
            fonte: { type: "string" },
            impacto: {
              type: "string",
              description:
                "1 frase: o que esse fato muda pra operação/comercial da Paladare (catering, hotelaria e facilities — sondas, minas, canteiros, presídios, restaurantes populares, cestas básicas, contratos privados).",
            },
          },
          required: ["setor", "age", "titulo", "texto", "fonte", "impacto"],
        },
      },
      study_suggestions: {
        type: "array",
        maxItems: 3,
        description:
          "Lives/vídeos recentes do setor (IBP, IBRAM, ANP, ROG.e, associações de facilities/nutrição institucional etc), para o dashboard compartilhado. Só inclua se encontrar algo real e recente; pode ser lista vazia.",
        items: {
          type: "object",
          properties: {
            kind: { type: "string", description: "Ex: 'Live recente', 'Webinar'" },
            titulo: { type: "string" },
            texto: { type: "string" },
            url: { type: "string" },
          },
          required: ["kind", "titulo", "texto", "url"],
        },
      },
      new_calendar_events: {
        type: "array",
        maxItems: 3,
        description:
          "Feiras/eventos do setor com data confirmada que NÃO estão na lista de já conhecidos, para o dashboard compartilhado. Só inclua se tiver certeza da data; pode ser lista vazia.",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            start_date: { type: "string", description: "YYYY-MM-DD" },
            end_date: { type: "string", description: "YYYY-MM-DD, omitir se for um único dia" },
            location: { type: "string" },
            is_deadline: { type: "boolean", description: "true se for prazo/inscrição, false se for o evento em si" },
            impact: { type: "string", description: "1 frase: o que isso muda pra Paladare" },
          },
          required: ["title", "start_date", "location", "is_deadline", "impact"],
        },
      },
      private_briefing: {
        type: "object",
        description:
          "Inteligência acionável, PRIVADA — só vai por e-mail para o dono da empresa, nunca aparece no dashboard do time. Direto: nomes, datas, números, sem enrolação.",
        properties: {
          deadlines: {
            type: "array",
            description: "Prazos que fecham nos próximos 30 dias (inscrições, editais, cadastros, licitações).",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                date: { type: "string", description: "YYYY-MM-DD" },
                note: { type: "string" },
              },
              required: ["title", "date", "note"],
            },
          },
          bidding_opportunities: {
            type: "array",
            description:
              "Licitações e oportunidades reais de catering/facilities em qualquer portal público ou privado: Petronect, PNCP (federal e estadual), portais de mineradoras, secretarias estaduais/municipais de administração penitenciária (alimentação prisional), programas de restaurante popular, contratos de cesta básica (corporativos, industriais ou de assistência social). Não se limite a óleo/gás e mineração.",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                portal: { type: "string", description: "Ex: 'Petronect', 'PNCP', 'SEAP-RJ', 'Prefeitura de Maceió'" },
                note: { type: "string" },
                url: { type: "string" },
              },
              required: ["title", "portal", "note"],
            },
          },
          prospecting_targets: {
            type: "array",
            description:
              "Empresas ou órgãos públicos específicos para contatar agora, com o motivo concreto. Varie: o Brasil tem mais de 30 operadoras de óleo e gás e dezenas de mineradoras — não repita sempre os mesmos 2-3 nomes. Inclua também alvos fora de óleo/gás/mineração quando fizer sentido: secretarias de administração penitenciária, prefeituras com programa de restaurante popular, empresas que compram cesta básica em volume, empresas de facilities que podem terceirizar catering.",
            items: {
              type: "object",
              properties: {
                company: { type: "string" },
                reason: { type: "string" },
              },
              required: ["company", "reason"],
            },
          },
          competitor_moves: {
            type: "array",
            description:
              "Movimentos de concorrentes de catering/facilities/nutrição institucional (não só no óleo e gás) e novos contratos assinados por operadoras, mineradoras ou órgãos públicos que afetam esse mercado.",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                detail: { type: "string" },
                date: { type: "string" },
              },
              required: ["title", "detail", "date"],
            },
          },
        },
        required: ["deadlines", "bidding_opportunities", "prospecting_targets", "competitor_moves"],
      },
    },
    required: ["feed", "study_suggestions", "new_calendar_events", "private_briefing"],
  },
};

function buildPrompt(context: {
  existingCalendarTitles: string[];
  existingStudyUrls: string[];
  recentFeedTitles: string[];
}): string {
  const hoje = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "America/Maceio",
  });

  return `Hoje é ${hoje}. Você monta a inteligência diária da Paladare, empresa brasileira de catering, hotelaria e facilities, com base sendo transferida para Maceió (AL) e meta de entrar no mercado offshore.

A Paladare atende (ou quer atender) qualquer contrato de alimentação/facilities, público ou privado, incluindo:
- Sondas de petróleo, plataformas offshore e onshore, minas e canteiros industriais — em todo o Brasil, não só Nordeste (o país tem mais de 30 operadoras de óleo e gás e dezenas de mineradoras ativas; varie as empresas e regiões, não fique preso sempre nas mesmas 2-3).
- Alimentação em unidades do sistema penitenciário (contratos estaduais/federais).
- Restaurantes populares (programas municipais/estaduais de alimentação subsidiada).
- Cestas básicas (contratos corporativos, industriais ou de assistência social, públicos ou privados).
- Qualquer outro contrato de catering/facilities, público ou privado, fora desses (hospitais, eventos, campus corporativo, etc.) quando for relevante.

Pesquise na web e produza DUAS coisas, no MESMO relatório:

## Parte A — dashboard compartilhado com o time (sem estratégia, só panorama)

1. FEED: entre 6 e 10 notícias recentes cobrindo essa diversidade de setores (misture óleo e gás, mineração, alimentação prisional, restaurante popular, cesta básica e outros contratos de catering/facilities — não traga tudo do mesmo setor nem das mesmas empresas). Para cada uma, escreva também "impacto": uma frase direta sobre o que isso significa comercialmente pra Paladare (não genérica — cite o ganho ou risco concreto).
${context.recentFeedTitles.length > 0 ? `   Evite repetir os mesmos temas/empresas dos últimos dias: ${context.recentFeedTitles.join(" | ")}.` : ""}

2. STUDY_SUGGESTIONS (0 a 3): lives ou vídeos recentes e reais do setor. Só inclua se encontrar algo verificável com URL real. Não sugira nenhum destes, que já estão na central de estudos: ${context.existingStudyUrls.join(", ") || "(nenhum)"}.

3. NEW_CALENDAR_EVENTS (0 a 3): feiras, prazos ou eventos com data confirmada que ainda não estão na agenda. Não repita nenhum destes, que já estão cadastrados: ${context.existingCalendarTitles.join(", ") || "(nenhum)"}.

## Parte B — briefing PRIVADO, só para o dono da empresa por e-mail (nunca aparece pro time)

Aqui é estratégia de verdade. Seja específico: nomes de empresa, datas, números. Sem enrolação.

4. DEADLINES: prazos que fecham nos próximos 30 dias a partir de hoje (inscrições, editais, licitações, cadastros).

5. BIDDING_OPPORTUNITIES: licitações e oportunidades reais de catering/facilities em qualquer portal — Petronect, PNCP (federal e estadual), portais de mineradoras, secretarias de administração penitenciária, programas de restaurante popular, contratos de cesta básica. Não se limite a óleo/gás e mineração.

6. PROSPECTING_TARGETS: empresas ou órgãos públicos específicos para contatar agora, com o motivo concreto. Varie entre as dezenas de operadoras/mineradoras que atuam no Brasil, e inclua também alvos de fora desses dois setores quando fizer sentido (prisional, restaurante popular, cesta básica, facilities).

7. COMPETITOR_MOVES: movimentos de concorrentes de catering/facilities/nutrição institucional (qualquer segmento, não só óleo e gás) e novos contratos assinados por operadoras, mineradoras ou órgãos públicos.

Se não encontrar nada real e verificável para algum item, devolva lista vazia (ou, no caso do feed, menos itens) — nunca invente prazo, empresa, contrato ou repita o mesmo fato reformulado só pra preencher espaço.

Depois de pesquisar, chame a ferramenta submit_report uma única vez com o resultado final, incluindo private_briefing preenchido. Não responda em texto solto — a resposta final tem que ser a chamada da ferramenta.`;
}

/**
 * Pesquisa na web via Claude e devolve o relatório estruturado do dia
 * (conteúdo do dashboard + briefing privado). Retorna null (em vez de
 * lançar) se a IA não conseguir produzir um relatório válido — quem chama
 * deve manter o conteúdo anterior nesse caso.
 */
export async function generateDailyReport(context: {
  existingCalendarTitles: string[];
  existingStudyUrls: string[];
  recentFeedTitles?: string[];
}): Promise<DailyReport | null> {
  const client = new Anthropic({ apiKey: env.anthropicApiKey });

  const tools: Anthropic.ToolUnion[] = [
    { type: "web_search_20250305", name: "web_search", max_uses: 20 },
    SUBMIT_REPORT_TOOL,
  ];

  let messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: buildPrompt({
        existingCalendarTitles: context.existingCalendarTitles,
        existingStudyUrls: context.existingStudyUrls,
        recentFeedTitles: context.recentFeedTitles ?? [],
      }),
    },
  ];

  for (let attempt = 0; attempt < 5; attempt++) {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 9500,
      messages,
      tools,
    });

    if (response.stop_reason === "pause_turn") {
      messages = [...messages, { role: "assistant", content: response.content }];
      continue;
    }

    const submit = response.content.find(
      (block): block is Anthropic.ToolUseBlock =>
        block.type === "tool_use" && block.name === "submit_report",
    );

    if (submit) {
      const parsed = submit.input as DailyReport;
      if (!Array.isArray(parsed.feed) || parsed.feed.length === 0) {
        console.error("[daily-report] submit_report veio sem feed válido");
        return null;
      }
      return {
        feed: parsed.feed,
        study_suggestions: Array.isArray(parsed.study_suggestions) ? parsed.study_suggestions : [],
        new_calendar_events: Array.isArray(parsed.new_calendar_events) ? parsed.new_calendar_events : [],
        private_briefing: {
          deadlines: parsed.private_briefing?.deadlines ?? [],
          bidding_opportunities: parsed.private_briefing?.bidding_opportunities ?? [],
          prospecting_targets: parsed.private_briefing?.prospecting_targets ?? [],
          competitor_moves: parsed.private_briefing?.competitor_moves ?? [],
        },
      };
    }

    console.error(
      `[daily-report] resposta terminou sem submit_report (stop_reason=${response.stop_reason})`,
    );
    return null;
  }

  console.error("[daily-report] excedeu tentativas de pause_turn");
  return null;
}
