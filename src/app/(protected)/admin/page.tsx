import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { updateRequestStatusAction } from '@/lib/actions';
import { requireAdmin } from '@/lib/auth';
import { departments, machineRequests, machines, users } from '@/lib/schema';
import { StatusBadge } from '@/components/ui/status-badge';

export default async function AdminPage() {
  await requireAdmin();

  const requests = await db
    .select({
      request: machineRequests,
      machineName: machines.name,
      requestedBy: users.name,
      fromDepartment: departments.name
    })
    .from(machineRequests)
    .innerJoin(machines, eq(machineRequests.machineId, machines.id))
    .innerJoin(users, eq(machineRequests.requestedByUserId, users.id))
    .innerJoin(departments, eq(machineRequests.fromDepartmentId, departments.id));

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold">Adminpanel</h1>
        <p className="text-sm text-slate-600">Behandle innkomne forespørsler om maskindeling.</p>
      </section>

      <section className="space-y-3">
        {requests.map(({ request, machineName, requestedBy, fromDepartment }) => (
          <article key={request.id} className="card space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">{machineName}</h2>
              <StatusBadge type="request" status={request.status} />
            </div>
            <p className="text-sm text-slate-600">Fra: {requestedBy} ({fromDepartment})</p>
            <p>{request.message}</p>
            <form action={updateRequestStatusAction} className="flex flex-wrap gap-2">
              <input type="hidden" name="requestId" value={request.id} />
              <button className="rounded bg-emerald-600 px-3 py-2 text-sm text-white" type="submit" name="status" value="godkjent">Godkjenn</button>
              <button className="rounded bg-rose-600 px-3 py-2 text-sm text-white" type="submit" name="status" value="avslått">Avslå</button>
              <button className="rounded bg-slate-500 px-3 py-2 text-sm text-white" type="submit" name="status" value="sendt">Sett til sendt</button>
            </form>
          </article>
        ))}
      </section>
    </div>
  );
}
