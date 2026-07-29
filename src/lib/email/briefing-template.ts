import "server-only";
import type {
  BiddingOpportunityDraft,
  CompetitorMoveDraft,
  DeadlineDraft,
  ProspectingTargetDraft,
} from "@/lib/intelligence/daily-report";

const INK = "#0C232E";
const AMBER = "#FFB000";
const SEA = "#3E7A5E";
const TEXT = "#1A1A1A";
const DIM = "#5B6B6E";
const BORDER = "#DDE5E2";

function esc(s: string): string {
  return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));
}

function formatDateBr(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return esc(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function section(title: string, rows: string, emptyLabel: string): string {
  return `
    <tr><td style="padding:28px 0 8px;">
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:${SEA};font-weight:bold;border-bottom:2px solid ${BORDER};padding-bottom:8px;">${esc(title)}</div>
    </td></tr>
    <tr><td>${rows || `<p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${DIM};margin:10px 0;">${esc(emptyLabel)}</p>`}</td></tr>
  `;
}

function row(main: string, sub: string): string {
  return `
    <div style="padding:10px 0;border-top:1px solid ${BORDER};font-family:Arial,Helvetica,sans-serif;">
      <div style="font-size:14.5px;color:${TEXT};font-weight:bold;">${main}</div>
      <div style="font-size:13px;color:${DIM};margin-top:2px;">${sub}</div>
    </div>
  `;
}

export function buildBriefingEmailHtml(input: {
  dateLabel: string;
  deadlines: DeadlineDraft[];
  biddingOpportunities: BiddingOpportunityDraft[];
  prospectingTargets: ProspectingTargetDraft[];
  competitorMoves: CompetitorMoveDraft[];
}): string {
  const deadlinesRows = [...input.deadlines]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((d) => row(`${formatDateBr(d.date)} — ${esc(d.title)}`, esc(d.note)))
    .join("");

  const biddingRows = input.biddingOpportunities
    .map((b) =>
      row(
        `${esc(b.title)} <span style="color:${DIM};font-weight:normal;">· ${esc(b.portal)}</span>`,
        `${esc(b.note)}${b.url ? ` — <a href="${esc(b.url)}" style="color:${INK};">abrir</a>` : ""}`,
      ),
    )
    .join("");

  const targetsRows = input.prospectingTargets
    .map((t) => row(esc(t.company), esc(t.reason)))
    .join("");

  const movesRows = input.competitorMoves
    .map((m) => row(`${esc(m.title)} <span style="color:${DIM};font-weight:normal;">· ${esc(m.date)}</span>`, esc(m.detail)))
    .join("");

  return `<!doctype html>
<html lang="pt-BR">
<body style="margin:0;padding:0;background:#F2F5F3;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2F5F3;">
    <tr><td align="center" style="padding:24px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;">
        <tr><td style="background:${INK};padding:22px 26px;">
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${AMBER};">Briefing privado · Paladare</div>
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:22px;color:#ffffff;font-weight:bold;margin-top:4px;">${esc(input.dateLabel)}</div>
        </td></tr>
        <tr><td style="padding:6px 26px 30px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${section("Prazos — próximos 30 dias", deadlinesRows, "Nenhum prazo identificado nos próximos 30 dias.")}
            ${section("Licitações e oportunidades de catering", biddingRows, "Nenhuma oportunidade nova identificada hoje.")}
            ${section("Alvos de prospecção", targetsRows, "Nenhum alvo novo identificado hoje.")}
            ${section("Movimentos de concorrentes e contratos", movesRows, "Nenhum movimento relevante identificado hoje.")}
          </table>
        </td></tr>
        <tr><td style="padding:16px 26px;border-top:1px solid ${BORDER};">
          <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:${DIM};margin:0;line-height:1.6;">
            Gerado automaticamente pela rotina diária do Portal Paladare via busca na web. Confira antes de agir — não é aconselhamento jurídico ou financeiro. Este e-mail é só para você; nenhum destes dados aparece no dashboard do time.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
