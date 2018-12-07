
import { createConnection } from 'typeorm';
import defaultOptions from './connectionOptions';

export default async function establishConnection(options: {logging?: boolean} = {}) {
  return createConnection({
    ...defaultOptions,
    ...options,
  });
}

export async function establishTestConnection(){
  return createConnection({
    name: 'tmpconnect',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'dcastel',
    password: 'root',
    database: 'BANKING',
    entities: ['src/**/**.entity{.ts,.js}'],
    migrations: ['src/**/**.migration{.ts,.js}'],
    cli: {
        migrationsDir: 'src/migrations',
        entitiesDir: 'src/entities',
    },
    synchronize: false,
  });
}