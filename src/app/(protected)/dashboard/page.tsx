import Link from 'next/link';
import { db } from '@/lib/db';
import { machineRequests } from '@/lib/schema';
import { fetchDashboardStats } from '@/lib/actions';
import { requireAuth } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { StatusBadge } from '@/components/ui/status-badge';
import { StatCard } from '@/components/ui/stat-card';

export default async function DashboardPage() {
  const user = await requireAuth();
  const stats = await fetchDashboardStats();

  const myRequests = await db.select().from(machineRequests).where(eq(machineRequests.requestedByUserId, user.id));

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-slate-600">Oversikt over maskiner og forespørsler i {user.organizationName}.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Totalt antall maskiner" value={stats.totalMachines} />
        <StatCard title="Tilgjengelige maskiner" value={stats.availableMachines} />
        <StatCard title="Åpne forespørsler" value={stats.activeRequests} />
        <StatCard title="Godkjente forespørsler" value={stats.approvedRequests} />
      </section>

      <section className="card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Mine forespørsler</h2>
          <Link href="/machines" className="rounded bg-kommune-blue px-3 py-2 text-sm font-medium text-white">Finn maskiner</Link>
        </div>
        <div className="mt-3 space-y-2">
          {myRequests.length === 0 ? (
            <p className="text-sm text-slate-600">Ingen forespørsler registrert.</p>
          ) : (
            myRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between rounded border border-slate-200 p-3 text-sm">
                <p>Forespørsel #{request.id}</p>
                <StatusBadge type="request" status={request.status} />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
