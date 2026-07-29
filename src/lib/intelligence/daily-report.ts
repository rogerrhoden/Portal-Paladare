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

export type DailyReport = {
  feed: FeedItemDraft[];
  study_suggestions: StudySuggestionDraft[];
  new_calendar_events: CalendarEventDraft[];
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
        minItems: 5,
        maxItems: 5,
        description: "Exatamente 5 notícias recentes e verificadas do setor.",
        items: {
          type: "object",
          properties: {
            setor: { type: "string", description: "Ex: 'Offshore · SE-AL', 'Mineração · AL'" },
            age: { type: "string", description: "Ex: 'hoje', 'esta semana', 'fecha 31/07'" },
            titulo: { type: "string" },
            texto: { type: "string", description: "1-2 frases, fatos concretos: nomes, datas, números." },
            fonte: { type: "string" },
            impacto: {
              type: "string",
              description:
                "1 frase: o que esse fato muda pra operação/comercial da Paladare (catering/hotelaria pra sondas, minas, canteiros).",
            },
          },
          required: ["setor", "age", "titulo", "texto", "fonte", "impacto"],
        },
      },
      study_suggestions: {
        type: "array",
        maxItems: 3,
        description:
          "Lives/vídeos recentes do setor (IBP, IBRAM, ANP, ROG.e etc). Só inclua se encontrar algo real e recente; pode ser lista vazia.",
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
          "Feiras/eventos do setor com data confirmada que NÃO estão na lista de já conhecidos. Só inclua se tiver certeza da data; pode ser lista vazia.",
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
    },
    required: ["feed", "study_suggestions", "new_calendar_events"],
  },
};

function buildPrompt(context: { existingCalendarTitles: string[]; existingStudyUrls: string[] }): string {
  const hoje = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "America/Maceio",
  });

  return `Hoje é ${hoje}. Você monta o portal de inteligência da Paladare, empresa brasileira de catering e hotelaria que atende sondas de petróleo, minas e canteiros industriais, com base sendo transferida para Maceió (AL) e meta de entrar no mercado offshore.

Pesquise na web e traga, verificado e recente:

1. FEED: exatamente 5 notícias recentes do setor de óleo e gás, mineração e energia relevantes para catering industrial, com foco em Nordeste, Bacia Sergipe-Alagoas e Margem Equatorial. Inclua novos contratos e negociações de empresas do setor. Para cada uma, escreva também "impacto": uma frase direta sobre o que isso significa comercialmente pra Paladare (não genérica — cite o ganho ou risco concreto).

2. STUDY_SUGGESTIONS (0 a 3): lives ou vídeos recentes e reais do setor (canais como IBP, IBRAM, ANP, eventos como ROG.e). Só inclua se encontrar algo verificável com URL real. Não sugira nenhum destes, que já estão na central de estudos: ${context.existingStudyUrls.join(", ") || "(nenhum)"}.

3. NEW_CALENDAR_EVENTS (0 a 3): feiras, prazos ou eventos do setor com data confirmada que ainda não estão na agenda. Não repita nenhum destes, que já estão cadastrados: ${context.existingCalendarTitles.join(", ") || "(nenhum)"}.

Depois de pesquisar, chame a ferramenta submit_report uma única vez com o resultado final. Não responda em texto solto — a resposta final tem que ser a chamada da ferramenta.`;
}

/**
 * Pesquisa na web via Claude e devolve o relatório estruturado do dia.
 * Retorna null (em vez de lançar) se a IA não conseguir produzir um
 * relatório válido — quem chama deve manter o conteúdo anterior nesse caso.
 */
export async function generateDailyReport(context: {
  existingCalendarTitles: string[];
  existingStudyUrls: string[];
}): Promise<DailyReport | null> {
  const client = new Anthropic({ apiKey: env.anthropicApiKey });

  const tools: Anthropic.ToolUnion[] = [
    { type: "web_search_20250305", name: "web_search", max_uses: 10 },
    SUBMIT_REPORT_TOOL,
  ];

  let messages: Anthropic.MessageParam[] = [
    { role: "user", content: buildPrompt(context) },
  ];

  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
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
