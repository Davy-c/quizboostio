import config from '../config';

export default {
    name: 'tmp',
    type: 'postgres' as 'postgres',
    host: config.dbHost,
    port: config.dbPort,
    username: config.dbUser,
    password: config.dbPwd,
    database: config.dbName,
    entities: ['src/**/**.entity{.ts,.js}'],
    migrations: ['src/**/**.migration{.ts,.js}'],
    cli: {
      migrationsDir: 'src/migrations',
      entitiesDir: 'src/entities',
    },
    synchronize: false,
    logging: false,
};