import models from '../entity/index';
import Promise from '../utils/promise';
import * as ApiErrors from '../errors';

const { jobker } = models;

/**
 * JobkerProfileEntity Class
 */
class JobkerProfileEntity {
    /**
     *
     * @param {Object} options
     */
    static findAndCountAll(options) {
        return Promise.try(() => {
            return jobker.findAndCountAll(options)
        }).catch(error => {
            throw new ApiErrors.BaseError({
                statusCode: 202,
                type: 'getListError',
                error,
                name: 'JobkerProfileEntity'
            })
        })
    }

    /**
     *
     * @param {Object} entity
     */
    static create(entity) {
        return Promise.try(() => {
                return jobker.create(entity)
            })
            .catch(error => {
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'crudError',
                    error,
                    name: 'JobkerProfileEntity'
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
            return jobker.update(entity, options)
                .catch(error => {
                    throw new ApiErrors.BaseError({
                        statusCode: 202,
                        type: 'crudError',
                        error,
                        name: 'JobkerProfileEntity'
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
            return jobker.destroy(options)
        }).catch(error => {
            throw new ApiErrors.BaseError({
                statusCode: 202,
                type: 'deleteError',
                error,
                name: 'JobkerProfileEntity'
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
                return jobker.findOne(options)
            })
            .catch(error => {
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'getInfoError',
                    error,
                    name: 'JobkerProfileEntity'
                })
            })
    }

    /**
     *
     * @param {Object} options
     */
    static findAll(options) {
        return Promise.try(() => {
                return jobker.findAll(options)
            })
            .catch(error => {
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'getListError',
                    error,
                    name: 'JobkerProfileEntity'
                })
            })
    }

    /**
     *
     * @param {*} options
     */
    static findOrCreate(options) {
        return Promise.try(() => {
            return jobker.findOrCreate(options)
                // .spread(async (findReportImExCreate, created) => {
        }).catch(error => {
            throw new ApiErrors.BaseError({
                statusCode: 202,
                type: 'getListError',
                error,
                name: 'JobkerProfileEntity'
            })
        })
    }
}

export default JobkerProfileEntity;