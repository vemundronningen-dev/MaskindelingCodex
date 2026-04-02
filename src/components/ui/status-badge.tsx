import { machineStatusMap, requestStatusMap } from '@/lib/status';

type Props = {
  type: 'machine' | 'request';
  status: string;
};

export function StatusBadge({ type, status }: Props) {
  const map = type === 'machine' ? machineStatusMap : requestStatusMap;
  const current = map[status] ?? { label: status, className: 'bg-slate-100 text-slate-700' };
  return <span className={`badge ${current.className}`}>{current.label}</span>;
}
