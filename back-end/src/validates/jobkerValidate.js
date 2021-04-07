import ValidateJoi, { noArguments } from '../utils/validateJoi';
import regexPattern from '../utils/regexPattern';
import viMessage from '../locales/vi';
import { sequelize } from '../db/db';

const DEFAULT_SCHEMA = {
    userId: ValidateJoi.createSchemaProp({
        number: noArguments,
        label: viMessage['api.jobker.userId'],
        integer: noArguments,
    }),
    token: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage.token,
    }),
    academic: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage['api.jobker.academic'],
    }),
    address: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage['api.jobker.address'],
        allow: ['', null],
    }),
    jobPosition: ValidateJoi.createSchemaProp({
        array: noArguments,
        label: viMessage['api.jobker.jobPosition'],
        allow: ['', null],
    }),
    cv: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage['api.jobker.cv'],
        allow: ['', null],
    }),
    avatar: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage['api.jobker.avatar'],
        allow: ['', null],
    }),
};

export default {
    authenCreate: (req, res, next) => {
        console.log("validate authenCreate")
            // const parentId = req.auth.userId;
        const token = req.headers["x-access-token"];
        const { academic, address, jobPosition, cv, avatar } = req.body;
        const jobker = { token, academic, address, jobPosition, cv, avatar };

        const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
            token: {
                max: 1000,
                required: noArguments,
            },
            academic: {
                max: 200,
            },
            address: {
                max: 200,
                required: noArguments
            },
            jobPosition: {
                max: 2000,
            },
            cv: {},
            avatar: {}
        });
        ValidateJoi.validate(jobker, SCHEMA)
            .then((data) => {
                res.locals.body = data;
                next()
            })
            .catch(error => next({...error, message: "Định dạng gửi đi không đúng" }));
    },
    authenUpdate: (req, res, next) => {
        console.log("validate authenUpdate")
        const token = req.headers["x-access-token"];
        const { companyName, academic, address, jobPosition, cv, avatar } = req.body;
        const jobker = { token, companyName, academic, address, jobPosition, cv, avatar };

        const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
            token: {
                max: 1000,
                required: noArguments,
            },
            academic: {
                max: 200,
            },
            address: {
                max: 200,
            },
            jobPosition: {
                max: 2000,
            },
            cv: {},
            avatar: {},
        });

        ValidateJoi.validate(jobker, SCHEMA)
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
            const { id, userId, academic, address, jobPosition, cv, avatar } = JSON.parse(filter);
            const jobker = { id, userId, academic, address, jobPosition, cv, avatar };
            const SCHEMA = {
                id: ValidateJoi.createSchemaProp({
                    string: noArguments,
                    label: viMessage['api.jobker.id'],
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
            ValidateJoi.validate(jobker, SCHEMA)
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