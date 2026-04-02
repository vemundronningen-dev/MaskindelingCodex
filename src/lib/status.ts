export const machineStatusMap: Record<string, { label: string; className: string }> = {
  tilgjengelig: { label: 'Tilgjengelig', className: 'bg-emerald-100 text-emerald-700' },
  opptatt: { label: 'Opptatt', className: 'bg-amber-100 text-amber-700' },
  på_service: { label: 'På service', className: 'bg-blue-100 text-blue-700' },
  ute_av_drift: { label: 'Ute av drift', className: 'bg-rose-100 text-rose-700' }
};

export const requestStatusMap: Record<string, { label: string; className: string }> = {
  sendt: { label: 'Sendt', className: 'bg-slate-100 text-slate-700' },
  godkjent: { label: 'Godkjent', className: 'bg-emerald-100 text-emerald-700' },
  avslått: { label: 'Avslått', className: 'bg-rose-100 text-rose-700' }
};
