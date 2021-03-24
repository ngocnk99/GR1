import jobkerProfileService from '../services/jobkerProfileService'
import loggerHelpers from '../helpers/loggerHelpers';
import { recordStartTime } from '../utils/loggerFormat';
import { codeMessage } from '../utils';
import errorCode from '../utils/errorCode';
import * as ApiErrors from '../errors';

export default {
    get_list: (req, res, next) => {
        recordStartTime.call(req);
        // console.log("param", req.param)
        console.log("locals", res.locals);
        try {
            const { sort, range, filter } = res.locals
            const param = {
                sort,
                range,
                filter,
                auth: req.auth
            };

            jobkerProfileService.get_list(param).then(data => {
                const dataOutput = {
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

                res.header('Content-Range', `sclSocialAccounts ${range}/${data.count}`);
                res.send(dataOutput);
                // write log
                recordStartTime.call(res);
                loggerHelpers.logInfor(req, res, {
                    dataParam: req.params,
                    dataQuery: req.query,
                });
            }).catch(error => {
                error.dataQuery = req.query;
                next(error)
            })
        } catch (error) {
            error.dataQuery = req.query;
            next(error)
        }
    },
    get_one: (req, res, next) => {
        recordStartTime.call(req);
        try {
            const { id } = req.params;
            const param = { id, auth: req.auth }

            // console.log("jobkerProfileService param: ", param)
            jobkerProfileService.get_one(param).then(data => {
                res.send(data);

                recordStartTime.call(res);
                loggerHelpers.logInfor(req, res, {
                    dataParam: req.params,
                    dataQuery: req.query,
                });
            }).catch(error => {
                next(error)
            })
        } catch (error) {
            error.dataParams = req.params;
            next(error)
        }
    },
    create: (req, res, next) => {
        recordStartTime.call(req);
        try {
            const entity = res.locals.body ? res.locals.body : req.body;
            const param = { entity }

            jobkerProfileService.create(param).then(data => {
                if (data && data.result) {
                    const dataOutput = {
                        result: data.result,
                        success: true,
                        errors: [],
                        messages: []
                    };

                    res.send(dataOutput);
                } else {
                    throw new ApiErrors.BaseError({
                        statusCode: 202,
                        type: 'crudNotExisted',
                    });
                }
            }).catch(error => {
                next(error)
            })
        } catch (error) {
            next(error)
        }
    },
    update: (req, res, next) => {
        recordStartTime.call(req);
        try {
            const { id } = req.params
            const entity = res.locals.body ? res.locals.body : req.body;
            // const entity = req.body
            const param = { id, entity }
            console.log(param)
            jobkerProfileService.update(param).then(data => {
                if (data && data.result) {
                    const dataOutput = {
                        result: data.result,
                        success: true,
                        errors: [],
                        messages: []
                    };

                    res.send(dataOutput);
                } else {
                    throw new ApiErrors.BaseError({
                        statusCode: 202,
                        type: 'crudNotExisted',
                    });
                }
            }).catch(error => {
                error.dataInput = req.body;
                error.dataParams = req.params;
                next(error)
            })
        } catch (error) {
            error.dataInput = req.body;
            error.dataParams = req.params;
            next(error)
        }
    },
    delete: (req, res, next) => {
        recordStartTime.call(req);
        try {
            const { id } = req.params;
            // const entity = { Status: 0 }
            const param = { id, auth: req.auth }

            jobkerProfileService.delete(param).then(data => {
                if (data && data.status === 1) {
                    const dataOutput = {
                        result: null,
                        success: true,
                        errors: [],
                        messages: []
                    };

                    res.send(dataOutput);

                    recordStartTime.call(res);
                    loggerHelpers.logInfor(req, res, {});
                } else {
                    throw new ApiErrors.BaseError({
                        statusCode: 202,
                        type: 'deleteError',
                    });
                }
            }).catch(error => {
                error.dataParams = req.params;
                next(error)
            })
        } catch (error) {
            error.dataParams = req.params;
            next(error)
        }
    },
    get_all: (req, res, next) => {
        try {
            recordStartTime.call(req);

            try {
                const { attributes } = req.body
                const { sort, filter } = res.locals;
                const param = {
                    sort,
                    attributes: attributes ? JSON.parse(attributes) : null,
                    filter,
                    auth: req.auth
                };

                jobkerProfileService.get_all(param).then(data => {
                    res.send({
                        result: data,
                        success: true,
                        errors: null,
                        messages: null
                    });

                    recordStartTime.call(res);
                    loggerHelpers.logInfor(req, res, { data });
                }).catch(err => {
                    next(err)
                })
            } catch (error) {
                const { code } = errorCode.paramError;
                const statusCode = 406
                const errMsg = new Error(error).message;

                recordStartTime.call(res);
                loggerHelpers.logError(req, res, { errMsg });
                res.send({
                    result: null,
                    success: false,
                    errors: [{ code, message: errorCode.paramError.messages[0] }],
                    messages: [codeMessage[statusCode], errMsg]
                })
            }
        } catch (error) {
            next(error)
        }
    },
};