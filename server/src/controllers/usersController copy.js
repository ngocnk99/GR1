import UserService from '../services/usersService';
import loggerHelpers from '../helpers/loggerHelpers';
import { /* loggerFormat, */ recordStartTime } from '../utils/loggerFormat';
// import { createTemplateUser } from '../utils/helper';
import _ from 'lodash';

const curencyFormat = '#,0;[Red]-#,0';
const tz = 'ASIA/Ho_Chi_Minh';

export default {
  get_list: (req, res, next) => {
    try {
      recordStartTime.call(req);
      const { sort, range, filter, attributes } = res.locals;
      const { userId } = req.auth;

      const whereFilter = filter ? filter : {};

      const param = {
        sort: sort ? sort : ['id', 'asc'],
        range: range ? range : [0, 50],
        filter: whereFilter,
        userId,
        auth: req.auth,
        attributes
      };

      UserService.get_list(param)
        .then(data => {
          const response = {
            result: {
              list: data.rows,
              pagination: {
                current: data.page,
                pageSize: data.perPage,
                total: data.count
              }
            },
            success: true,
            errors: [],
            messages: []
          };

          res.send(response);

          // write log
          recordStartTime.call(res);
          loggerHelpers.logVIEWED(req, res, {
            dataReqBody: req.body,
            dataReqQuery: req.query,
            dataRes: response
          });
        })
        .catch(err => {
          next(err);
        });
      // }
    } catch (error) {
      next(error);
    }
  },
  get_one: (req, res, next) => {
    try {
      recordStartTime.call(req);
      const { id } = req.params;
      const { attributes } = req.query;
      const param = { id, auth: req.auth, attributes };

      // console.log("UserService param: ", param)
      UserService.get_one(param)
        .then(data => {
          // res.header('Content-Range', `articles ${range}/${data.count}`);
          res.send(data);

          recordStartTime.call(res);
          loggerHelpers.logVIEWED(req, res, {
            dataReqBody: req.body,
            dataReqQuery: req.query,
            dataRes: data
          });
        })
        .catch(err => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  },
  find_one: user =>
    new Promise((resovle, reject) => {
      try {
        UserService.find_one(user)
          .then(data => {
            resovle(data);
          })
          .catch(error => {
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    }),
  find: filter =>
    new Promise((resovle, reject) => {
      try {
        UserService.find(filter)
          .then(data => {
            resovle(data);
          })
          .catch(error => {
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    }),
  create: (req, res, next) => {
    try {
      recordStartTime.call(req);
      const entity = res.locals.body;
      const param = { entity };

      UserService.create(param)
        .then(data => {
          if (data && data.status === 1) {
            // res.send(data.result);
            res.send({
              result: data.result,
              success: true,
              errors: [],
              messages: []
            });

            recordStartTime.call(res);
            loggerHelpers.logCreate(req, res, {
              dataReqBody: req.body,
              dataReqQuery: req.query,
              dataRes: {
                result: data.result,
                success: true,
                errors: [],
                messages: []
              }
            });
          } else if (data && data.status === 0) {
            const errMsg = 'Tài khoản này đã tồn tại';

            res.send({ success: false, message: errMsg });

            recordStartTime.call(res);
            loggerHelpers.logError(req, res, {
              dataParam: req.params,
              dataQuery: req.query,
              errMsg
            });
          } else if (data && data.status === -2) {
            // const errMsg = "Bạn phải điền đẩy các trường"
            res.send({ success: false, message: data.message });

            recordStartTime.call(res);
            loggerHelpers.logError(req, res, {
              dataParam: req.params,
              dataQuery: req.query
            });
          } else {
            const errMsg = 'Đã có lỗi xảy ra';

            res.send({ success: false, message: errMsg });

            recordStartTime.call(res);
            loggerHelpers.logError(req, res, {
              dataParam: req.params,
              dataQuery: req.query,
              errMsg
            });
          }
        })
        .catch(err => {
          next(err);
        });
    } catch (err) {
      next(err);
    }
  },
  register: (req, res, next) => {
    try {
      recordStartTime.call(req);
      const entity = res.locals.body;
      const param = { entity };

      UserService.register(param)
        .then(data => {
          if (data && data.status === 1) {
            // res.send(data.result);
            res.send({
              result: data.result,
              success: true,
              errors: [],
              messages: []
            });

            recordStartTime.call(res);
            loggerHelpers.logCreate(req, res, {
              dataReqBody: req.body,
              dataReqQuery: req.query,
              dataRes: {
                result: data.result,
                success: true,
                errors: [],
                messages: []
              }
            });
          } else if (data && data.status === 0) {
            const errMsg = 'Tài khoản này đã tồn tại';

            res.send({ success: false, message: errMsg });

            recordStartTime.call(res);
            loggerHelpers.logError(req, res, {
              dataParam: req.params,
              dataQuery: req.query,
              errMsg
            });
          } else if (data && data.status === -2) {
            // const errMsg = "Bạn phải điền đẩy các trường"
            res.send({ success: false, message: data.message });

            recordStartTime.call(res);
            loggerHelpers.logError(req, res, {
              dataParam: req.params,
              dataQuery: req.query
            });
          } else {
            const errMsg = 'Đã có lỗi xảy ra';

            res.send({ success: false, message: errMsg });

            recordStartTime.call(res);
            loggerHelpers.logError(req, res, {
              dataParam: req.params,
              dataQuery: req.query,
              errMsg
            });
          }
        })
        .catch(err => {
          next(err);
        });
    } catch (err) {
      next(err);
    }
  },
  registerByOtp: (req, res, next) => {
    try {
      recordStartTime.call(req);
      const { otp, usersId } = req.body;
      const param = { otp: otp, usersId: usersId };

      UserService.registerByOtp(param)
        .then(data => {
          if (data && data.status === 1) {
            // res.send(data.result);
            res.send({
              result: data.result,
              success: true,
              errors: [],
              messages: []
            });

            recordStartTime.call(res);
            loggerHelpers.logCreate(req, res, {
              dataReqBody: req.body,
              dataReqQuery: req.query,
              dataRes: {
                result: data.result,
                success: true,
                errors: [],
                messages: []
              }
            });
          } else if (data && data.status === 0) {
            const errMsg = 'Tài khoản này đã tồn tại';

            res.send({ success: false, message: errMsg });

            recordStartTime.call(res);
            loggerHelpers.logError(req, res, {
              dataParam: req.params,
              dataQuery: req.query,
              errMsg
            });
          } else if (data && data.status === -2) {
            // const errMsg = "Bạn phải điền đẩy các trường"
            res.send({ success: false, message: data.message });

            recordStartTime.call(res);
            loggerHelpers.logError(req, res, {
              dataParam: req.params,
              dataQuery: req.query
            });
          } else {
            const errMsg = 'Đã có lỗi xảy ra';

            res.send({ success: false, message: errMsg });

            recordStartTime.call(res);
            loggerHelpers.logError(req, res, {
              dataParam: req.params,
              dataQuery: req.query,
              errMsg
            });
          }
        })
        .catch(err => {
          next(err);
        });
    } catch (err) {
      next(err);
    }
  },
  update: (req, res, next) => {
    try {
      recordStartTime.call(req);
      const { id } = req.params;
      const entity = res.locals.body;
      const param = { id, entity };

      UserService.update(param)
        .then(data => {
          if (data && data.status === 1) {
            // res.send(data.result);
            res.send({
              result: data.result,
              success: true,
              errors: [],
              messages: []
            });

            recordStartTime.call(res);
            loggerHelpers.logUpdate(req, res, {
              dataReqBody: req.body,
              dataReqQuery: req.query,
              dataRes: {
                result: data.result,
                success: true,
                errors: [],
                messages: []
              }
            });
          } else if (data && data.status === 0) {
            const errMsg = 'Tài khoản này đã tồn tại';

            res.send({ success: false, message: errMsg });

            recordStartTime.call(res);
            loggerHelpers.logUpdate(req, res, {
              dataReqBody: req.body,
              dataReqQuery: req.query,
              dataRes: {
                result: data.result,
                success: false,
                errors: [],
                messages: errMsg
              }
            });
          } else if (data && data.status === -2) {
            // const errMsg = "Bạn phải điền đẩy các trường"
            res.send({ success: false, message: data.message });

            recordStartTime.call(res);
            loggerHelpers.logUpdate(req, res, {
              dataReqBody: req.body,
              dataReqQuery: req.query,
              dataRes: {
                result: data.result,
                success: false,
                errors: [],
                messages: data.message
              }
            });
          } else {
            const errMsg = 'Đã có lỗi xảy ra';

            res.send({ success: false, message: errMsg });

            recordStartTime.call(res);
            loggerHelpers.logCreate(req, res, {
              dataReqBody: req.body,
              dataReqQuery: req.query,
              dataRes: {
                success: false,
                errors: [],
                messages: errMsg
              }
            });
          }
        })
        .catch(err => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  },
  update_status: (req, res, next) => {
    try {
      recordStartTime.call(req);
      const { id } = req.params;
      const entity = res.locals.body;
      const param = { id, entity };

      UserService.update_status(param)
        .then(data => {
          if (data && data.status === 1) {
            // res.send(data.result);
            res.send({
              result: data.result,
              success: true,
              errors: [],
              messages: []
            });

            recordStartTime.call(res);
            loggerHelpers.logUpdate(req, res, {
              dataReqBody: req.body,
              dataReqQuery: req.query,
              dataRes: {
                result: data.result,
                success: true,
                errors: [],
                messages: []
              }
            });
          } else if (data && data.status === 0) {
            const errMsg = 'Tài khoản này đã tồn tại';

            res.send({ success: false, message: errMsg });

            recordStartTime.call(res);
            loggerHelpers.logUpdate(req, res, {
              dataReqBody: req.body,
              dataReqQuery: req.query,
              dataRes: {
                result: data.result,
                success: false,
                errors: [],
                messages: errMsg
              }
            });
          } else if (data && data.status === -2) {
            // const errMsg = "Bạn phải điền đẩy các trường"
            res.send({ success: false, message: data.message });

            recordStartTime.call(res);
            loggerHelpers.logUpdate(req, res, {
              dataReqBody: req.body,
              dataReqQuery: req.query,
              dataRes: {
                result: data.result,
                success: true,
                errors: [],
                messages: data.message
              }
            });
          } else {
            const errMsg = 'Đã có lỗi xảy ra';

            res.send({ success: false, message: errMsg });

            recordStartTime.call(res);
            loggerHelpers.logUpdate(req, res, {
              dataReqBody: req.body,
              dataReqQuery: req.query,
              dataRes: {
                result: data.result,
                success: true,
                errors: [],
                messages: errMsg
              }
            });
          }
        })
        .catch(err => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  },
  changePass: (req, res, next) => {
    try {
      recordStartTime.call(req);

      const { id } = req.params;
      const entity = req.body;
      const param = { id, entity };

      UserService.changePass(param)
        .then(data => {
          console.log('changePass dataReturn: ', data);
          res.send(data);

          recordStartTime.call(res);
          loggerHelpers.logUpdate(req, res, {
            dataReqBody: req.body,
            dataReqQuery: req.query,
            dataRes: data
          });
        })
        .catch(err => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  },
  changePassByOtp: (req, res, next) => {
    try {
      recordStartTime.call(req);
      const { otp, usersId, password } = req.body;
      const param = { otp: otp, usersId: usersId, password: password };

      UserService.changePassByOtp(param)
        .then(data => {
          console.log('changePass dataReturn: ', data);
          res.send(data);

          recordStartTime.call(res);
          loggerHelpers.logUpdate(req, res, {
            dataReqBody: req.body,
            dataReqQuery: req.query,
            dataRes: data
          });
        })
        .catch(err => {
          next(err);
        });
    } catch (err) {
      next(err);
    }
  },
  accessOtp: (req, res, next) => {
    try {
      recordStartTime.call(req);
      const { otp, usersId } = req.body;
      const param = { otp: otp, usersId: usersId };

      UserService.accessOtp(param)
        .then(data => {
          console.log('changePass dataReturn: ', data);
          res.send(data);

          recordStartTime.call(res);
          loggerHelpers.logUpdate(req, res, {
            dataReqBody: req.body,
            dataReqQuery: req.query,
            dataRes: data
          });
        })
        .catch(err => {
          next(err);
        });
    } catch (err) {
      next(err);
    }
  },
  resetPass: (req, res, next) => {
    try {
      recordStartTime.call(req);

      const { id } = req.params;
      const entity = req.body;
      const param = { id, entity };

      UserService.resetPass(param)
        .then(data => {
          res.send(data);

          recordStartTime.call(res);
          loggerHelpers.logUpdate(req, res, {
            dataReqBody: req.body,
            dataReqQuery: req.query,
            dataRes: data
          });
        })
        .catch(err => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  },
  requestForgetPass: (req, res, next) => {
    try {
      recordStartTime.call(req);

      const param = req.body;

      UserService.requestForgetPass(param)
        .then(data => {
          res.send(data);

          recordStartTime.call(res);
          loggerHelpers.logUpdate(req, res, {
            dataReqBody: req.body,
            dataReqQuery: req.query,
            dataRes: data
          });
        })
        .catch(err => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  },
  loginByEmail: (req, res, next) => {
    try {
      recordStartTime.call(req);

      const param = res.locals.body;

      UserService.loginByEmail(param)
        .then(data => {
          res.send(data);

          recordStartTime.call(res);
          loggerHelpers.logUpdate(req, res, {
            dataReqBody: res.body,
            dataReqQuery: req.query,
            dataRes: data
          });
        })
        .catch(err => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  },
  loginWithSocical: (req, res, next) => {
    try {
      recordStartTime.call(req);

      const param = res.locals.body;

      UserService.loginWithSocical(param)
        .then(data => {
          res.send(data);

          recordStartTime.call(res);
          loggerHelpers.logUpdate(req, res, {
            dataReqBody: res.body,
            dataReqQuery: req.query,
            dataRes: data
          });
        })
        .catch(err => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  },
  getByUserGroups: (req, res, next) => {
    try {
      recordStartTime.call(req);
      const { sort, range, filter, attributes } = res.locals;
      console.log('res.locals==', JSON.stringify(res.locals));
      const whereFilter = filter ? filter : {};

      const param = {
        sort: sort ? sort : ['id', 'asc'],
        range: range ? range : [0, 50],
        filter: whereFilter,
        auth: req.auth,
        attributes
      };

      UserService.getByUserGroups(param)
        .then(data => {
          const response = {
            result: {
              list: data.result,
              pagination: {
                current: data.page,
                pageSize: data.perPage,
                total: data.count
              }
            },
            success: true,
            errors: [],
            messages: []
          };

          res.send(response);

          // write log
          recordStartTime.call(res);
          loggerHelpers.logVIEWED(req, res, {
            dataReqBody: req.body,
            dataReqQuery: req.query,
            dataRes: response
          });
        })
        .catch(err => {
          next(err);
        });
      // }
    } catch (error) {
      next(error);
    }
  }
};
