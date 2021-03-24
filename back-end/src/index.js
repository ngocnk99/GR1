import './env';
import './db';

import fs from 'fs-extra';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';
import compression from 'compression';;

import routes from './routes';
// import webRouter from './webRouter';
import json from './middlewares/json';
import logger, { logStream } from './utils/logger';
import * as errorHandler from './middlewares/errorHandler';
// import morgan from './utils/morgan';

console.log("ROOT_DIR: ", process.cwd())

// Add this to the VERY top of the first file loaded in your app
/* const apm = require('elastic-apm-node').start({
  // Override service name from package.json
  // Allowed characters: a-z, A-Z, 0-9, -, _, and space
  serviceName: process.env.ELASTIC_APM_SERVICE_NAME,

  // Use if APM Server requires a token
  secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,

  // Set custom APM Server URL (default: http://localhost:8200)
  serverUrl: process.env.ELASTIC_APM_SERVER_URL,
  // logger: logger
  // active: process.env.NODE_ENV === 'production'
}) */

// Initialize Sentry
// https://docs.sentry.io/platforms/node/express/
// Sentry.init({ dsn: process.env.SENTRY_DSN });

// import config from './config';
const app = express();

const APP_PORT =
    (process.env.NODE_ENV === 'test' ? process.env.TEST_APP_PORT : process.env.WEB_PORT) || process.env.PORT || '3000';
const APP_HOST = process.env.APP_HOST || '0.0.0.0';

const pathToSwaggerUi = require('swagger-ui-dist').absolutePath();

app.set('port', APP_PORT);
app.set('host', APP_HOST);

app.locals.title = process.env.WEB_NAME;
app.locals.version = process.env.APP_VERSION || '1.0.0';

// This request handler must be the first middleware on the app
// app.use(Sentry.Handlers.requestHandler());

app.use(express.static('container'));
app.use(favicon(path.join(__dirname, '/../public', 'favicon.ico')));
app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ['Content-Type', 'Cache-Control', 'X-Requested-With', 'X-Auth-Key', 'X-Auth-Email', 'authorization', 'username', 'token'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 3600
}))
app.use(helmet());
app.use(compression());
app.use(morgan('short', { stream: logStream }));
app.use(bodyParser.json());
app.use(errorHandler.bodyParser);
app.use(json);

// app.use('/web', webRouter);

// Swagger UI
// Workaround for changing the default URL in swagger.json
// https://github.com/swagger-api/swagger-ui/issues/4624
const swaggerIndexContent = fs
    .readFileSync(`${pathToSwaggerUi}/index.html`)
    .toString()
    .replace('https://petstore.swagger.io/v2/swagger.json', '/api/swagger.json');

app.get('/api-docs/index.html', (req, res) => res.send(swaggerIndexContent));
app.get('/api-docs', (req, res) => res.redirect('/api-docs/index.html'));
app.use('/api-docs', express.static(pathToSwaggerUi));


/* JWT authentication middleware authenticates */

app.get('/', (req, res) => {
    console.log("req path: ", req.path)
    if (req.path === '/') {
        // res.send(process.env.WEB_NAME);
        res.send('test')
    }
})

app.post('/', (req, res) => {
    console.log("req path: ", req.body)
    if (req.path === '/') {
        // res.send(process.env.WEB_NAME);
        res.send(req.body)
    }
})

// API Routes
app.use('/api', routes);


// Error Middlewares
app.use(errorHandler.genericErrorHandler);
app.use(errorHandler.methodNotAllowed);

// if (process.env.NODE_TARGET !== 'build') {
// if (require.main === module) {
app.listen(app.get('port'), app.get('host'), () => {
    logger.info(`Server started at http://localhost:${app.get('port')}/api`);
});
// }

// Catch unhandled rejections
process.on('unhandledRejection', err => {
    logger.error('Unhandled rejection ', err);

    try {
        // apm.captureError(err);
        // Sentry.captureException(err);
    } catch (err) {
        logger.error('Raven error', err);
    } finally {
        // process.exit(1);
    }
});

// Catch uncaught exceptions
process.on('uncaughtException', err => {
    logger.error('Uncaught exception ', err);

    try {
        // apm.captureError(err)
        // Sentry.captureException(err);
    } catch (err) {
        logger.error('Raven error', err);
    } finally {
        // process.exit(1);
    }
});

export default app;