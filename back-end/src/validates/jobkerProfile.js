import ValidateJoi, { noArguments } from '../utils/validateJoi';
import regexPattern from '../utils/regexPattern';
import viMessage from '../locales/vi';
import { sequelize } from '../db/db';

const DEFAULT_SCHEMA = {
    userId: ValidateJoi.createSchemaProp({
        number: noArguments,
        label: viMessage['api.jobkerProfile.userId'],
        integer: noArguments,
    }),
    academic: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage['api.jobkerProfile.academic'],
    }),
    address: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage['api.jobkerProfile.address'],
        allow: ['', null],
    }),
    jobPosition: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage['api.jobkerProfile.jobPosition'],
        allow: ['', null],
    }),
    cv: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage['api.jobkerProfile.cv'],
        allow: ['', null],
    }),
    avatar: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage['api.jobkerProfile.avatar'],
        allow: ['', null],
    }),
};

export default {
    authenCreate: (req, res, next) => {
        console.log("validate authenCreate")
            // const parentId = req.auth.userId;

        const { userId, academic, address, jobPosition, cv, avatar } = req.body;
        const jobkerProfile = { userId, academic, address, jobPosition, cv, avatar };

        const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
            userId: {
                max: 400,
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
        ValidateJoi.validate(jobkerProfile, SCHEMA)
            .then((data) => {
                res.locals.body = data;
                next()
            })
            .catch(error => next({...error, message: "Định dạng gửi đi không đúng" }));
    },
    authenUpdate: (req, res, next) => {
        console.log("validate authenUpdate")

        const { companyName, academic, address, jobPosition, cv, avatar } = req.body;
        const jobkerProfile = { companyName, academic, address, jobPosition, cv, avatar };

        const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
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

        ValidateJoi.validate(jobkerProfile, SCHEMA)
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
            const jobkerProfile = { id, userId, academic, address, jobPosition, cv, avatar };
            const SCHEMA = {
                id: ValidateJoi.createSchemaProp({
                    string: noArguments,
                    label: viMessage['api.jobkerProfile.id'],
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
            ValidateJoi.validate(jobkerProfile, SCHEMA)
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