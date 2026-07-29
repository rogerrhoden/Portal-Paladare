export type FetchResult =
  | { ok: true; val: string; delta: string; dir: "up" | "down" | "flat"; asOf?: string }
  | { ok: false; error: string };
