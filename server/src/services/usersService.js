/* eslint-disable camelcase */
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import MODELS from '../models/models';
import CONFIG from '../config';
// import groupUsersModel from '../models/groupUsers';
import models from '../entity/index';
import { md5 } from '../utils/crypto';
// import errorCode from '../utils/errorCode';
import Promise from '../utils/promise';
import * as ApiErrors from '../errors';
import ErrorHelpers from '../helpers/errorHelpers';
import filterHelpers from '../helpers/filterHelpers';
import preCheckHelpers, { TYPE_CHECK } from '../helpers/preCheckHelpers';
import moment from 'moment';
import viMessage from '../locales/vi';

const { users, userGroups, sequelize, userAddress, wards, userTokens } = models;

export default {
  get_list: async param => {
    let finnalyResult;

    try {
      const { filter, range, sort, attributes } = param;
      // console.log(filter);
      let whereFilter = _.omit(filter, 'placesId');
      const perPage = range[1] - range[0] + 1;
      const page = Math.floor(range[0] / perPage);
      const att = filterHelpers.atrributesHelper(attributes, ['password']);

      // try {
      //   whereFilter = filterHelpers.combineFromDateWithToDate(whereFilter);
      // } catch (error) {
      //   throw error;
      // }

      whereFilter = await filterHelpers.makeStringFilterRelatively(
        ['username', 'fullname', 'email', 'mobile', 'address'],
        whereFilter,
        'users'
      );

      console.log('whereFilter: ', whereFilter);

      const result = await Promise.all([
        MODELS.findAndCountAll(users, {
          // subQuery: false,
          where: whereFilter,
          order: sort,
          offset: range[0],
          limit: perPage,
          attributes: att,
          distinct: true,
          include: [{ model: userGroups, as: 'userGroups', required: true, attributes: ['id', 'userGroupName'] }]
        })
      ]).catch(error => {
        ErrorHelpers.errorThrow(error, 'getListError', 'UserServices');
      });

      // console.log(result);

      finnalyResult = {
        rows: result[0].rows,
        count: result[0].count,
        page: page + 1,
        perPage
      };
    } catch (error) {
      // reject(ErrorHelpers.errorReject(error, 'crudError', 'UserServices'))
      ErrorHelpers.errorThrow(error, 'getListError', 'UserServices');
    }

    return finnalyResult;
  },
  get_one: async param => {
    let finnalyResult;

    try {
      // console.log("BloArticle Model param: %o | id: ", param, param.id)
      const { id, attributes } = param;
      const whereFilter = { id };
      const att = filterHelpers.atrributesHelper(attributes, ['password']);
      const result = await MODELS.findOne(users, {
        where: whereFilter,
        attributes: att,
        include: [{ model: userGroups, as: 'userGroups', attributes: ['id', 'userGroupName'] }]
      }).catch(error => {
        ErrorHelpers.errorThrow(error, 'getInfoError', 'UserServices');
      });

      finnalyResult = result;
      if (!finnalyResult) {
        throw new ApiErrors.BaseError({
          statusCode: 202,
          type: 'crudNotExisted'
        });
      }
    } catch (error) {
      // console.log("error: ", error)
      ErrorHelpers.errorThrow(error, 'getInfoError', 'UserServices');
    }

    return finnalyResult;
  },
  find_one: param =>
    new Promise((resolve, reject) => {
      try {
        MODELS.findOne(users, {
          where: {
            username: param.userName
          },
          include: [
            {
              model: userGroups,
              as: 'userGroups',
              attributes: ['id', 'userGroupName']
            },
            {
              model: userAddress,
              as: 'userAddress'
            }
          ],
          logging: true
        })
          .then(result => {
            resolve(result);
          })
          .catch(error => {
            reject(ErrorHelpers.errorReject(error, 'crudError', 'UserServices'));
          });
      } catch (error) {
        reject(ErrorHelpers.errorReject(error, 'crudError', 'UserServices'));
      }
    }),
  find: param =>
    new Promise((resolve, reject) => {
      try {
        MODELS.findOne(users, {
          where: param,
          attributes: {
            // include: [],
            exclude: ['password']
          },
          include: [
            {
              model: userGroups,
              as: 'userGroups',
              attributes: ['id', 'userGroupName']
            }
          ]
        })
          .then(result => {
            resolve(result);
          })
          .catch(error => {
            reject(ErrorHelpers.errorReject(error, 'crudError', 'UserServices'));
          });
      } catch (error) {
        reject(ErrorHelpers.errorReject(error, 'crudError', 'UserServices'));
      }
    }),
  create: async param => {
    let finnalyResult;

    try {
      let { entity } = param;

      // console.log('User create: ', entity);

      const whereFilter = {
        username: entity.username
      };
      const whereFilterMobile = {
        mobile: entity.mobile || ''
      };
      // whereFilter = await filterHelpers.makeStringFilterAbsolutely(['name'], whereFilter, 'users');

      const infoArr = Array.from(
        await Promise.all([
          preCheckHelpers.createPromiseCheckNew(
            MODELS.findOne(users, {
              where: whereFilter
            }),
            entity.username ? true : false,
            TYPE_CHECK.CHECK_DUPLICATE,
            { parent: 'api.users.username' }
          ),
          preCheckHelpers.createPromiseCheckNew(
            MODELS.findOne(users, {
              where: whereFilterMobile
            }),
            entity.mobile ? true : false,
            TYPE_CHECK.CHECK_DUPLICATE,
            { parent: 'api.users.mobile' }
          )
        ])
      );

      if (!preCheckHelpers.check(infoArr)) {
        throw new ApiErrors.BaseError({
          statusCode: 202,
          type: 'getInfoError',
          message: 'Không xác thực được thông tin gửi lên'
        });
      }

      const passMd5 = md5(entity.password);

      entity = Object.assign(param.entity, { password: passMd5 });

      // console.log('entity ', entity);
      finnalyResult = await MODELS.create(users, entity).catch(err => {
        // console.log('create user err: ', err);
        throw err;
      });

      if (!finnalyResult) {
        throw new ApiErrors.BaseError({ statusCode: 202, message: 'Tạo mới thất bại' });
      }
    } catch (error) {
      ErrorHelpers.errorThrow(error, 'crudError', 'UserServices');
    }

    return { result: finnalyResult, status: 1 };
  },
  changePass: param =>
    new Promise((resolve, reject) => {
      try {
        console.log('changePass param: ', param);
        let newPassMd5;
        let { entity } = param;

        if (entity.NewPassWord === undefined || entity.NewPassWord === '') {
          reject({ status: 0, message: 'Mật khẩu mới không hợp lệ' });
        }
        if (
          entity.channel === 'normal' &&
          entity.UserChanged > 1 &&
          (entity.OldPassWord === undefined || entity.OldPassWord === '')
        ) {
          reject({ status: 0, message: 'Mật khẩu cũ không hợp lệ' });
        }
        if (
          entity.OldPassWord !== undefined &&
          entity.NewPassWord !== undefined &&
          entity.NewPassWord === entity.OldPassWord
        ) {
          reject({ status: 0, message: 'Mật khẩu mới giống mật khẩu cũ' });
        }

        const oldPassMd5 = md5(entity.OldPassWord);
        // const whereFiter = entity.channel !== "normal" && entity.UserChanged < 1 ? { id: param.id } : { id: param.id,password: oldPassMd5 };
        const whereFiter = { id: param.id, password: oldPassMd5 };

        console.log('whereFiter: ', whereFiter);
        MODELS.findOne(users, { where: whereFiter })
          .then(findUser => {
            if (findUser) {
              newPassMd5 = md5(entity.NewPassWord);
              entity = Object.assign(param.entity, { password: newPassMd5 });
              MODELS.update(users, entity, {
                where: { id: Number(param.id) }
                // fields: ['password']
              })
                .then(rowsUpdate => {
                  console.log('rowsUpdate: ', rowsUpdate);
                  // usersModel.findById(param.id).then(result => {

                  // })
                  if (rowsUpdate[0] > 0) {
                    resolve({ status: 1, message: 'Thành Công' });
                  } else {
                    reject({ status: 0, message: 'Thay đổi thất bại' });
                  }
                })
                .catch(error => {
                  reject(ErrorHelpers.errorReject(error, 'crudError', 'UserServices'));
                });
            } else {
              console.log('not found user');
              reject({ status: 0, message: 'Mật khẩu cũ không đúng.' });
            }
          })
          .catch(error => {
            reject(ErrorHelpers.errorReject(error, 'crudError', 'UserServices'));
          });
      } catch (error) {
        console.log('error changepass:', error);
        reject({ status: 0, message: 'Lỗi cơ sở dữ liệu' });
      }
    }),
  changePassByOtp: async param => {
    let finnalyResult;

    try {
      const { password, otp, usersId } = param;

      const foundUserToken = await MODELS.findOne(userTokens, {
        where: {
          usersId: usersId,
          userTokenCode: otp,
          dateExpired: {
            $gt: new Date()
          }
        }
      });

      if (foundUserToken) {
        const foundUser = await MODELS.findOne(users, {
          where: {
            id: usersId
          }
        });

        if (foundUser) {
          const newPass = md5(password);

          if (foundUser.password == newPass) {
            throw new ApiErrors.BaseError({
              statusCode: 202,
              message: 'Mật khẩu  mới giống mật khẩu cũ'
            });
          } else {
            await MODELS.update(users, { password: newPass }, { where: { id: usersId } }).catch(error => {
              throw new ApiErrors.BaseError({
                statusCode: 202,
                type: 'crudInfo',
                error
              });
            });
            await MODELS.destroy(userTokens, { where: { usersId: usersId } }).catch(error => {
              throw new ApiErrors.BaseError({
                statusCode: 202,
                type: 'crudInfo',
                error
              });
            });

            finnalyResult = await MODELS.findOne(users, {
              where: { id: usersId },
              attributes: ['id', 'username', 'image', 'fullname', 'mobile', 'userGroupsId', 'password', 'email']
            }).catch(err => {
              throw err;
            });
          }
        } else {
          throw new ApiErrors.BaseError({
            statusCode: 202,
            message: 'crudNotExisted'
          });
        }

        if (!finnalyResult) {
          throw new ApiErrors.BaseError({
            statusCode: 202,
            type: 'crudInfo'
          });
        }
      } else {
        throw new ApiErrors.BaseError({
          statusCode: 202,
          message: 'Mã Otp không hợp lệ'
        });
      }
    } catch (error) {
      ErrorHelpers.errorThrow(error, 'crudError', 'UserServices');
    }

    return { status: 1, result: finnalyResult };
  },
  accessOtp: async param => {
    let finnalyResult;

    try {
      const { otp, usersId } = param;

      const foundUserToken = await MODELS.findOne(userTokens, {
        where: {
          usersId: usersId,
          userTokenCode: otp,
          dateExpired: {
            $gt: new Date()
          }
        }
      });

      if (foundUserToken) {
        finnalyResult = foundUserToken;
      } else {
        throw new ApiErrors.BaseError({
          statusCode: 202,
          message: 'Mã Otp không hợp lệ'
        });
      }
    } catch (error) {
      ErrorHelpers.errorThrow(error, 'crudError', 'UserServices');
    }

    return { status: 1, result: finnalyResult };
  },
  resetPass: param =>
    new Promise(resolve => {
      try {
        console.log('param: ', param);
        let { entity } = param;

        if (entity.password === undefined || entity.password === '') {
          resolve({ status: 0, message: 'Mạt khẩu không hợp lệ!' });
        }
        const passMd5 = md5(entity.password);

        console.log('md5: ', passMd5);
        entity = Object.assign({}, { password: passMd5 });
        MODELS.update(users, entity, {
          where: { id: Number(param.id) }
          // fields: ['password']
        })
          .then(rowsUpdate => {
            console.log('rowsUpdate: ', rowsUpdate);
            if (rowsUpdate[0] > 0) {
              MODELS.findOne(users, { where: { id: param.id } }).then(resultUser => {
                if (resultUser) {
                  sendEmailService.sendGmail({
                    emailTo: resultUser.dataValues.email,
                    subject: 'HỆ THỐNG CHOSO.VN - THÔNG BÁO ĐỔI MẬT KHẨU',
                    sendTypeMail: 'html',
                    body: 'Chào bạn, Mật khẩu mới của bạn là ' + entity.password
                  });
                }
              });

              resolve({ status: 1, message: 'Thành Công' });
            } else {
              resolve({ status: 0, message: 'Mật khẩu cũ giống mật khẩu mới' });
            }
          })
          .catch(err => {
            console.log('create user err: ', err);
            resolve({ status: -2, message: err.errors.message });
          });
      } catch (error) {
        resolve({ status: -1, message: `Lỗi cơ sở dữ liệu: ${error}` });
      }
    }),
  requestForgetPass: param =>
    new Promise(async (resolve, reject) => {
      let result;

      try {
        console.log('param: ', param);

        const objectUser = await MODELS.findOne(users, {
          where: { email: param.email }
        });

        if (objectUser) {
          // console.log('objectUser.dataValues.status==', objectUser.dataValues.status);
          if (
            objectUser.dataValues &&
            (Number(objectUser.dataValues.status) === -1 || Number(objectUser.dataValues.status) === 0)
          ) {
            reject(
              new ApiErrors.BaseError({
                statusCode: 202,
                type: 'crudNotExisted',
                message: viMessage['api.users.notexists.status']
              })
            );
          } else {
            const usercode = Math.floor(1000 + Math.random() * 9000);
            console.log('usercode', usercode);
            const userToken = await MODELS.create(userTokens, {
              userTokenCode: usercode,
              usersId: objectUser.id,
              dateExpired: moment(new Date()).add(1, 'days')
            }).catch(err => {
              // console.log('create user err: ', err);
              throw err;
            });
          }
        } else {
          reject(
            new ApiErrors.BaseError({
              statusCode: 202,
              type: 'crudNotExisted',
              message: viMessage['api.users.notexists.email']
            })
          );
          // result = {sucess:false}
        }
      } catch (error) {
        reject(
          new ApiErrors.BaseError({
            statusCode: 202,
            type: 'ERRORS',
            message: error
          })
        );
      }
    }),
  loginByEmail: param =>
    new Promise(async (resolve, reject) => {
      try {
        console.log('param: ', param);
        let result;

        const dataVerifyToken = jwt.verify(param.token, CONFIG.JWT_SECRET);
        console.log('dataVerifyToken: ', dataVerifyToken);

        if (param.email === dataVerifyToken.email && dataVerifyToken.token === CONFIG['JWT_SECRET']) {
          await MODELS.findOne(users, { where: { email: param.email } }).then(user => {
            const dataToken = { user: user.username, userId: user.id };
            const token = jwt.sign(
              {
                ...dataToken
              },
              process.env.JWT_SECRET,
              {
                expiresIn: `${CONFIG.TOKEN_LOGIN_EXPIRE}`
                // algorithm: 'RS256'
              }
            );
            // role = [...userInfo.RoleDetails];
            // console.log("token", token)

            if (token) {
              result = { success: false, token: token };
              resolve(result);
            } else {
              reject(
                new ApiErrors.BaseError({
                  statusCode: 202,
                  type: 'crudNotExisted',
                  message: viMessage['api.users.notexists.email']
                })
              );
            }
          });
        } else {
          reject(
            new ApiErrors.BaseError({
              statusCode: 202,
              type: 'crudNotExisted',
              message: viMessage['api.users.notexists.email']
            })
          );
        }
      } catch (error) {
        reject(
          new ApiErrors.BaseError({
            statusCode: 202,
            type: 'crudNotExisted'
          })
        );
      }
    }),
  loginWithSocical: param =>
    new Promise(async (resolve, reject) => {
      try {
        console.log('param: ', param);
        let result;
        let objectusers;
        const dataVerifyToken = jwt.verify(param.token, CONFIG.JWT_SECRET);
        console.log('dataVerifyToken: ', dataVerifyToken);

        if (
          param.referralSocial === dataVerifyToken.referralSocial &&
          param.idSocial === dataVerifyToken.idSocial &&
          dataVerifyToken.token === CONFIG['JWT_SECRET']
        ) {
          console.log('vao login id social');
          const wherefilter = {
            referralSocial: param.referralSocial,
            idSocial: param.idSocial
          };

          objectusers = await MODELS.findOne(users, { where: wherefilter });
        }

        if (!objectusers && param.email === dataVerifyToken.email && dataVerifyToken.token === CONFIG['JWT_SECRET']) {
          console.log('vao login email');
          objectusers = await MODELS.findOne(users, { where: { email: param.email } });
        }

        if (objectusers) {
          const dataToken = {
            user: objectusers.username,
            userId: objectusers.id,
            userGroupsId: objectusers.userGroupsId
          };
          const token = jwt.sign(
            {
              ...dataToken
            },
            process.env.JWT_SECRET,
            {
              expiresIn: `${CONFIG.TOKEN_LOGIN_EXPIRE}`
              // algorithm: 'RS256'
            }
          );

          if (token) {
            result = { success: true, token: token };
            resolve(result);
          } else {
            reject(
              new ApiErrors.BaseError({
                statusCode: 202,
                type: 'crudNotExisted',
                message: viMessage['api.users.notexists.social']
              })
            );
          }
        } else {
          console.log('user ko tồn tại');
          reject(
            new ApiErrors.BaseError({
              statusCode: 202,
              type: 'crudNotExisted',
              message: viMessage['api.users.notexists']
            })
          );
        }
      } catch (error) {
        reject(
          new ApiErrors.BaseError({
            statusCode: 202,
            type: 'crudNotExisted'
          })
        );
      }
    }),
  getByUserGroups: async param => {
    let finnalyResult;

    try {
      const { filter, range, sort, attributes, auth } = param;
      const perPage = range[1] - range[0] + 1;
      const page = Math.floor(range[0] / perPage) + 1;

      console.log(JSON.stringify(filter));
      let result = await sequelize.query(
        'call sp_users_byUserGroups(:in_fullName,:in_pageIndex, :in_pageSize,:in_userGroupsId, :in_locations,:in_orderby,@out_rowCount);select @out_rowCount;',
        {
          replacements: {
            in_fullName: filter.fullName || '',
            in_pageIndex: page,
            in_pageSize: perPage,
            in_userGroupsId: filter.userGroupsId ? filter.userGroupsId : 0,
            in_locations: filter.locations ? JSON.stringify(filter.locations) : '[]',
            in_orderby: sort || 'id desc'
          },
          type: sequelize.QueryTypes.SELECT
        }
      );

      console.log('result===', result);
      const rows = Object.values(result[0]);

      result = result.map(e => e['0']);

      // console.log("rows===",rows)
      const outOutput = result[2]['@out_rowCount'];
      // console.log("outOutput===",outOutput)

      console.log('result2===', result);
      finnalyResult = {
        result: rows,
        page,
        perPage,
        count: outOutput
      };
    } catch (err) {
      ErrorHelpers.errorThrow(err, 'getListError', 'ecommerceProductService');
    }

    return finnalyResult;
  }
};
