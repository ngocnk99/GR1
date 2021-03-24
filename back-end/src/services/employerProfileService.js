import employerProfile from '../models/employerProfile'
// import models from '../entity/index'
import _ from 'lodash';

import * as ApiErrors from '../errors';
import ErrorHelpers from '../helpers/errorHelpers';
import filterHelpers from '../helpers/filterHelpers';
import preCheckHelpers, { TYPE_CHECK } from '../helpers/preCheckHelpers';

// const {  rooms } = models;

export default {
    get_list: async param => {
        let finnalyResult;
        try {
            let { filter, range, sort, /* auth */ } = param;
            let whereFilter = filter;
            if (!range) {
                range = [0, 4]
            }
            if (!sort) {
                sort = ['id', 'ASC']
            }
            const perPage = (range[1] - range[0]) + 1
            const page = Math.floor(range[0] / perPage);

            filterHelpers.makeStringFilterRelatively(['companyName', 'company_website', 'address'], whereFilter);

            if (!whereFilter) {
                whereFilter = {...filter }
            }

            console.log('where', whereFilter);

            const result = await employerProfile.findAndCountAll({
                where: whereFilter,
                order: [sort],
                offset: range[0],
                limit: perPage,
            }).catch(err => {
                ErrorHelpers.errorThrow(err, 'getListError', 'employerProfileService')
            });

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
            const result = await employerProfile.findOne({
                where: whereFilter,
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
            const infoArr = Array.from(await Promise.all([
                preCheckHelpers.createPromiseCheck(employerProfile.findOne, {
                    where: {
                        userId: entity.userId,
                    }
                }, entity.userId ? true : false, TYPE_CHECK.CHECK_DUPLICATE, { parent: 'api.employerProfiles.userId' }),
            ]));
            if (!preCheckHelpers.check(infoArr)) {
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'getInfoError',
                    message: 'Không xác thực được thông tin gửi lên'
                })
            }
            finnalyResult = await employerProfile.create(param.entity).catch(error => {
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

            console.log("Site update: ", entity)

            const foundSite = await employerProfile.findOne({
                where: {
                    "id": param.id
                }
            }).catch(error => { throw preCheckHelpers.createErrorCheck({ typeCheck: TYPE_CHECK.GET_INFO, modelStructure: { parent: 'employerProfile' } }, error) });

            if (!foundSite) {
                throw (new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'crudNotExisted',
                }));
            }

            await employerProfile.update(
                entity, { where: { id: parseInt(param.id) } }
            ).catch(error => {
                throw (new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'crudError',
                    error,
                }));
            });

            finnalyResult = await employerProfile.findOne({ where: { Id: param.id } }).catch(error => {
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
            console.log('delete id', param.id);

            const foundSite = await employerProfile.findOne({
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
                await employerProfile.destroy({ where: { id: parseInt(param.id) } });

                const siteAfterDelete = await employerProfile.findOne({ where: { Id: param.id } })
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

            finnalyResult = await employerProfile.findAll({
                where: whereFilter,
                order: [sort],
                include: [{
                        model: roomemployerProfile,
                    },
                    // 'rooms'
                ]
            }).catch(err => {
                ErrorHelpers.errorThrow(err, 'getListError', 'employerProfileService')
            });
        } catch (err) {
            ErrorHelpers.errorThrow(err, 'getListError', 'employerProfileService');
        }

        return finnalyResult;
    },
}