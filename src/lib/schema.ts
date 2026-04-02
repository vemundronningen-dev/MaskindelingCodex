import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const organizations = pgTable('organizations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const departments = pgTable('departments', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').references(() => organizations.id).notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('bruker'),
  organizationId: integer('organization_id').references(() => organizations.id).notNull(),
  departmentId: integer('department_id').references(() => departments.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const machines = pgTable('machines', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  brand: text('brand').notNull(),
  model: text('model').notNull(),
  organizationId: integer('organization_id').references(() => organizations.id).notNull(),
  departmentId: integer('department_id').references(() => departments.id).notNull(),
  location: text('location').notNull(),
  status: text('status').notNull(),
  availableFrom: timestamp('available_from'),
  availableTo: timestamp('available_to'),
  contactName: text('contact_name').notNull(),
  contactEmail: text('contact_email').notNull(),
  contactPhone: text('contact_phone').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const machineRequests = pgTable('machine_requests', {
  id: serial('id').primaryKey(),
  machineId: integer('machine_id').references(() => machines.id).notNull(),
  requestedByUserId: integer('requested_by_user_id').references(() => users.id).notNull(),
  fromDepartmentId: integer('from_department_id').references(() => departments.id).notNull(),
  toDepartmentId: integer('to_department_id').references(() => departments.id).notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('sendt'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});
