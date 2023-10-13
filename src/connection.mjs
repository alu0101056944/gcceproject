import pg from 'pg-promise';
const pgp = pg();
const db = pgp('postgres://postgres@localhost:5432/your_database');