import type { DashboardPayload } from "./types";

/**
 * Dados de exemplo para desenvolvimento do layout. Os valores de mercado
 * abaixo foram checados manualmente via busca na web em 25/07/2026 (fontes:
 * AwesomeAPI-style USD/BRL, Investing.com/OilPrice Brent, IBGE IPCA jun/2026,
 * StatusInvest PETR4/VALE3/PRIO3) só para não mostrar números fantasiosos
 * enquanto o item #2 (conexão real com as APIs) não entra. Em produção, este
 * payload inteiro é substituído pelo registro mais recente gravado no
 * Supabase pela rotina diária (Vercel Cron) e pela curadoria do time.
 */
export const SEED_DASHBOARD: DashboardPayload = {
  atualizadoEm: "2026-07-25T09:00:00-03:00",
  market: [
    { nome: "Dólar (USD/BRL)", val: "5,08", delta: "estável", dir: "flat" },
    { nome: "Brent (US$/barril)", val: "96,78", delta: "-3,9%", dir: "down" },
    { nome: "IPCA 12m", val: "4,64%", delta: "-0,08 p.p.", dir: "down" },
    { nome: "PETR4", val: "42,21", delta: "-1,7%", dir: "down" },
    { nome: "VALE3", val: "75,24", delta: "-0,6%", dir: "down" },
    { nome: "PRIO3", val: "58,82", delta: "-2,8%", dir: "down" },
  ],
  feed: [
    {
      setor: "Offshore · SE-AL",
      age: "esta semana",
      titulo: "SEAP recebe decisão final de investimento",
      texto:
        "A Petrobras aprovou o FID dos dois módulos do Sergipe Águas Profundas. A SBM Offshore fica com as plataformas P-81 e P-87, com assinatura de contratos prevista para maio e primeiro óleo em 2030.",
      fonte: "Agência Petrobras",
      impacto:
        "Novo polo com contrato longo bem na região de base da Paladare — vale mapear agora quem vai operar o catering das plataformas antes da concorrência.",
    },
    {
      setor: "Offshore · M. Equatorial",
      age: "recente",
      titulo: "Petrobras quer duas sondas na Margem Equatorial",
      texto:
        "A estatal combina equipamentos da Foresea e da Constellation para ganhar flexibilidade operacional na nova fronteira exploratória.",
      fonte: "BNamericas",
      impacto:
        "Sonda operando é serviço de bordo com contrato longo — Foresea e Constellation viram alvos diretos de prospecção pra catering offshore.",
    },
    {
      setor: "Mineração · AL",
      age: "em operação",
      titulo: "Serrote é a única mina de metais básicos de Alagoas",
      texto:
        "A Mineração Vale Verde opera a mina de cobre em Craíbas sob o grupo Baiyin Nonferrous, lavrando cerca de 4,1 milhões de toneladas por ano.",
      fonte: "Vale Verde / IBRAM",
      impacto:
        "Cliente de mineração já operando a poucas horas da nova base em Maceió — bom teste de proximidade antes de mirar minas maiores no Nordeste.",
    },
    {
      setor: "Evento · Prazo",
      age: "fecha 31/07",
      titulo: "Rodadas de negócios da EXPOSIBRAM abertas",
      texto:
        "Inscrições até 31 de julho para as rodadas que conectam mineradoras a fornecedores, dentro da feira de agosto em BH.",
      fonte: "IBRAM",
      impacto:
        "Janela curta pra colocar a Paladare na frente de mineradoras compradoras de catering — inscrição precisa sair antes do dia 31.",
    },
    {
      setor: "Energia · Brasil",
      age: "tendência",
      titulo: "Setor projeta US$ 165 bi de investimento até 2034",
      texto:
        "O óleo e gás prevê mais de US$ 165 bilhões no Brasil e a sustentação de perto de 400 mil empregos ao ano até 2034.",
      fonte: "IBP",
      impacto:
        "Demanda de longo prazo por serviço de bordo e alojamento segue crescendo — sustenta o plano de expandir pra offshore nos próximos anos.",
    },
  ],
  calendar: [
    {
      id: "prazo-exposibram-2026",
      dia: "31",
      mes: "JUL",
      nome: "Prazo — Rodadas EXPOSIBRAM",
      meta: "Inscrição · online",
      hot: true,
      impacto: "Última chance de garantir reunião com mineradoras compradoras na feira de agosto.",
    },
    {
      id: "exposibram-2026",
      dia: "24–27",
      mes: "AGO",
      nome: "EXPOSIBRAM 2026",
      meta: "Expominas · Belo Horizonte",
      hot: false,
      impacto: "Maior concentração de decisores de mineração do país — prioridade pro time comercial de catering industrial.",
    },
    {
      id: "congresso-direito-minerario-2026",
      dia: "15–16",
      mes: "SET",
      nome: "Congresso Int. Direito Minerário",
      meta: "Brasília",
      hot: false,
      impacto: "Bom pra entender regulação de novos projetos de mineração que ainda vão precisar de fornecedor de catering.",
    },
    {
      id: "roge-2026",
      dia: "21–24",
      mes: "SET",
      nome: "ROG.e — Rio Oil & Gas",
      meta: "Riocentro · Rio de Janeiro",
      hot: false,
      impacto: "Principal feira de óleo e gás do Brasil — janela direta pra prospectar operadoras e empresas de sonda offshore.",
    },
  ],
  study: [
    {
      id: "ibp-eventos",
      kind: "Fonte · Energia",
      titulo: "IBP — eventos e lives",
      url: "https://www.ibp.org.br/eventos/",
      texto:
        "Quem organiza a ROG.e. Painéis e transmissões sobre transição energética, offshore e cadeia de suprimentos.",
      origem: "curado",
    },
    {
      id: "ibram-conteudo",
      kind: "Fonte · Mineração",
      titulo: "IBRAM — conteúdo do setor",
      url: "https://ibram.org.br/",
      texto:
        "Webinars e materiais sobre mineração, ESG e minerais críticos. Base para entender o cliente de mina.",
      origem: "curado",
    },
    {
      id: "anp-dados",
      kind: "Dados · Regulador",
      titulo: "ANP — produção e apresentações",
      url: "https://www.gov.br/anp/",
      texto:
        "Números oficiais de produção de óleo e gás. Útil pra dimensionar o tamanho de cada operação.",
      origem: "curado",
    },
  ],
};
