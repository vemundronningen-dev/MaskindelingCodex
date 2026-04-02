import Link from 'next/link';
import { logoutAction } from '@/lib/actions';

export function TopNav({ name, role }: { name: string; role: string }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div>
          <p className="text-lg font-semibold text-kommune-blue">Maskindeling.no</p>
          <p className="text-xs text-slate-500">Internt system for deling av maskiner</p>
        </div>
        <nav className="flex items-center gap-2 text-sm">
          <Link className="rounded px-3 py-2 hover:bg-slate-100" href="/dashboard">Dashboard</Link>
          <Link className="rounded px-3 py-2 hover:bg-slate-100" href="/machines">Maskiner</Link>
          {role === 'admin' && <Link className="rounded px-3 py-2 hover:bg-slate-100" href="/admin">Admin</Link>}
          <form action={logoutAction}>
            <button className="rounded bg-slate-900 px-3 py-2 text-white" type="submit">Logg ut</button>
          </form>
        </nav>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-3 text-xs text-slate-600">Innlogget som {name}</div>
    </header>
  );
}
