const MESES = [
  "JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
  "JUL", "AGO", "SET", "OUT", "NOV", "DEZ",
];

export function formatCalendarDate(
  startDate: string,
  endDate: string | null,
): { dia: string; mes: string } {
  const start = new Date(`${startDate}T00:00:00`);
  if (!endDate || endDate === startDate) {
    return { dia: start.getDate().toString().padStart(2, "0"), mes: MESES[start.getMonth()] };
  }
  const end = new Date(`${endDate}T00:00:00`);
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  if (sameMonth) {
    return {
      dia: `${start.getDate().toString().padStart(2, "0")}–${end.getDate().toString().padStart(2, "0")}`,
      mes: MESES[start.getMonth()],
    };
  }
  const dd = (d: Date) => `${d.getDate().toString().padStart(2, "0")}/${MESES[d.getMonth()]}`;
  return { dia: `${dd(start)}–${dd(end)}`, mes: "" };
}

/**
 * Rótulo relativo determinístico ("hoje", "ontem", "há 3 dias"...) a partir
 * de uma data real (YYYY-MM-DD). Calculado em código, nunca "adivinhado"
 * pela IA — evita linha do tempo inconsistente ou errada.
 */
export function formatRelativeAge(dateIso: string): string {
  const date = new Date(`${dateIso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateIso;

  const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: "America/Maceio" });
  const today = new Date(`${todayStr}T00:00:00`);

  const diffDays = Math.round((today.getTime() - date.getTime()) / 86_400_000);

  if (diffDays < 0) return formatShortDate(date);
  if (diffDays === 0) return "hoje";
  if (diffDays === 1) return "ontem";
  if (diffDays < 7) return `há ${diffDays} dias`;
  if (diffDays < 14) return "semana passada";
  if (diffDays < 30) return `há ${Math.round(diffDays / 7)} semanas`;
  if (diffDays < 60) return "mês passado";
  if (diffDays < 365) return `há ${Math.round(diffDays / 30)} meses`;
  return formatShortDate(date);
}

function formatShortDate(date: Date): string {
  const dia = date.getDate().toString().padStart(2, "0");
  const mes = MESES[date.getMonth()];
  return `${dia} ${mes}`;
}

export function formatUpdatedAt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const dia = d.getDate().toString().padStart(2, "0");
  const mes = MESES[d.getMonth()];
  const hora = d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Maceio",
  });
  return `${dia} ${mes} ${d.getFullYear()} · ${hora} (horário de Brasília)`;
}
