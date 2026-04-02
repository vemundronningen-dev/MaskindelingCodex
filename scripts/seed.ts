import bcrypt from 'bcryptjs';
import { db } from '../src/lib/db';
import { departments, machineRequests, machines, organizations, users } from '../src/lib/schema';

async function main() {
  await db.delete(machineRequests);
  await db.delete(machines);
  await db.delete(users);
  await db.delete(departments);
  await db.delete(organizations);

  const [org] = await db.insert(organizations).values({ name: 'Oslo kommune' }).returning();

  const [kirkelig, vann, bymiljo] = await db
    .insert(departments)
    .values([
      { name: 'Kirkelig fellesråd', organizationId: org.id },
      { name: 'Vann- og avløpsetaten', organizationId: org.id },
      { name: 'Bymiljøetaten', organizationId: org.id }
    ])
    .returning();

  const passwordHash = await bcrypt.hash('Passord123!', 10);

  const [adminUser, vannUser] = await db
    .insert(users)
    .values([
      {
        name: 'Admin Bruker',
        email: 'admin@oslo.kommune.no',
        passwordHash,
        role: 'admin',
        organizationId: org.id,
        departmentId: kirkelig.id
      },
      {
        name: 'Ola Saksbehandler',
        email: 'ola@oslo.kommune.no',
        passwordHash,
        role: 'bruker',
        organizationId: org.id,
        departmentId: vann.id
      }
    ])
    .returning();

  const insertedMachines = await db
    .insert(machines)
    .values([
      {
        name: 'Minigraver Kubota U27',
        type: 'Minigraver',
        brand: 'Kubota',
        model: 'U27',
        organizationId: org.id,
        departmentId: kirkelig.id,
        location: 'Oslo, Gravlundsveien 3',
        status: 'tilgjengelig',
        availableFrom: new Date(),
        availableTo: null,
        contactName: 'Kari Hansen',
        contactEmail: 'kari.hansen@oslo.kommune.no',
        contactPhone: '900 11 111',
        notes: 'Nylig servet, klar til bruk.'
      },
      {
        name: 'Minigraver Yanmar SV26',
        type: 'Minigraver',
        brand: 'Yanmar',
        model: 'SV26',
        organizationId: org.id,
        departmentId: bymiljo.id,
        location: 'Oslo, Økern driftsbase',
        status: 'opptatt',
        availableFrom: null,
        availableTo: null,
        contactName: 'Per Olsen',
        contactEmail: 'per.olsen@oslo.kommune.no',
        contactPhone: '900 22 222',
        notes: 'I bruk til grøntprosjekt.'
      },
      {
        name: 'Vibroplate Wacker Neuson',
        type: 'Komprimering',
        brand: 'Wacker Neuson',
        model: 'DPU4545',
        organizationId: org.id,
        departmentId: vann.id,
        location: 'Oslo, Alna lager',
        status: 'tilgjengelig',
        availableFrom: new Date(),
        availableTo: null,
        contactName: 'Lise Berg',
        contactEmail: 'lise.berg@oslo.kommune.no',
        contactPhone: '900 33 333',
        notes: 'Kan hentes etter avtale.'
      },
      {
        name: 'Generator Honda',
        type: 'Generator',
        brand: 'Honda',
        model: 'EU70is',
        organizationId: org.id,
        departmentId: vann.id,
        location: 'Oslo, Vannverkets depot',
        status: 'på_service',
        availableFrom: null,
        availableTo: null,
        contactName: 'Mona Dahl',
        contactEmail: 'mona.dahl@oslo.kommune.no',
        contactPhone: '900 44 444',
        notes: 'Forventes tilbake neste uke.'
      },
      {
        name: 'Hjullaster Volvo L30',
        type: 'Hjullaster',
        brand: 'Volvo',
        model: 'L30',
        organizationId: org.id,
        departmentId: bymiljo.id,
        location: 'Oslo, Haraldrud',
        status: 'ute_av_drift',
        availableFrom: null,
        availableTo: null,
        contactName: 'Rune Nilsen',
        contactEmail: 'rune.nilsen@oslo.kommune.no',
        contactPhone: '900 55 555',
        notes: 'Venter på reservedel.'
      }
    ])
    .returning();

  await db.insert(machineRequests).values({
    machineId: insertedMachines[0].id,
    requestedByUserId: vannUser.id,
    fromDepartmentId: vann.id,
    toDepartmentId: kirkelig.id,
    message: 'Ønsker å låne minigraver i 3 dager til ledningsarbeid.',
    status: 'sendt'
  });

  console.log('Seed fullført.');
  console.log('Innlogging: admin@oslo.kommune.no / Passord123!');
  console.log('Innlogging: ola@oslo.kommune.no / Passord123!');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
