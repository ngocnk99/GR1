import models from '../entity/index';
import Promise from '../utils/promise';
import * as ApiErrors from '../errors';

const { items } = models;

/**
 * ItemEntity Class
 */
class ItemEntity {
    /**
     *
     * @param {Object} options
     */
    static findAndCountAll(options) {
        return Promise.try(() => {
            return items.findAndCountAll(options)
        }).catch(error => {
            throw new ApiErrors.BaseError({
                statusCode: 202,
                type: 'getListError',
                error,
                name: 'ItemEntity'
            })
        })
    }

    /**
     *
     * @param {Object} entity
     */
    static create(entity) {
        return Promise.try(() => {
                return items.create(entity)
            })
            .catch(error => {
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'crudError',
                    error,
                    name: 'ItemEntity'
                })
            })
    }

    /**
     *
     * @param {Object} entity
     * @param {Object} options
     */
    static update(entity, options) {
        return Promise.try(() => {
            return items.update(entity, options)
                .catch(error => {
                    throw new ApiErrors.BaseError({
                        statusCode: 202,
                        type: 'crudError',
                        error,
                        name: 'ItemEntity'
                    })
                })
        })
    }

    /**
     *
     * @param {Object} options
     */
    static destroy(options) {
        return Promise.try(() => {
            return items.destroy(options)
        }).catch(error => {
            throw new ApiErrors.BaseError({
                statusCode: 202,
                type: 'deleteError',
                error,
                name: 'ItemEntity'
            })
        })
    }

    /**
     * Find one.
     *
     * @param {Object} options
     */
    static findOne(options) {
        return Promise.try(() => {
                return items.findOne(options)
            })
            .catch(error => {
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'getInfoError',
                    error,
                    name: 'ItemEntity'
                })
            })
    }

    /**
     *
     * @param {Object} options
     */
    static findAll(options) {
        return Promise.try(() => {
                return items.findAll(options)
            })
            .catch(error => {
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'getListError',
                    error,
                    name: 'ItemEntity'
                })
            })
    }

    /**
     *
     * @param {*} options
     */
    static findOrCreate(options) {
        return Promise.try(() => {
            return items.findOrCreate(options)
                // .spread(async (findReportImExCreate, created) => {
        }).catch(error => {
            throw new ApiErrors.BaseError({
                statusCode: 202,
                type: 'getListError',
                error,
                name: 'ItemEntity'
            })
        })
    }
}

export default ItemEntity;