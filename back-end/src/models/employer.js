import models from '../entity/index';
import Promise from '../utils/promise';
import * as ApiErrors from '../errors';

const { employer } = models;

/**
 * EmployerProfileEntity Class
 */
class EmployerProfileEntity {
    /**
     *
     * @param {Object} options
     */
    static findAndCountAll(options) {
        return Promise.try(() => {
            return employer.findAndCountAll(options)
        }).catch(error => {
            throw new ApiErrors.BaseError({
                statusCode: 202,
                type: 'getListError',
                error,
                name: 'EmployerProfileEntity'
            })
        })
    }

    /**
     *
     * @param {Object} entity
     */
    static create(entity) {
        return Promise.try(() => {
                return employer.create(entity)
            })
            .catch(error => {
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'crudError',
                    error,
                    name: 'EmployerProfileEntity'
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
            return employer.update(entity, options)
                .catch(error => {
                    throw new ApiErrors.BaseError({
                        statusCode: 202,
                        type: 'crudError',
                        error,
                        name: 'EmployerProfileEntity'
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
            return employer.destroy(options)
        }).catch(error => {
            throw new ApiErrors.BaseError({
                statusCode: 202,
                type: 'deleteError',
                error,
                name: 'EmployerProfileEntity'
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
                return employer.findOne(options)
            })
            .catch(error => {
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'getInfoError',
                    error,
                    name: 'EmployerProfileEntity'
                })
            })
    }

    /**
     *
     * @param {Object} options
     */
    static findAll(options) {
        return Promise.try(() => {
                return employer.findAll(options)
            })
            .catch(error => {
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'getListError',
                    error,
                    name: 'EmployerProfileEntity'
                })
            })
    }

    /**
     *
     * @param {*} options
     */
    static findOrCreate(options) {
        return Promise.try(() => {
            return employer.findOrCreate(options)
                // .spread(async (findReportImExCreate, created) => {
        }).catch(error => {
            throw new ApiErrors.BaseError({
                statusCode: 202,
                type: 'getListError',
                error,
                name: 'EmployerProfileEntity'
            })
        })
    }
}

export default EmployerProfileEntity;