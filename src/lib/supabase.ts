import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";

let client: SupabaseClient | null = null;

/**
 * Cliente server-only, autenticado com a chave secreta (bypassa RLS).
 * Não usamos Supabase Auth em nenhum lugar, então o módulo de auth do
 * cliente fica todo desligado. Instância única (em vez de uma nova a cada
 * chamada) evita reinicializações desnecessárias em chamadas paralelas.
 * Nunca importar este módulo de um componente client ou rota exposta ao navegador.
 */
export function supabaseAdmin(): SupabaseClient {
  if (!client) {
    client = createClient(env.supabaseUrl, env.supabaseSecretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }
  return client;
}
