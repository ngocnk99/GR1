import HttpStatus from 'http-status-codes';
import PrettyError from 'pretty-error';
import logger from '../utils/logger';
import buildError from '../utils/buildError';
/**
 * Error response middleware for 404 not found.
 *
 * @param {Object} req
 * @param {Object} res
 */
export function notFound(req, res) {
  // res.status(HttpStatus.NOT_FOUND).json({
  res.status(202).json({
    error: {
      code: HttpStatus.NOT_FOUND,
      // message: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
      message: 'Yêu cầu bạn gửi không tồn tại'
    }
  });
}

/**
 * Method not allowed error middleware. This middleware should be placed at
 * the very bottom of the middleware stack.
 *
 * @param {Object} req
 * @param {Object} res
 */
export function methodNotAllowed(req, res) {
  // res.status(HttpStatus.METHOD_NOT_ALLOWED).json({
  res.status(202).json({
    success: false,
    error: {
      code: HttpStatus.METHOD_NOT_ALLOWED,
      // message: HttpStatus.getStatusText(HttpStatus.METHOD_NOT_ALLOWED)
      message: 'Yêu cầu bạn gửi không được hỗ trợ'
    }
  });
}

/**
 * To handle errors from body parser for cases such as invalid JSON sent through
 * the body (https://github.com/expressjs/body-parser#errors).
 *
 * @param  {Object}   err
 * @param  {Object}   req
 * @param  {Object}   res
 * @param  {Function} next
 */
export function bodyParser(err, req, res, next) {
  logger.error(err.message);

  // res.status(err.status).json({
  res.status(202).json({
    success: false,
    error: {
      code: err.status,
      // message: HttpStatus.getStatusText(err.status)
      message: 'Yêu cầu bạn gửi không được hỗ trợ'
    }
  });
}

const pe = new PrettyError();

pe.skipNodeFiles();
pe.skipPackage('express');
pe.withoutColors();

/**
 * Generic error response middleware for validation and internal server errors.
 *
 * @param  {Error}   err
 * @param  {Object}   req
 * @param  {Object}   res
 * @param  {Function} next
 */
export async function genericErrorHandler(err, req, res, next) {
  process.stderr.write(pe.render(err));
  logger.error({
    headers: req.headers,
    query: req.query,
    params: req.params,
    body: req.body,
    error: pe.render(err).toString()
  });

  const error = buildError(err);

  console.log("errorHandler: ", error)
  if (err.name === 'UnauthorizedError') {
    res.status(202).json({
      error,
      message: 'Token hết hạn',
      success: false,
      status: 401,
      code: 401
    });
  } else
    res.status(/* error.code ||  */202).json({
      error,
      success: false
    });
}
