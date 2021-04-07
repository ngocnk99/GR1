import ValidateJoi, { noArguments } from '../utils/validateJoi';
import regexPattern from '../utils/regexPattern';
import viMessage from '../locales/vi';
import { sequelize } from '../db/db';

const DEFAULT_SCHEMA = {
    userId: ValidateJoi.createSchemaProp({
        number: noArguments,
        label: viMessage['api.employer.userId'],
        integer: noArguments,
    }),
    token: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage.token,
    }),
    companyName: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage['api.employer.companyName'],
    }),
    companyWebsite: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage['api.employer.companyWebsite'],

    }),
    address: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage['api.employer.address'],
        allow: ['', null],
    }),
    introduce: ValidateJoi.createSchemaProp({
        array: noArguments,
        label: viMessage['api.employer.introduce'],
        allow: ['', null],
    }),
    banner: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage['api.employer.banner'],
        allow: ['', null],
    }),
    avatar: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage['api.employer.avatar'],
        allow: ['', null],
    }),
    member: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage['api.employer.member'],
        allow: ['', null],
    })
};

export default {
    authenCreate: (req, res, next) => {
        console.log("validate authenCreate1")
            // const parentId = req.auth.userId;
        const token = req.headers["x-access-token"];
        const { companyName, companyWebsite, address, introduce, banner, avatar, member } = req.body;
        const employer = { token, companyName, companyWebsite, address, introduce, banner, avatar, member };

        const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
            token: {
                max: 1000,
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
        ValidateJoi.validate(employer, SCHEMA)
            .then((data) => {
                res.locals.body = data;
                next()
            })
            .catch(error => next({...error, message: "Định dạng gửi đi không đúng" }));
    },
    authenUpdate: (req, res, next) => {
        console.log("validate authenUpdate")
        const token = req.headers["x-access-token"];
        const { companyName, companyWebsite, address, introduce, banner, avatar, member } = req.body;
        const employer = { companyName, companyWebsite, address, introduce, banner, avatar, member, token };

        const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
            token: {
                max: 1000,
                required: noArguments,
            },
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

        ValidateJoi.validate(employer, SCHEMA)
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
            const employer = { id, userId, companyName, companyWebsite, address, introduce, banner, avatar, member };
            const SCHEMA = {
                id: ValidateJoi.createSchemaProp({
                    string: noArguments,
                    label: viMessage['api.employer.id'],
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
            ValidateJoi.validate(employer, SCHEMA)
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
    },
    authenDelete: (req, res, next) => {
        console.log("validate delete")
        const token = req.headers["x-access-token"];
        const jobker = { token };

        const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
            token: {
                max: 1000,
                required: noArguments,
            }
        });

        ValidateJoi.validate(jobker, SCHEMA)
            .then((data) => {
                res.locals.body = data;
                next()
            })
            .catch(error => next({...error, message: "Định dạng gửi đi không đúng" }));
    },
}