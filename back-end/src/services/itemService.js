import item from '../models/items'
import models from '../entity/index'
import _ from 'lodash';

import * as ApiErrors from '../errors';
import ErrorHelpers from '../helpers/errorHelpers';
import filterHelpers from '../helpers/filterHelpers';
import preCheckHelpers, { TYPE_CHECK } from '../helpers/preCheckHelpers';

const { roomItem, rooms } = models;

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

            filterHelpers.makeStringFilterRelatively(['name'], whereFilter);

            // whereFilter = await filterHelpers.createWhereWithAuthorization(auth, whereFilter).catch(error => {
            //   ErrorHelpers.errorThrow(error);
            // });

            if (!whereFilter) {
                whereFilter = {...filter }
            }

            console.log('where', whereFilter);

            const result = await item.findAndCountAll({
                where: whereFilter,
                order: [sort],
                offset: range[0],
                limit: perPage,
                include: [{
                        model: roomItem,
                    },
                    // 'rooms'
                ]
            }).catch(err => {
                ErrorHelpers.errorThrow(err, 'getListError', 'itemService')
            });
            finnalyResult = {
                ...result,
                page: page + 1,
                perPage
            };

        } catch (err) {
            ErrorHelpers.errorThrow(err, 'getListError', 'itemService')
        }

        return finnalyResult;
    },
    get_one: async param => {
        let finnalyResult;

        try {
            const { id /* , auth */ } = param;
            const whereFilter = { 'id': id };
            const result = await item.findOne({
                where: whereFilter,
                include: [{
                        model: roomItem,
                    },
                    // 'rooms'
                ]
            }).catch(err => {
                ErrorHelpers.errorThrow(err, 'getInfoError', 'itemService')
            });

            if (!result) {
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'crudNotExisted',
                });
            }

            finnalyResult = result;

        } catch (err) {
            ErrorHelpers.errorThrow(err, 'getInfoError', 'itemService')
        }

        return finnalyResult;
    },
    create: async param => {
        let finnalyResult;

        try {
            const entity = param.entity;

            //check info
            const infoArr = Array.from(await Promise.all([
                preCheckHelpers.createPromiseCheck(item.findOne, {
                    where: {
                        name: entity.name,
                    }
                }, entity.name ? true : false, TYPE_CHECK.CHECK_DUPLICATE, { parent: 'api.items.name' }),
            ]));
            if (!preCheckHelpers.check(infoArr)) {
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'getInfoError',
                    message: 'Không xác thực được thông tin gửi lên'
                })
            }
            finnalyResult = await item.create(param.entity).catch(error => {
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
            ErrorHelpers.errorThrow(error, 'crudError', 'itemService');
        }

        return { result: finnalyResult };
    },
    update: async param => {
        let finnalyResult;

        try {
            const entity = param.entity;

            console.log("Site update: ", entity)

            const foundSite = await item.findOne({
                where: {
                    "id": param.id
                }
            }).catch(error => { throw preCheckHelpers.createErrorCheck({ typeCheck: TYPE_CHECK.GET_INFO, modelStructure: { parent: 'item' } }, error) });

            if (!foundSite) {
                throw (new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'crudNotExisted',
                }));
            }

            await item.update(
                entity, { where: { id: parseInt(param.id) } }
            ).catch(error => {
                throw (new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'crudError',
                    error,
                }));
            });

            finnalyResult = await item.findOne({ where: { Id: param.id } }).catch(error => {
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
            ErrorHelpers.errorThrow(error, 'crudError', 'itemService');
        }

        return { result: finnalyResult };
    },
    delete: async param => {
        try {
            console.log('delete id', param.id);

            const foundSite = await item.findOne({
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
                await item.destroy({ where: { id: parseInt(param.id) } });

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

            filterHelpers.makeStringFilterRelatively(['name'], whereFilter);

            if (!whereFilter) {
                whereFilter = {...filter }
            }

            finnalyResult = await item.findAll({
                where: whereFilter,
                order: [sort],
                include: [{
                        model: roomItem,
                    },
                    // 'rooms'
                ]
            }).catch(err => {
                ErrorHelpers.errorThrow(err, 'getListError', 'itemService')
            });
        } catch (err) {
            ErrorHelpers.errorThrow(err, 'getListError', 'itemService');
        }

        return finnalyResult;
    },
}