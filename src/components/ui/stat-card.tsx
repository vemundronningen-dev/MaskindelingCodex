type Props = {
  title: string;
  value: number;
};

export function StatCard({ title, value }: Props) {
  return (
    <div className="card">
      <p className="text-sm text-slate-600">{title}</p>
      <p className="mt-1 text-3xl font-bold text-kommune-blue">{value}</p>
    </div>
  );
}
