import models from '../entity/index';
import Promise from '../utils/promise';
import * as ApiErrors from '../errors';

const { roles } = models;

/**
 * RoleEntity Class
 */
class RoleEntity {
    /**
     *
     * @param {Object} options
     */
    static findAndCountAll(options) {
        return Promise.try(() => {
            return roles.findAndCountAll(options)
        }).catch(error => {
            throw new ApiErrors.BaseError({
                statusCode: 202,
                type: 'getListError',
                error,
                name: 'RoleEntity'
            })
        })
    }

    /**
     *
     * @param {Object} entity
     */
    static create(entity) {
        return Promise.try(() => {
                return roles.create(entity)
            })
            .catch(error => {
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'crudError',
                    error,
                    name: 'RoleEntity'
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
            return roles.update(entity, options)
                .catch(error => {
                    throw new ApiErrors.BaseError({
                        statusCode: 202,
                        type: 'crudError',
                        error,
                        name: 'RoleEntity'
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
            return roles.destroy(options)
        }).catch(error => {
            throw new ApiErrors.BaseError({
                statusCode: 202,
                type: 'deleteError',
                error,
                name: 'RoleEntity'
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
                return roles.findOne(options)
            })
            .catch(error => {
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'getInfoError',
                    error,
                    name: 'RoleEntity'
                })
            })
    }

    /**
     *
     * @param {Object} options
     */
    static findAll(options) {
        return Promise.try(() => {
                return roles.findAll(options)
            })
            .catch(error => {
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'getListError',
                    error,
                    name: 'RoleEntity'
                })
            })
    }

    /**
     *
     * @param {*} options
     */
    static findOrCreate(options) {
        return Promise.try(() => {
            return roles.findOrCreate(options)
                // .spread(async (findReportImExCreate, created) => {
        }).catch(error => {
            throw new ApiErrors.BaseError({
                statusCode: 202,
                type: 'getListError',
                error,
                name: 'RoleEntity'
            })
        })
    }
}

export default RoleEntity;