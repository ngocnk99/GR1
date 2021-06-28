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

import compression from 'compression';
import expressJwt from 'express-jwt';
import authenticateRoutes from './routes/authenticateRoutes';
import routes from './routes';
import webRouter from './webRouter';
import json from './middlewares/json';
import logger, { logStream } from './utils/logger';
import * as errorHandler from './middlewares/errorHandler';

console.log('ROOT_DIR: ', process.cwd());

const app = express();

const APP_PORT =
  (process.env.NODE_ENV === 'test' ? process.env.TEST_APP_PORT : process.env.WEB_PORT) || process.env.PORT || '3000';
const APP_HOST = process.env.APP_HOST || '0.0.0.0';

const pathToSwaggerUi = require('swagger-ui-dist').absolutePath();

app.set('port', APP_PORT);
app.set('host', APP_HOST);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.locals.title = process.env.WEB_NAME;
app.locals.version = process.env.APP_VERSION || '1.0.0';

app.use(favicon(path.join(__dirname, '/../public', 'favicon.ico')));
app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS',
    allowedHeaders: [
      'Content-Type',
      'Cache-Control',
      'X-Requested-With',
      'X-Auth-Key',
      'X-Auth-Email',
      'authorization',
      'username',
      'token'
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 3600
  })
);

app.use(helmet());
app.use(compression());
app.use(morgan('short', { stream: logStream }));
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(errorHandler.bodyParser);
app.use(json);
app.use('/web', webRouter);
app.get('/socket', (req, res) => {
  res.render('socket.ejs');
});

const swaggerIndexContent = fs
  .readFileSync(`${pathToSwaggerUi}/index.html`)
  .toString()
  .replace('https://petstore.swagger.io/v2/swagger.json', '/api/swagger.json');

app.get('/api-docs/index.html', (req, res) => res.send(swaggerIndexContent));
app.get('/api-docs', (req, res) => res.redirect('/api-docs/index.html'));
app.use('/api-docs', express.static(pathToSwaggerUi));

app.use(
  expressJwt({
    secret: process.env.JWT_SECRET,
    requestProperty: 'auth',
    credentialsRequired: false,
    // eslint-disable-next-line require-jsdoc
    getToken: function fromHeaderOrQuerystring(req) {
      if (req.headers['x-auth-key']) {
        return req.headers['x-auth-key'];
      }
      if (req.query && req.query.token) {
        return req.query.token;
      }

      return null;
    }
  }).unless({ path: ['/authenticate'] })
);

app.all(`/api/c/*`, (req, res, next) => {
  // console.log("path: ", req.path.split('/api/c/images/').length)
  if (!req.auth && req.path.split('/api/c/images/').length <= 1) {
    const err = new Error('Not Authorized');

    err.code = 202;
    err.status = 401;
    err.message = 'Bạn chưa đăng nhập';
    throw err;
    // res.send({ result: null, status: false, message: err.message })
  }
  next();
});

app.get('/', (req, res) => {
  console.log('req path: ', req.path);
  if (req.path === '/') {
    res.send(process.env.WEB_NAME);
  }
});

app.use('/authenticate', authenticateRoutes);

// API Routes
app.use('/api', routes);

// Error Middlewares
app.use(errorHandler.genericErrorHandler);
app.use(errorHandler.methodNotAllowed);

// if (process.env.NODE_TARGET !== 'build') {
// if (require.main === module) {
app.listen(app.get('port'), app.get('host'), () => {
  logger.info(`Server started at http://${app.get('host')}:${app.get('port')}/api`);
});
// }

// Catch unhandled rejections
process.on('unhandledRejection', err => {
  console.log('@unhandledRejection', err);
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
  console.log('@uncaughtException', err);
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
