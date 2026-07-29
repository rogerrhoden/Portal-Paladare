function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente ausente: ${name}`);
  }
  return value;
}

export const env = {
  get anthropicApiKey() {
    return required("ANTHROPIC_API_KEY");
  },
  get supabaseUrl() {
    return required("SUPABASE_URL");
  },
  get supabaseSecretKey() {
    return required("SUPABASE_SECRET_KEY");
  },
  get resendApiKey() {
    return required("RESEND_API_KEY");
  },
  get briefingEmailTo() {
    return required("BRIEFING_EMAIL_TO");
  },
  get brapiToken() {
    return required("BRAPI_TOKEN");
  },
  get alphaVantageApiKey() {
    return required("ALPHA_VANTAGE_API_KEY");
  },
  get dashboardPassword() {
    return required("DASHBOARD_PASSWORD");
  },
  get cronSecret() {
    return process.env.CRON_SECRET ?? "";
  },
};
