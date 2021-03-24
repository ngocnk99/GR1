import ValidateJoi, { noArguments } from '../utils/validateJoi';
import regexPattern from '../utils/regexPattern';
import viMessage from '../locales/vi';
import { sequelize } from '../db/db';

const DEFAULT_SCHEMA = {
    userId: ValidateJoi.createSchemaProp({
        number: noArguments,
        label: viMessage['api.employerProfile.userId'],
        integer: noArguments,
    }),
    companyName: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage['api.employerProfile.companyName'],
    }),
    companyWebsite: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage['api.employerProfile.companyWebsite'],

    }),
    address: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage['api.employerProfile.address'],
        allow: ['', null],
    }),
    introduce: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage['api.employerProfile.introduce'],
        allow: ['', null],
    }),
    banner: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage['api.employerProfile.banner'],
        allow: ['', null],
    }),
    avatar: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage['api.employerProfile.avatar'],
        allow: ['', null],
    }),
    member: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage['api.employerProfile.member'],
        allow: ['', null],
    })
};

export default {
    authenCreate: (req, res, next) => {
        console.log("validate authenCreate")
            // const parentId = req.auth.userId;
        const { userId, companyName, companyWebsite, address, introduce, banner, avatar, member } = req.body;
        const employerProfile = { userId, companyName, companyWebsite, address, introduce, banner, avatar, member };

        const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
            userId: {
                max: 400,
                required: noArguments,
            },
            companyName: {
                max: 200,
                required: noArguments
            },
            companyWebsite: {
                max: 200,
            },
            address: {
                max: 200,
                required: noArguments
            },
            introduce: {
                max: 2000,
            },
            banner: {},
            avatar: {},
            member: {}
        });
        ValidateJoi.validate(employerProfile, SCHEMA)
            .then((data) => {
                res.locals.body = data;
                next()
            })
            .catch(error => next({...error, message: "Định dạng gửi đi không đúng" }));
    },
    authenUpdate: (req, res, next) => {
        console.log("validate authenUpdate")

        const { companyName, companyWebsite, address, introduce, banner, avatar, member } = req.body;
        const employerProfile = { companyName, companyWebsite, address, introduce, banner, avatar, member };

        const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
            companyName: {
                max: 200,
            },
            companyWebsite: {
                max: 200,
            },
            address: {
                max: 200,
            },
            introduce: {
                max: 2000,
            },
            banner: {},
            avatar: {},
            member: {}

        });

        ValidateJoi.validate(employerProfile, SCHEMA)
            .then((data) => {
                res.locals.body = data;
                next()
            })
            .catch(error => next({...error, message: "Định dạng gửi đi không đúng" }));
    },
    authenFilter: (req, res, next) => {
        console.log("validate authenFilter")
        const { filter, sort, range } = req.query;

        res.locals.sort = sort ? JSON.parse(sort).map((e, i) => i === 0 ? sequelize.literal(`\`${e}\``) : e) : ["id", "asc"];
        res.locals.range = range ? JSON.parse(range) : [0, 49];

        if (filter) {
            const { id, userId, companyName, companyWebsite, address, introduce, banner, avatar, member } = JSON.parse(filter);
            const employerProfile = { id, userId, companyName, companyWebsite, address, introduce, banner, avatar, member };
            const SCHEMA = {
                id: ValidateJoi.createSchemaProp({
                    string: noArguments,
                    label: viMessage['api.employerProfile.id'],
                    regex: regexPattern.listIds
                }),
                ...DEFAULT_SCHEMA,
                FromDate: ValidateJoi.createSchemaProp({
                    date: noArguments,
                    label: viMessage.FromDate,
                }),
                ToDate: ValidateJoi.createSchemaProp({
                    date: noArguments,
                    label: viMessage.ToDate,
                }),
            };

            // console.log('input: ', input);
            ValidateJoi.validate(employerProfile, SCHEMA)
                .then((data) => {
                    if (id) {
                        ValidateJoi.transStringToArray(data, 'id');
                    }
                    if (userId) {
                        ValidateJoi.transStringToArray(data, 'userId');
                    }
                    res.locals.filter = data;
                    console.log('locals.filter', res.locals.filter);
                    next();
                })
                .catch(error => {
                    next({...error, message: "Định dạng gửi đi không đúng" })
                });
        } else {
            res.locals.filter = {};
            next()
        }
    }
}