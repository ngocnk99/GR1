import employer from '../models/employer'
import usersModel from '../models/users'
import models from '../entity/index'
import _ from 'lodash';

import * as ApiErrors from '../errors';
import ErrorHelpers from '../helpers/errorHelpers';
import filterHelpers from '../helpers/filterHelpers';
import preCheckHelpers, { TYPE_CHECK } from '../helpers/preCheckHelpers';
const { getUserId } = require('../utils')
const { users } = models;

export default {
    get_list: async param => {
        let finnalyResult;
        try {
            let { filter, range, sort, /* auth */ } = param;
            let whereFilter = filter;
            const perPage = (range[1] - range[0]) + 1
            const page = Math.floor(range[0] / perPage);

            filterHelpers.makeStringFilterRelatively(['companyName', 'company_website', 'address'], whereFilter);

            if (!whereFilter) {
                whereFilter = {...filter }
            }

            console.log('where', whereFilter);

            const result = await employer.findAndCountAll({
                where: whereFilter,
                order: [sort],
                offset: range[0],
                limit: perPage,
                include: {
                    model: users,
                    as: 'user',
                    attributes: {
                        // include: [],
                        exclude: ['password']
                    },
                }
            }).catch(err => {
                ErrorHelpers.errorThrow(err, 'getListError', 'employerProfileService')
            });
            console.log(result)
            finnalyResult = {
                ...result,
                page: page + 1,
                perPage
            };

        } catch (err) {
            ErrorHelpers.errorThrow(err, 'getListError', 'employerProfileService')
        }

        return finnalyResult;
    },
    get_one: async param => {
        let finnalyResult;
        try {
            const { id /* , auth */ } = param;
            const whereFilter = { 'id': id };
            const result = await employer.findOne({
                where: whereFilter,
                include: {
                    model: users,
                    as: 'user',
                    attributes: {
                        // include: [],
                        exclude: ['password']
                    },
                }
            }).catch(err => {
                ErrorHelpers.errorThrow(err, 'getInfoError', 'employerProfileService')
            });

            if (!result) {
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'crudNotExisted',
                });
            }

            finnalyResult = result;

        } catch (err) {
            ErrorHelpers.errorThrow(err, 'getInfoError', 'employerProfileService')
        }

        return finnalyResult;
    },
    create: async param => {
        let finnalyResult;

        try {
            const entity = param.entity;
            const { userId, roleId } = getUserId(entity.token);
            param.entity.userId = userId;
            if (roleId != 2) {
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'getInfoError',
                    message: 'Bạn không có quyền hạn này'
                })
            }
            const infoArr = Array.from(await Promise.all([
                preCheckHelpers.createPromiseCheck(employer.findOne, {
                    where: {
                        userId: userId,
                    }
                }, entity.userId ? true : false, TYPE_CHECK.CHECK_DUPLICATE, { parent: 'api.employer.userId' }),
                preCheckHelpers.createPromiseCheck(usersModel.findOne, {
                        where: {
                            id: userId,
                        }
                    },
                    userId ? true : false, TYPE_CHECK.CHECK_EXISTS, { parent: 'api.employer.userId' }
                ),
            ]));
            if (!preCheckHelpers.check(infoArr)) {
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'getInfoError',
                    message: 'Không xác thực được thông tin gửi lên'
                })
            }
            finnalyResult = await employer.create(param.entity).catch(error => {
                throw (new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'crudError',
                    error,
                }));
            });

            if (!finnalyResult) {
                throw (new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'crudInfo',
                }));
            }

        } catch (error) {
            ErrorHelpers.errorThrow(error, 'crudError', 'employerProfileService');
        }

        return { result: finnalyResult };
    },
    update: async param => {
        let finnalyResult;

        try {
            const entity = param.entity;
            const newInfo = _.omit(entity, ['token']);
            const { userId, roleId } = getUserId(entity.token);
            console.log("Site update: ", entity)
            if (roleId != 2) {
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'getInfoError',
                    message: 'Bạn không có quyền hạn này'
                })
            }
            const foundSite = await employer.findOne({
                where: {
                    "userId": userId
                }
            }).catch(error => { throw preCheckHelpers.createErrorCheck({ typeCheck: TYPE_CHECK.GET_INFO, modelStructure: { parent: 'employer' } }, error) });

            if (!foundSite) {
                throw (new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'crudNotExisted',
                }));
            }

            await employer.update(
                newInfo, { where: { userId: userId } }
            ).catch(error => {
                throw (new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'crudError',
                    error,
                }));
            });

            finnalyResult = await employer.findOne({ where: { "userId": userId } }).catch(error => {
                throw (new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'crudInfo',
                    error,
                }));
            });

            if (!finnalyResult) {
                throw (new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'crudInfo',
                }));
            }

        } catch (error) {
            ErrorHelpers.errorThrow(error, 'crudError', 'employerProfileService');
        }

        return { result: finnalyResult };
    },
    delete: async param => {
        try {
            const entity = param.entity;
            const { userId } = getUserId(entity.token)
            console.log('delete userId', userId);

            const foundSite = await employer.findOne({
                where: {
                    "userId": userId
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
                await employer.destroy({ where: { "userId": userId } });

                const siteAfterDelete = await employer.findOne({ "userId": userId })
                    .catch(err => {
                        ErrorHelpers.errorThrow(err, 'crudError', 'employerProfileService');
                    });

                if (siteAfterDelete) {
                    throw new ApiErrors.BaseError({
                        statusCode: 202,
                        type: 'deleteError',
                    });
                }
            }

        } catch (err) {
            ErrorHelpers.errorThrow(err, 'crudError', 'employerProfileService');
        }

        return { status: 1 };
    },
    get_all: async param => {
        let finnalyResult;

        try {
            // console.log("filter:", JSON.parse(param.filter))
            let { filter, sort } = param;
            if (!sort) {
                sort = ['id', 'ASC']
            }
            console.log(filter);
            let whereFilter = _.assign({}, filter);

            // try {
            //   whereFilter = filterHelpers.combineFromDateWithToDate(filter);
            // } catch (error) {
            //   throw (error);
            // }

            filterHelpers.makeStringFilterRelatively(['companyName', 'company_website', 'address'], whereFilter);

            if (!whereFilter) {
                whereFilter = {...filter }
            }

            finnalyResult = await employer.findAll({
                where: whereFilter,
                order: [sort],
                include: {
                    model: users,
                    as: 'user',
                    attributes: {
                        // include: [],
                        exclude: ['password']
                    },
                }
            }).catch(err => {
                ErrorHelpers.errorThrow(err, 'getListError', 'employerProfileService')
            });
        } catch (err) {
            ErrorHelpers.errorThrow(err, 'getListError', 'employerProfileService');
        }

        return finnalyResult;
    },
}