import _ from 'lodash';
import models from '../entity/index';
import * as ApiErrors from '../errors';
import viMessage from '../locales/vi';
import ErrorHelpers from './errorHelpers';

const { /* sequelize, Op, */ groupUsers, hospitals } = models;

const TYPE_CHECK = {
    CHECK_DUPLICATE: 1001,
    CHECK_EXISTS: 1002,
    GET_INFO: 1003,
}

export { TYPE_CHECK };

/**
 *
 */
export default class PreCheckHelpers {

    /**
     *
     * @param {*} modelCallback
     * @param {*} optionsCallback
     * @param {*} condition
     * @param {*} typeCheck
     * @param {*} modelStructure
     */
    static createPromiseCheck(modelCallback, optionsCallback, condition, typeCheck, modelStructure) {
        return new Promise((resolve, reject) => {
            if (modelCallback && optionsCallback && typeCheck) {
                if (condition) {
                    try {
                        // console.log(optionsCallback);
                        modelCallback(optionsCallback).then(result => {
                            switch (typeCheck) {
                                case TYPE_CHECK.CHECK_DUPLICATE:
                                    // console.log(result.dataValues);
                                    if (result && result.dataValues) {
                                        resolve({
                                            result,
                                            isPass: false,
                                            infoCheck: {
                                                typeCheck,
                                                modelStructure
                                            }
                                        });
                                    } else {
                                        resolve({
                                            result: null,
                                            isPass: true,
                                            infoCheck: {
                                                typeCheck,
                                                modelStructure
                                            }
                                        })
                                    }
                                    break;
                                case TYPE_CHECK.CHECK_EXISTS:
                                    // console.log(result.dataValues);
                                    if (result && result.dataValues) {
                                        resolve({
                                            result,
                                            isPass: true,
                                            infoCheck: {
                                                typeCheck,
                                                modelStructure
                                            }
                                        });
                                    } else {
                                        resolve({
                                            result,
                                            isPass: false,
                                            infoCheck: {
                                                typeCheck,
                                                modelStructure
                                            }
                                        });
                                    }
                                    break;
                                default:
                                    resolve({
                                        result: null,
                                        isPass: false,
                                        infoCheck: {
                                            typeCheck,
                                            modelStructure
                                        }
                                    })
                                    break;
                            }
                        }).catch(error => {
                            reject(PreCheckHelpers.createErrorCheck({ typeCheck: TYPE_CHECK.GET_INFO, modelStructure }, error));
                        })
                    } catch (error) {

                        reject(error);
                    }
                } else {
                    resolve({
                        result: null,
                        isPass: true,
                        infoCheck: {
                            typeCheck,
                            modelStructure
                        }
                    })
                }
            } else {
                reject(new ApiErrors.BaseError({
                    statusCode: 202,
                    message: "All arguments is required!",
                }))
            }
        })
    }

    /**
     *
     * @param {*} infoArr
     */
    static check(infoArr) {
        infoArr.forEach(e => {
            if (!e.isPass) throw PreCheckHelpers.createErrorCheck(e.infoCheck);
        });

        return true;
    }

    /**
     *
     * @param {*} infoCheck
     * @param {*} error
     */
    static createErrorCheckNew(infoCheck, error) {
        const { typeCheck, modelStructure } = infoCheck;
        const detail = {};
        let leftMes = '',
            midMes = '',
            rightMes = '';

        if (modelStructure) {
            midMes = PreCheckHelpers.createMidMess(modelStructure) + ' này';
        } else {
            midMes = 'Bản ghi này' + midMes;
        }

        switch (typeCheck) {
            case TYPE_CHECK.CHECK_DUPLICATE:
                detail.type = 'crudExisted';
                rightMes = ' đã tồn tại';
                break;
            case TYPE_CHECK.CHECK_EXISTS:
                detail.type = 'crudNotExisted';
                rightMes = ' không tồn tại';
                break;
            case TYPE_CHECK.GET_INFO:
                detail.type = 'getInfoError';
                leftMes = 'Lấy thông tin ';
                rightMes = ' thất bại';
                break;
            default:
                midMes = 'Không tồn tại loại check này';
                break;
        }

        detail.message = `${leftMes}${midMes}${rightMes}!`;
        console.log(detail);


        if (!error)
            return new ApiErrors.BaseError({
                statusCode: 202,
                ...detail,
                error
            })

        return ErrorHelpers.errorReject(error, detail.type, '', 202, detail.message);
    }

