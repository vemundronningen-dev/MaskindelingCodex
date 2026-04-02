'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from './db';
import { departments, machineRequests, machines } from './schema';
import { login, logout, requireAdmin, requireAuth } from './auth';
import { loginSchema, machineRequestSchema, updateRequestStatusSchema } from './validators';

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password')
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Ugyldig innlogging.' };
  }

  const user = await login(parsed.data.email, parsed.data.password);
  if (!user) {
    return { error: 'Feil brukernavn eller passord.' };
  }

  redirect('/dashboard');
}

export async function logoutAction() {
  await logout();
  redirect('/login');
}

export async function createMachineRequestAction(formData: FormData) {
  const user = await requireAuth();
  const parsed = machineRequestSchema.safeParse({
    machineId: formData.get('machineId'),
    message: formData.get('message')
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Kunne ikke sende forespørsel.' };
  }

  const [machine] = await db.select().from(machines).where(eq(machines.id, parsed.data.machineId));
  if (!machine) {
    return { error: 'Maskin ble ikke funnet.' };
  }

  await db.insert(machineRequests).values({
    machineId: machine.id,
    requestedByUserId: user.id,
    fromDepartmentId: user.departmentId,
    toDepartmentId: machine.departmentId,
    message: parsed.data.message,
    status: 'sendt'
  });

  revalidatePath('/machines');
  revalidatePath(`/machines/${machine.id}`);
  revalidatePath('/dashboard');
  return { success: 'Forespørsel sendt.' };
}

export async function updateRequestStatusAction(formData: FormData) {
  await requireAdmin();
  const parsed = updateRequestStatusSchema.safeParse({
    requestId: formData.get('requestId'),
    status: formData.get('status')
  });

  if (!parsed.success) {
    return { error: 'Ugyldig statusoppdatering.' };
  }

  await db.update(machineRequests).set({ status: parsed.data.status }).where(eq(machineRequests.id, parsed.data.requestId));
  revalidatePath('/admin');
  revalidatePath('/dashboard');
  return { success: 'Status oppdatert.' };
}

export async function fetchDashboardStats() {
  await requireAuth();
  const allMachines = await db.select().from(machines);
  const allRequests = await db.select().from(machineRequests);

  return {
    totalMachines: allMachines.length,
    availableMachines: allMachines.filter((m) => m.status === 'tilgjengelig').length,
    activeRequests: allRequests.filter((r) => r.status === 'sendt').length,
    approvedRequests: allRequests.filter((r) => r.status === 'godkjent').length
  };
}

export async function fetchMachineList(filters: { search?: string; status?: string; department?: string }) {
  await requireAuth();
  const rows = await db
    .select({ machine: machines, departmentName: departments.name })
    .from(machines)
    .innerJoin(departments, eq(machines.departmentId, departments.id));

  return rows.filter((row) => {
    const text = `${row.machine.name} ${row.machine.type} ${row.machine.brand} ${row.machine.model}`.toLowerCase();
    const searchMatch = filters.search ? text.includes(filters.search.toLowerCase()) : true;
    const statusMatch = filters.status ? row.machine.status === filters.status : true;
    const departmentMatch = filters.department ? row.departmentName === filters.department : true;
    return searchMatch && statusMatch && departmentMatch;
  });
}

export async function fetchDepartments() {
  await requireAuth();
  return db.select().from(departments);
}
