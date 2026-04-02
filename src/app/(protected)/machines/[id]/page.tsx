import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { createMachineRequestAction } from '@/lib/actions';
import { requireAuth } from '@/lib/auth';
import { departments, machines } from '@/lib/schema';
import { StatusBadge } from '@/components/ui/status-badge';

export default async function MachineDetailPage({ params }: { params: { id: string } }) {
  await requireAuth();

  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    notFound();
  }

  const [row] = await db
    .select({ machine: machines, departmentName: departments.name })
    .from(machines)
    .innerJoin(departments, eq(machines.departmentId, departments.id))
    .where(eq(machines.id, id));

  if (!row) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="card space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{row.machine.name}</h1>
            <p className="text-sm text-slate-600">{row.machine.brand} {row.machine.model} · {row.departmentName}</p>
          </div>
          <StatusBadge type="machine" status={row.machine.status} />
        </div>
        <p><span className="font-semibold">Lokasjon:</span> {row.machine.location}</p>
        <p><span className="font-semibold">Kontakt:</span> {row.machine.contactName} ({row.machine.contactEmail}, {row.machine.contactPhone})</p>
        {row.machine.notes ? <p><span className="font-semibold">Notat:</span> {row.machine.notes}</p> : null}
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold">Send forespørsel om lån/bruk</h2>
        <form action={createMachineRequestAction} className="mt-3 space-y-3">
          <input type="hidden" name="machineId" value={row.machine.id} />
          <textarea
            name="message"
            required
            minLength={10}
            className="w-full rounded border border-slate-300 px-3 py-2"
            rows={4}
            placeholder="Beskriv behov, ønsket tidsrom og eventuell logistikk."
          />
          <button type="submit" className="rounded bg-kommune-blue px-4 py-2 text-white">Send forespørsel</button>
        </form>
      </section>
    </div>
  );
}