    /**
     *
     * @param {*} infoCheck
     * @param {*} error
     */
    static createErrorCheck(infoCheck, error) {
        const { typeCheck, modelStructure } = infoCheck;
        const detail = {};
        let leftMes = '',
            midMes = '',
            rightMes = '';

        switch (typeCheck) {
            case TYPE_CHECK.CHECK_DUPLICATE:
                detail.type = 'crudExisted';
                // leftMes = 'Đã tồn tại ';
                rightMes = ' đã tồn tại';
                break;
            case TYPE_CHECK.CHECK_EXISTS:
                detail.type = 'crudNotExisted';
                rightMes = ' không tồn tại';
                break;
            case TYPE_CHECK.GET_INFO:
                detail.type = 'getInfoError';
                leftMes = 'Lấy thông tin ';
                rightMes = ' thất bại';
                break;
            default:
                midMes = 'Không tồn tại loại check này';
                break;
        }

        if (modelStructure) {
            if (modelStructure.child) {
                midMes = modelStructure.child.reduce((mess, e, i) => {
                    return i === 0 ? viMessage[e] : ' và ' + viMessage[e] + mess;
                }, '');

                // midMes = ' trong ' + midMes;
                midMes = ' chứa ' + midMes + ' này';
                // ex: Quảng cáo chứa tên quảng cáo này đã tồn tại
            }
            if (modelStructure.parent)
                midMes = viMessage[modelStructure.parent] + midMes;
        } else {
            midMes = 'Bản ghi này' + midMes;
        }

        detail.message = `${leftMes}${midMes}${rightMes}!`;
        console.log(detail);

        if (!error)
            return new ApiErrors.BaseError({
                statusCode: 202,
                ...detail,
                error
            })

        return ErrorHelpers.errorThrow(error, detail.type, '', 202, detail.message);
    }

    /**
     *
     * @param {*} arr
     * @param {*} options
     */
    static createMidMessWithOptions(arr, options) {

        return arr.reduce((mess, e, i) => {
            if (!Array.isArray(e)) {
                return i === 0 ? viMessage[e] : mess + ` ${options.shift()} ` + viMessage['api.' + e];
            } else return i === 0 ? PreCheckHelpers.createMidMessWithOptions(e, options) : mess + ` ${options.shift()} ` + PreCheckHelpers.createMidMessWithOptions(e, options);
        }, '');
    }

    /**
     *
     * @param {*} arr
     */
    static createMidMess(arr) {

        return arr.reduce((mess, e, i) => {
            if (!Array.isArray(e)) {
                return i === 0 ? viMessage[e] : mess + ` và ` + viMessage[e];
            } else return i === 0 ? PreCheckHelpers.createMidMess(e) : mess + ` chứa ` + PreCheckHelpers.createMidMess(e);
        }, '');
    }

    /**
     *
     * @param {*} auth
     * @param {*} hospitalsId
     */
    static async isAuthenPlaces(auth, hospitalsId) {
        const userInfo = await PreCheckHelpers.getInfoUser(auth).catch(error => {
            ErrorHelpers.errorThrow(error, 'permisionInfoError', 'Login', 202)
        });

        const hospitalsIds = userInfo.hospitals.map(e => Number(e.id));

        return Array.from(hospitalsIds).map(Number).indexOf(Number(hospitalsId)) !== -1;
    }



    /**
     *
     * @param {*} auth
     * @param {*} hospitalsId
     */
    static async getAuthPlacesId(auth, hospitalsId) {
        const userInfo = await PreCheckHelpers.getInforUser(auth);
        const hospitalsIds = userInfo.hospitals.map(e => Number(e.id));

        if (!hospitalsId) return hospitalsIds;

        let inPlacesIds = hospitalsId;

        if (typeof hospitalsId === 'string') inPlacesIds = hospitalsId.split(',');

        inPlacesIds = hospitalsId['$in'] || _.concat([], inPlacesIds).map(e => parseInt(e));
        const authPlacesId = _.intersection(hospitalsIds, inPlacesIds);

        // console.log("hospitalsIds:", hospitalsIds);
        // console.log("hospitalsId:", hospitalsId);
        // console.log("inPlacesIds:", inPlacesIds);
        // console.log("intersection:", authPlacesId);

        return authPlacesId;
    }

    // static async getInfoPlace(auth, hospitalsId) {

    // }

    /**
     *
     */
    static main() {
        const midMes = PreCheckHelpers.createMidMess(['adsType.name', ['adsType.name', 'adsType.name']], ['chứa', 'và']);

        console.log(midMes);
    }

}

// PreCheckHelpers.main();