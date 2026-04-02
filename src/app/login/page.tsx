import { loginAction } from '@/lib/actions';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-kommune-blue">Maskindeling.no</h1>
        <p className="mt-1 text-sm text-slate-600">Logg inn for å se og dele maskiner internt i kommunen.</p>

        <form action={loginAction} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">E-post</label>
            <input className="w-full rounded border border-slate-300 px-3 py-2" name="email" type="email" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Passord</label>
            <input className="w-full rounded border border-slate-300 px-3 py-2" name="password" type="password" required />
          </div>
          <button className="w-full rounded bg-kommune-blue px-4 py-2 font-semibold text-white" type="submit">Logg inn</button>
        </form>

        <div className="mt-4 rounded bg-slate-100 p-3 text-xs text-slate-600">
          <p>Demo-brukere:</p>
          <p>admin@oslo.kommune.no / Passord123!</p>
          <p>ola@oslo.kommune.no / Passord123!</p>
        </div>
      </div>
    </main>
  );
}
