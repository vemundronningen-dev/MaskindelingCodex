CREATE TABLE IF NOT EXISTS organizations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'bruker',
  organization_id INTEGER NOT NULL REFERENCES organizations(id),
  department_id INTEGER NOT NULL REFERENCES departments(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT users_role_check CHECK (role IN ('bruker', 'admin'))
);

CREATE TABLE IF NOT EXISTS machines (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  organization_id INTEGER NOT NULL REFERENCES organizations(id),
  department_id INTEGER NOT NULL REFERENCES departments(id),
  location TEXT NOT NULL,
  status TEXT NOT NULL,
  available_from TIMESTAMP NULL,
  available_to TIMESTAMP NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT machine_status_check CHECK (status IN ('tilgjengelig', 'opptatt', 'på_service', 'ute_av_drift'))
);

CREATE TABLE IF NOT EXISTS machine_requests (
  id SERIAL PRIMARY KEY,
  machine_id INTEGER NOT NULL REFERENCES machines(id),
  requested_by_user_id INTEGER NOT NULL REFERENCES users(id),
  from_department_id INTEGER NOT NULL REFERENCES departments(id),
  to_department_id INTEGER NOT NULL REFERENCES departments(id),
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sendt',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT request_status_check CHECK (status IN ('sendt', 'godkjent', 'avslått'))
);
