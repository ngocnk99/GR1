import path from 'path';
import dotenv from 'dotenv';
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });
} else {
  dotenv.config();
}

const config = { ...process.env };

// init type config
config.sql = {};
config.web = {};
config.sqlSms = {};
config.sql.pool = {};
config.rethinkdb = {};

// sql
config.sql.port = process.env.SQL_PORT;
config.sql.user = process.env.SQL_USER;
config.sql.password = process.env.SQL_PASSWORD;
config.sql.server = process.env.SQL_SERVER;
config.sql.database = process.env.SQL_DATABASE;
config.sqlSms.user = process.env.SQL_SMS_USER;
config.sqlSms.password = process.env.SQL_SMS_PASSWORD;
config.sqlSms.database = process.env.SQL_SMS_DATABASE;
config.sql.pool.max = 50;
config.sql.pool.min = 0;
config.sql.pool.idleTimeoutMillis = 1000000;
config.sql.connectionTimeout = 1000000;

export default config;
