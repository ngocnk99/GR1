import UserService from '../services/userService'
// import logger from '../utils/logger';
import loggerHelpers from '../helpers/loggerHelpers';
import { codeMessage } from '../utils';
import errorCode from '../utils/errorCode';
import /* loggerFormat, */ { recordStartTime } from '../utils/loggerFormat';
import * as ApiErrors from '../errors';

export default {
    get_list: (req, res, next) => {
        try {
            recordStartTime.call(req);
            const { sort, range, filter } = res.locals;
            let param;

            param = {
                sort,
                range,
                filter,
                auth: req.auth
            }

            UserService.get_list(param).then(data => {
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
            }).catch(err => {
                next(err)
            })

        } catch (error) {
            next(error)
        }
    },
    get_one: (req, res, next) => {
        try {
            recordStartTime.call(req);
            const { id } = req.params;
            const param = { id, auth: req.auth }

            // console.log("UserService param: ", param)
            UserService.get_one(param).then(data => {
                // res.header('Content-Range', `articles ${range}/${data.count}`);
                res.send(data);

                recordStartTime.call(res);
                loggerHelpers.logInfor(req, res, {
                    dataParam: req.params,
                    dataQuery: req.query,
                });
            }).catch(err => {
                next(err)
            })
        } catch (error) {
            next(error)
        }
    },
    create_jobker: (req, res, next) => {
        try {
            recordStartTime.call(req);
            const entity = res.locals.body;
            entity.roleId = 1;
            const param = { entity }
            UserService.create(param).then(data => {
                if (data && data.status === 1) {
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
            }).catch(err => {
                next(err)
            })
        } catch (err) {
            next(err)
        }
    },
    create_employer: (req, res, next) => {
        try {
            recordStartTime.call(req);
            const entity = res.locals.body;
            entity.roleId = 2;
            const param = { entity }
            UserService.create(param).then(data => {
                if (data && data.status === 1) {
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
            }).catch(err => {
                next(err)
            })
        } catch (err) {
            next(err)
        }
    },
    signin: (req, res, next) => {
        try {
            recordStartTime.call(req);
            const entity = res.locals.body;
            const param = { entity }
            UserService.signin(param).then(data => {
                if (data && data.status === 1) {
                    const dataOutput = {
                        token: data.token,
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
            }).catch(err => {
                next(err)
            })
        } catch (err) {
            next(err)
        }
    },
    update: (req, res, next) => {
        try {
            recordStartTime.call(req);
            const { id } = req.params;
            const entity = res.locals.body;
            const param = { id, entity }

            UserService.update(param).then(data => {
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
            }).catch(err => {
                next(err)
            })
        } catch (error) {
            next(error)
        }
    },
    delete: (req, res, next) => {
        try {
            const { id } = req.params;
            // const entity = { Status: 0 }
            const param = { id, entity }

            UserService.delete(param).then(data => {
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
            }).catch(err => {
                next(err)
            })
        } catch (error) {
            next(error)
        }
    },
    changePass: (req, res, next) => {
        try {
            recordStartTime.call(req);

            // const { id } = req.params
            // console.log(req.auth);
            // const id = req.param;
            const entity = res.locals.body;
            const param = { id: req.auth.userId, entity, auth: req.auth }

            UserService.changePass(param).then(data => {
                // console.log("changePass dataReturn: ", data)
                const response = {
                    ...data,
                    success: true,
                    errors: [],
                    messages: []
                };

                res.send(response);
                // res.send(data);

                recordStartTime.call(res);
                loggerHelpers.logInfor(req, res, { data });
            }).catch(err => {
                next(err)
            })
        } catch (error) {
            next(error)
        }
    },
    resetPass: (req, res, next) => {
        try {
            recordStartTime.call(req);

            const { id } = req.params
            const entity = req.body
            const param = { id, entity }

            UserService.resetPass(param).then(data => {
                res.send(data);

                recordStartTime.call(res);
                loggerHelpers.logInfor(req, res, { data });
            }).catch(err => {
                next(err)
            })
        } catch (error) {
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

                UserService.get_all(param).then(data => {
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