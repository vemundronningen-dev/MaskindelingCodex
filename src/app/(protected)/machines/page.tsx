import Link from 'next/link';
import { fetchDepartments, fetchMachineList } from '@/lib/actions';
import { StatusBadge } from '@/components/ui/status-badge';

export default async function MachinesPage({
  searchParams
}: {
  searchParams: { q?: string; status?: string; department?: string };
}) {
  const [machines, departments] = await Promise.all([
    fetchMachineList({
      search: searchParams.q,
      status: searchParams.status,
      department: searchParams.department
    }),
    fetchDepartments()
  ]);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold">Maskinliste</h1>
        <p className="text-sm text-slate-600">Søk og filtrer maskiner på tvers av kommunale virksomheter.</p>
      </section>

      <form className="card grid gap-3 md:grid-cols-4">
        <input name="q" placeholder="Søk etter maskin" defaultValue={searchParams.q} className="rounded border border-slate-300 px-3 py-2" />
        <select name="status" defaultValue={searchParams.status} className="rounded border border-slate-300 px-3 py-2">
          <option value="">Alle statuser</option>
          <option value="tilgjengelig">Tilgjengelig</option>
          <option value="opptatt">Opptatt</option>
          <option value="på_service">På service</option>
          <option value="ute_av_drift">Ute av drift</option>
        </select>
        <select name="department" defaultValue={searchParams.department} className="rounded border border-slate-300 px-3 py-2">
          <option value="">Alle avdelinger</option>
          {departments.map((department) => (
            <option key={department.id} value={department.name}>
              {department.name}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded bg-kommune-blue px-3 py-2 text-white">Filtrer</button>
      </form>

      <section className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-4 py-3">Maskin</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Avdeling</th>
              <th className="px-4 py-3">Lokasjon</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {machines.map(({ machine, departmentName }) => (
              <tr key={machine.id}>
                <td className="px-4 py-3">
                  <Link className="font-medium text-kommune-blue underline-offset-4 hover:underline" href={`/machines/${machine.id}`}>
                    {machine.name}
                  </Link>
                </td>
                <td className="px-4 py-3">{machine.type}</td>
                <td className="px-4 py-3">{departmentName}</td>
                <td className="px-4 py-3">{machine.location}</td>
                <td className="px-4 py-3"><StatusBadge type="machine" status={machine.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
