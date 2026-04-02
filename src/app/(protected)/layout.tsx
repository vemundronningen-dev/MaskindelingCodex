import { requireAuth } from '@/lib/auth';
import { TopNav } from '@/components/top-nav';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth();

  return (
    <div className="min-h-screen">
      <TopNav name={user.name} role={user.role} />
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
