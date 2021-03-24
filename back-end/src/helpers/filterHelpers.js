/* eslint-disable require-jsdoc */
import models from '../entity/index';

// import userModel from '../models/users';
import _ from 'lodash';
import * as ApiErrors from '../errors';
import ErrorHelpers from './errorHelpers';
import PreCheckHelpers from './preCheckHelpers';

const { sequelize, Op } = models;

const GROUP_ADMIN = 1;
const GROUP_USER = 2;

/**
 *
 * @param {*} auth
 */
async function findHospitalsIdOfUsers(auth) {
    const hospitalsUsers = await hospitalsUsersModel.findAll({
        where: {
            usersId: auth.userId
        }
    });

    return hospitalsUsers.map(e => parseInt(e.dataValues.hospitalsId)) || [];
}

/**
 *
 * @param {*} model
 * @param {*} where
 */
// eslint-disable-next-line no-unused-vars
function createIncludeNestedWithWere(model, where) {
    if (model.length === 0) return;

    if (model.length === 1) return [{
        ...model.shift(),
        required: true,
        where
    }]

    return [{
        ...model.shift(),
        required: true,
        include: createIncludeNestedWithWere(model, where)
    }]
}

/**
 *
 * @param {*} model
 */
// eslint-disable-next-line no-unused-vars
function createIncludeNested(model) {
    if (model.length === 1) return [{
        ...model.shift()
    }]

    return [{
        ...model.shift(),
        include: createIncludeNested(model)
    }]
}

