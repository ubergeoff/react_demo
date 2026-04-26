-- Flight Booking Database initialization
-- Tables are created and managed by TypeORM (synchronize: true).
-- This file only ensures the database exists and sets sensible defaults.

-- Ensure the database is using UTF-8
SET client_encoding = 'UTF8';

-- Create the pgcrypto extension for UUID support if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
