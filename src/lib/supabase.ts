import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

/**
 * Cliente server-only, autenticado com a chave secreta (bypassa RLS).
 * Nunca importar este módulo de um componente client ou rota exposta ao navegador.
 */
export function supabaseAdmin() {
  return createClient(env.supabaseUrl, env.supabaseSecretKey, {
    auth: { persistSession: false },
  });
}