export default {
    combineFromDateWithToDate: (filter, option) => {
        let whereFilter = _.assign({}, filter);

        option = option || 'createDate';

        if (filter.FromDate && filter.ToDate) {
            if (filter.FromDate > filter.ToDate) {
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    type: 'getListError',
                    name: 'filter Date Error',
                    message: 'Ngày bắt đầu lớn hơn ngày kết thúc'
                });
            }
            whereFilter = _.omit(filter, ['FromDate', 'ToDate']);
            const fromtoDateFilter = _.assign({}, {
                [option]: {
                    [Op.between]: [filter.FromDate, filter.ToDate] } })

            whereFilter = _.assign(whereFilter, fromtoDateFilter)
        } else {
            if (filter.FromDate) {
                whereFilter = _.omit(filter, ['FromDate']);
                const fromtoDateFilter = _.assign({}, {
                    [option]: {
                        [Op.gte]: filter.FromDate } })

                whereFilter = _.assign(whereFilter, fromtoDateFilter)
            }
            if (filter.ToDate) {
                whereFilter = _.omit(filter, ['ToDate']);
                const fromtoDateFilter = _.assign({}, {
                    [option]: {
                        [Op.lte]: filter.ToDate } })

                whereFilter = _.assign(whereFilter, fromtoDateFilter)
            }
        }

        return whereFilter;
    },
    makeStringFilterRelatively: (keys, filter) => {
        const keysFilter = _.pick(filter, keys);

        keys.forEach((key) => {
            let keyword = keysFilter[key];

            if ((new RegExp(/[^A-Za-z0-9]/).test(keyword))) keyword = keyword.split('').map(e => new RegExp(/[^A-Za-z0-9]/).test(e) ? "\\" + e : e).join('');

            if (keysFilter[key]) {
                keysFilter[key] = { "$like": sequelize.literal(`CONCAT('%','${keyword}','%')`) };
            }
        });

        filter = _.assign(filter, keysFilter);
    },
    getInfoAuthorization_old: async(auth, info, isHospitalOnly) => {
        /**
         * @param auth [Object] - JWT decode -> include: userId
         * @param info [Object] - include: hospitalsId if specify, userParentId
         * @param isHospitalOnly[boolean] - true if GROUP_EMPLOYEES and GROUP_ADMINSTRATOR_DRUG is the same acces resource
         * @return [Object] - list hospitalsId, userParentId, hospitalsInfomation of auth.userId
         */

        let { hospitalsId, userParentId } = info;

        /**
         * @summary Get information of User
         */
        const userInfo = await PreCheckHelpers.getInfoUser(auth).catch(error => {
            ErrorHelpers.errorThrow(error, 'permisionInfoError', 'Login', 202)
        });

        if (!userInfo) {
            ErrorHelpers.errorThrow(null, 'userNotFoundError', 'Login', 202);
        }

        /**
         * @summary combine arguments hospitalsId with userInfo above
         */
        const { groupUserId, isLienThong } = userInfo;
        const hospitalsIds = userInfo.hospitals.map(e => Number(e.id));
        let hospitalsResultInfo = userInfo.hospitals.map(e => e.dataValues);
        let hospitalsInfo = []
        let authHospitalsId = [];

        if (hospitalsId) {
            let inHospitalsIds = _.cloneDeep(hospitalsId);

            if (typeof hospitalsId === 'string') inHospitalsIds = hospitalsId.split(',');

            inHospitalsIds = hospitalsId['$in'] || _.concat([], inHospitalsIds).map(e => parseInt(e));
            authHospitalsId = _.intersection(hospitalsIds, inHospitalsIds);

            hospitalsResultInfo = _.intersectionBy(hospitalsResultInfo.map(e => ({...e, id: parseInt(e.id) })), authHospitalsId.map(e => ({ id: e })), 'id');

            // console.log("hospitalsIds:", hospitalsIds);
            // console.log("hospitalsId:", hospitalsId);
            // console.log("inHospitalsIds:", inHospitalsIds);
            // console.log("intersection:", authHospitalsId);
        }

        /**
         * @summary if isLienThong is true then return information of hospitals of this user for calling API duocquocgia
         */
        if (isLienThong) hospitalsInfo = hospitalsResultInfo;

        switch (Number(groupUserId)) {
            case GROUP_ADMIN:
                // console.log("this");
                break;
            case GROUP_USER:
                if (!isHospitalOnly)
                    userParentId = auth.userId;

                if (hospitalsId) {

                    if (authHospitalsId.length > 0) {

                        hospitalsId = { "$in": authHospitalsId };
                    } else {
                        // return whereFilter;
                        throw new ApiErrors.BaseError({
                            statusCode: 202,
                            message: 'Bạn không có quyền đối với nội dung này'
                        });
                    }
                }

                // console.log("as", hospitalsIds);
                hospitalsId = hospitalsIds ? { "$in": hospitalsIds } : "0";
                break;
            default:
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    message: 'Bạn không có quyền đối với nội dung này'
                });
        }

        // console.log(hospitalsId," ---", userParentId);
        // console.log(hospitalsInfo);

        return { hospitalsId, userParentId, hospitalsInfo }
    },
    getInfoAuthorization: async(auth, info, isHospitalOnly) => {
        /**
         * @param auth [Object] - JWT decode -> include: userId
         * @param info [Object] - include: hospitalsId if specify, userParentId
         * @return [Object] - list hospitalsId, userParentId, hospitalsInfomation of auth.userId
         */

        let { hospitalsId, userParentId } = info;
        let provincesId;
        /**
         * @summary Get information of User
         */
        const userInfo = await PreCheckHelpers.getInfoUser(auth).catch(error => {
            ErrorHelpers.errorThrow(error, 'permisionInfoError', 'Login', 202)
        });

        if (!userInfo) {
            ErrorHelpers.errorThrow(null, 'userNotFoundError', 'Login', 202);
        }

        /**
         * @summary combine arguments hospitalsId with userInfo above
         */
        const { groupUsersId, /* isLienThong */ } = userInfo;
        // const hospitalsIds = userInfo.hospitals && userInfo.hospitals.map(e => Number(e.id));
        const hospitalsIds = userInfo.hospitals && [parseInt(userInfo.hospitals.id)] || [];
        // let hospitalsResultInfo = userInfo.hospitals.map(e => e.dataValues);
        // let hospitalsInfo = []
        let authHospitalsId = [];

        if (hospitalsId) {
            let inHospitalsIds = _.cloneDeep(hospitalsId);

            if (typeof hospitalsId === 'string') inHospitalsIds = hospitalsId.split(',');

            inHospitalsIds = hospitalsId['$in'] || _.concat([], inHospitalsIds).map(e => parseInt(e));
            authHospitalsId = _.intersection(hospitalsIds, inHospitalsIds);

            // hospitalsResultInfo = _.intersectionBy(hospitalsResultInfo.map(e => ({ ...e, id: parseInt(e.id) })), authHospitalsId.map(e => ({ id: e })), 'id');

        }

        /**
         * @summary if isLienThong is true then return information of hospitals of this user for calling API duocquocgia
         */
        // if (isLienThong) hospitalsInfo = hospitalsResultInfo;

        switch (Number(groupUsersId)) {
            case GROUP_ADMIN:
                // console.log("this");
                provincesId = userInfo && userInfo.hospitalsId.provincesId && userInfo.hospitals.provincesId || '0';
                console.log(provincesId);
                break;
                // eslint-disable-next-line no-fallthrough
            case GROUP_USER:
                // eslint-disable-next-line no-case-declarations
                if (!isHospitalOnly)
                    userParentId = auth.userId;

                if (hospitalsId) {

                    if (authHospitalsId.length > 0) {

                        hospitalsId = { "$in": authHospitalsId };
                    } else {
                        throw new ApiErrors.BaseError({
                            statusCode: 202,
                            message: 'Bạn không có quyền đối với nội dung này'
                        });
                    }
                }
                console.log(hospitalsIds);
                hospitalsId = hospitalsIds ? { "$in": hospitalsIds } : "-1";
                break;
            default:
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    message: 'Bạn không có quyền đối với nội dung này'
                });
        }

        return { hospitalsId, userParentId, /* hospitalsInfo, */ provincesId }
    },
    getInfoAuthorizationDash: async(auth, info, isHospitalOnly) => {
        /**
         * @param auth [Object] - JWT decode -> include: userId
         * @param info [Object] - include: hospitalsId if specify, userParentId
         * @return [Object] - list hospitalsId, userParentId, hospitalsInfomation of auth.userId
         */

        let { hospitalsId, userParentId } = info;
        let provincesId;
        /**
         * @summary Get information of User
         */
        const userInfo = await PreCheckHelpers.getInfoUser(auth).catch(error => {
            ErrorHelpers.errorThrow(error, 'permisionInfoError', 'Login', 202)
        });

        if (!userInfo) {
            ErrorHelpers.errorThrow(null, 'userNotFoundError', 'Login', 202);
        }

        /**
         * @summary combine arguments hospitalsId with userInfo above
         */
        const { groupUsersId, /* isLienThong */ } = userInfo;
        // const hospitalsIds = userInfo.hospitals && userInfo.hospitals.map(e => Number(e.id));
        const hospitalsIds = userInfo.hospitals && [parseInt(userInfo.hospitals.id)] || [];
        // let hospitalsResultInfo = userInfo.hospitals.map(e => e.dataValues);
        // let hospitalsInfo = []
        let authHospitalsId = [];

        if (hospitalsId) {
            let inHospitalsIds = _.cloneDeep(hospitalsId);

            if (typeof hospitalsId === 'string') inHospitalsIds = hospitalsId.split(',');

            inHospitalsIds = hospitalsId['$in'] || _.concat([], inHospitalsIds).map(e => parseInt(e));
            authHospitalsId = _.intersection(hospitalsIds, inHospitalsIds);

            // hospitalsResultInfo = _.intersectionBy(hospitalsResultInfo.map(e => ({ ...e, id: parseInt(e.id) })), authHospitalsId.map(e => ({ id: e })), 'id');

        }

        /**
         * @summary if isLienThong is true then return information of hospitals of this user for calling API duocquocgia
         */
        // if (isLienThong) hospitalsInfo = hospitalsResultInfo;

        switch (Number(groupUsersId)) {
            // eslint-disable-next-line no-fallthrough
            case GROUP_USER:
                // eslint-disable-next-line no-case-declarations
                if (!isHospitalOnly)
                    userParentId = auth.userId;
                // eslint-disable-next-line no-fallthrough
            case GROUP_ADMIN:
                if (hospitalsId) {

                    if (authHospitalsId.length > 0) {

                        hospitalsId = { "$in": authHospitalsId };
                    } else {
                        throw new ApiErrors.BaseError({
                            statusCode: 202,
                            message: 'Bạn không có quyền đối với nội dung này'
                        });
                    }
                }
                console.log(hospitalsIds);
                hospitalsId = hospitalsIds ? { "$in": hospitalsIds } : "-1";
                break;
            default:
                throw new ApiErrors.BaseError({
                    statusCode: 202,
                    message: 'Bạn không có quyền đối với nội dung này'
                });
        }

        return { hospitalsId, userParentId, /* hospitalsInfo, */ provincesId }
    },
    findHospitalsIdOfUsers
}