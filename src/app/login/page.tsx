export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; erro?: string }>;
}) {
  const { next, erro } = await searchParams;

  return (
    <div className="wrap auth-wrap">
      <div className="auth-box">
        <div className="kicker">Paladare · Acesso do time</div>
        <h1 className="auth-title">Entrar</h1>
        <p className="tagline">Digite a senha compartilhada com o time para continuar.</p>

        <form method="POST" action="/api/auth/login" className="auth-form">
          <input type="hidden" name="next" value={next ?? "/equipe"} />
          <label htmlFor="password" className="auth-label">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            className="auth-input"
          />
          {erro && <p className="auth-error">Senha incorreta. Tente de novo.</p>}
          <button type="submit" className="btn auth-submit">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
