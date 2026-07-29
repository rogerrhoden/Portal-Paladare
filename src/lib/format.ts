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
