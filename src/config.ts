import dotenv = require('dotenv');
dotenv.config();

function getInt(value: any, defaultValue: number) {
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return defaultValue;
    }
    return parsed;
}

export default {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3001,
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: getInt(process.env.DB_PORT, 5432),
    dbUser: process.env.DB_USER || 'postgres',
    dbPwd: process.env.DB_PWD || '',
    dbName: process.env.DB_NAME || 'BANKING',
};
