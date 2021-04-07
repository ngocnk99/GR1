/* eslint-disable camelcase */
import _, { findLast } from 'lodash';
import usersModel from '../models/users';

import models from '../entity/index';
import { verifyPasswordMd5, md5 } from '../utils/crypto'
import jwt from 'jsonwebtoken';
import Promise from '../utils/promise';
import * as ApiErrors from '../errors';
import ErrorHelpers from '../helpers/errorHelpers';
import filterHelpers from '../helpers/filterHelpers';
import preCheckHelpers, { TYPE_CHECK } from '../helpers/preCheckHelpers';
import '../env';
const { getUserId } = require('../utils')
const { roles } = models;

export default {
    get_list: async param => {
        let finnalyResult;

        try {
            const { filter, range, sort, auth } = param;
            console.log('get user');
            let whereFilter = filter;
            const perPage = (range[1] - range[0]) + 1
            const page = Math.floor(range[0] / perPage);

            whereFilter = filterHelpers.combineFromDateWithToDate(filter);

            filterHelpers.makeStringFilterRelatively(['username', 'email'], whereFilter);

            if (!whereFilter) {
                whereFilter = {...filter }
            }

            const result = await
            usersModel.findAll({
                where: whereFilter,
                order: [sort],
                offset: range[0],
                limit: perPage,
                attributes: {
                    // include: [],
                    exclude: ['password']
                },
                include: {
                    model: roles,
                    as: "role"
                }
            }).catch(error => {
                ErrorHelpers.errorThrow(error, 'getListError', 'UserServices');
            })


            finnalyResult = {
                rows: result,
                count: result.length,
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
            const { id /*auth*/ } = param;
            const whereFilter = { id };
            const result = await usersModel.findOne({
                where: whereFilter,
                attributes: {
                    // include: [],
                    exclude: ['password']
                },
                include: {
                    model: roles,
                    as: "role"
                }
            }).catch(error => {
                ErrorHelpers.errorThrow(error, 'getInfoError', 'UserServices');
            });

            finnalyResult = result;

        } catch (error) {
            // console.log("error: ", error)
            ErrorHelpers.errorThrow(error, 'getInfoError', 'UserServices');
        }

        return finnalyResult;
    },
    create: async param => {
        let finnalyResult;

        try {
            let { entity } = param;

            console.log("User create: ", entity)

            const infoArr = Array.from(await Promise.all([
                preCheckHelpers.createPromiseCheck(usersModel.findOne, {
                    where: {
                        username: entity.username
                    }
                }, entity.username ? true : false, TYPE_CHECK.CHECK_DUPLICATE, { parent: 'api.users.username' }),
                preCheckHelpers.createPromiseCheck(usersModel.findOne, {
                        where: {
                            email: entity.email,
                        }
                    },
                    entity.email ? true : false, TYPE_CHECK.CHECK_DUPLICATE, { parent: 'api.users.email' }
                ),
            ]));

            if (!preCheckHelpers.check(infoArr)) {
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'getInfoError',
                    message: 'Không xác thực được thông tin gửi lên'
                })
            }

            const passMd5 = md5(entity.password);

            entity = Object.assign(param.entity, { password: passMd5 });

            console.log("entity ", entity)
            finnalyResult = await usersModel.create(entity)
                .catch(err => {
                    console.log("create user err: ", err)
                    throw err;
                });

            if (!finnalyResult) {
                throw new ApiErrors.BaseError({ statusCode: 202, message: "Tạo mới thất bại" });
            }

        } catch (error) {
            ErrorHelpers.errorThrow(error, 'crudError', 'UserServices');
        }

        return { result: finnalyResult, status: 1 };
    },
    update: async param => {
        let finnalyResult;

        try {
            const { entity } = param;
            const { userId } = getUserId(entity.token);
            const foundUser = await usersModel.findOne({
                where: {
                    id: userId
                }
            });

            if (foundUser) {
                await usersModel.update(
                    entity, { where: { id: userId } }
                ).catch(error => {
                    throw (new ApiErrors.BaseError({
                        statusCode: 202,
                        type: 'crudInfo',
                        error,
                    }));
                })

                finnalyResult = await usersModel.findOne({ where: { id: userId } }).catch(err => {
                    throw err;
                });

                if (!finnalyResult) {
                    throw (new ApiErrors.BaseError({
                        statusCode: 202,
                        type: 'crudInfo',
                    }));
                }
            } else {
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'crudNotExisted',
                });
            }
        } catch (error) {
            ErrorHelpers.errorThrow(error, 'crudError', 'UserServices');
        }

        return { status: 1, result: finnalyResult };
    },
    changePass: param => new Promise((resolve, reject) => {
        try {
            console.log("changePass param: ", param)
            let newPassMd5;
            let { entity } = param;
            const auth = param.auth;

            const oldPassMd5 = md5(entity.oldPassword)
            const whereFiter = { id: auth.userId, password: oldPassMd5 };

            if (entity.newPassword === entity.oldPassword) {
                reject({ status: 0, message: "Mật khẩu mới giống mật khẩu cũ" })
            }

            console.log("whereFiter: ", whereFiter)
            usersModel.findOne({ where: whereFiter }).then(findUser => {
                if (findUser) {
                    newPassMd5 = md5(entity.newPassword)
                    entity = Object.assign(param.entity, { password: newPassMd5 })
                    usersModel.update(
                        entity, {
                            // where: { id: Number(param.id) },
                            where: { id: Number(auth.userId) },
                            // fields: ['password']
                        }
                    ).then(rowsUpdate => {
                        console.log("rowsUpdate: ", rowsUpdate)
                            // usersModel.findById(param.id).then(result => {

                        // })
                        if (rowsUpdate[0] > 0) {
                            resolve({ status: 1, message: "Thành Công" })
                        } else {
                            reject({ status: 0, message: "Thay đổi thất bại" })
                        }
                    }).catch(error => {
                        reject(ErrorHelpers.errorReject(error, 'crudError', 'UserServices'))
                    })
                } else {
                    // console.log("not found user")
                    reject({ status: 0, message: "Mật khẩu cũ không đúng." })
                }
            }).catch(error => {
                reject(ErrorHelpers.errorReject(error, 'crudError', 'UserServices'))
            })
        } catch (error) {
            // console.log("error changepass:", error)
            reject({ status: 0, message: "Lỗi cơ sở dữ liệu" })
        }
    }),
    resetPass: param => new Promise((resolve) => {
        try {
            console.log("param: ", param)
            let { entity } = param

            if (entity.password === undefined || entity.password === '') {
                resolve({ status: 0, message: "Mạt khẩu không hợp lệ!" })
            }
            const passMd5 = md5(entity.password)

            console.log("md5: ", passMd5)
            entity = Object.assign({}, { password: passMd5 })
            usersModel.update(
                entity, {
                    where: { id: Number(param.id) },
                    // fields: ['password']
                }
            ).then(rowsUpdate => {
                console.log("rowsUpdate: ", rowsUpdate)
                if (rowsUpdate[0] > 0) {
                    resolve({ status: 1, message: "Thành Công" })
                } else {
                    resolve({ status: 0, message: "Mật khẩu cũ giống mật khẩu mới" })
                }
            }).catch(err => {
                console.log("create user err: ", err)
                resolve({ status: -2, message: err.errors.message })
            })
        } catch (error) {
            resolve({ status: -1, message: `Lỗi cơ sở dữ liệu: ${error}` })
        }
    }),
    get_all: async param => {
        let finnalyResult;

        try {
            // console.log("filter:", JSON.parse(param.filter))
            const { filter, sort, auth } = param;

            console.log(filter);
            let whereFilter = _.assign({}, filter);

            whereFilter = filterHelpers.combineFromDateWithToDate(filter);

            filterHelpers.makeStringFilterRelatively(['username', 'email'], whereFilter);
            if (!whereFilter) {
                whereFilter = {...filter }
            }

            finnalyResult = await usersModel.findAll({
                where: whereFilter,
                order: [sort],
                attributes: {
                    exclude: ['password']
                },
                include: {
                    model: roles,
                    as: "role"
                }
            }).catch(error => {
                ErrorHelpers.errorThrow(error, 'crudError', 'UserServices');
            });
        } catch (error) {
            ErrorHelpers.errorThrow(error, 'crudError', 'UserServices');
        }

        return finnalyResult;
    },
    delete: async param => {
        try {
            console.log('delete id', param.id);

            const foundSite = await usersModel.findOne({
                where: {
                    "id": param.id
                }
            }).catch((error) => {
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'getInfoError',
                    error
                })
            });

            if (!foundSite) {
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'crudNotExisted',
                });
            } else {
                await usersModel.destroy({ where: { id: parseInt(param.id) } });

                const siteAfterDelete = await item.findOne({ where: { Id: param.id } })
                    .catch(err => {
                        ErrorHelpers.errorThrow(err, 'crudError', 'itemService');
                    });

                if (siteAfterDelete) {
                    throw new ApiErrors.BaseError({
                        statusCode: 202,
                        type: 'deleteError',
                    });
                }
            }

        } catch (err) {
            ErrorHelpers.errorThrow(err, 'crudError', 'itemService');
        }

        return { status: 1 };
    },
    signin: async param => {
        let finnalyResult;

        try {
            const entity = param.entity;
            console.log("service", entity)
                // const userInfo = {}
            const userInfo = await usersModel.findOne({
                where: {
                    username: entity.username
                }
            }).catch(err => {
                ErrorHelpers.errorThrow(err, 'userNotFoundError', 'Login', 501)
            })

            if (userInfo) {
                console.log('pass', entity.password, userInfo.password) //console.log
                const passOk = await verifyPasswordMd5(entity.password, userInfo.password)
                console.log(passOk) //console.log
                if (passOk) {
                    console.log("user: ", userInfo) //console.log
                    const dataToken = { username: userInfo.username, userId: userInfo.id, roleId: userInfo.roleId, email: userInfo.email }
                    const token = jwt.sign({
                            ...dataToken
                        },
                        process.env.JWT_SECRET, {
                            expiresIn: 86400,
                        }
                    );
                    finnalyResult = {
                        token: token,
                        status: 1
                    }
                    console.log("finnaluResult", finnalyResult)
                    return finnalyResult
                } else {
                    throw new ApiErrors.BaseError({
                        statusCode: 202,
                        type: 'loginPassError',
                        name: 'Login'
                    })
                }
            } else {
                if (userInfo && userInfo.status !== 1) {
                    throw new ApiErrors.BaseError({
                        statusCode: 202,
                        type: 'userInactiveError',
                        name: 'Login'
                    })
                }
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'userNotFoundError',
                    name: 'Login'
                })
            }
        } catch (error) {
            ErrorHelpers.errorThrow(error, 'crudError', 'UserServices');
        }
    }
}