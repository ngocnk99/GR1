import ValidateJoi, { noArguments } from '../utils/validateJoi';
import regexPattern from '../utils/regexPattern';
import viMessage from '../locales/vi';
import { sequelize } from '../db/db';

const DEFAULT_SCHEMA = {
    username: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage['api.users.username'],
    }),
    password: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage['api.users.password'],

    }),
    email: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage['api.users.email'],
        allow: ['', null],
    }),
    roleId: ValidateJoi.createSchemaProp({
        number: noArguments,
        label: viMessage['api.users.roleId'],
        integer: noArguments,
    })
};

export default {
    authenCreate: (req, res, next) => {
        console.log("validate authenCreate")
            // const parentId = req.auth.userId;

        const { username, password, email } = req.body;
        const user = { username, password, email /*parentId*/ };

        const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
            username: {
                regex: /\w/i,
                max: 50,
                min: 6,
                required: noArguments
            },
            password: {
                min: 6,
                max: 100,
                required: noArguments
            },
            email: {
                regex: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
                max: 100,
            },
            // mobile: {
            //     regex: /^((\84|0)+(9|8|7|5|3))+([0-9]{8})\b$/i,
            //     max: 12,
            // },

        });
        ValidateJoi.validate(user, SCHEMA)
            .then((data) => {
                res.locals.body = data;
                next()
            })
            .catch(error => next({...error, message: "Định dạng gửi đi không đúng" }));
    },
    authenUpdate: (req, res, next) => {
        console.log("validate authenUpdate")

        const { email } = req.body;
        const user = { email /*parentId*/ };

        const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {

            email: {
                regex: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
                max: 100,
            },
            // mobile: {
            //     // regex: /^((\84|0)+(9|8|7|5|3))+([0-9]{8})\b$/i,
            //     max: 12,
            // },

        });

        ValidateJoi.validate(user, SCHEMA)
            .then((data) => {
                res.locals.body = data;
                next()
            })
            .catch(error => next({...error, message: "Định dạng gửi đi không đúng" }));
    },
    authenChangePass: (req, res, next) => {
        console.log("validate authenUpdate")

        const { oldPassword, newPassword } = req.body;
        const user = { oldPassword, newPassword };

        const SCHEMA = {
            oldPassword: ValidateJoi.createSchemaProp({
                string: noArguments,
                label: viMessage['api.users.oldPassword'],
                min: 6,
                max: 100,
                required: noArguments
            }),
            newPassword: ValidateJoi.createSchemaProp({
                string: noArguments,
                label: viMessage['api.users.newPassword'],
                min: 6,
                max: 100,
                required: noArguments
            }),
        }

        ValidateJoi.validate(user, SCHEMA)
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
            const { id, username, email, roleId, FromDate, ToDate } = JSON.parse(filter);
            const user = { id, username, email, roleId, FromDate, ToDate };

            console.log(user)
            const SCHEMA = {
                id: ValidateJoi.createSchemaProp({
                    string: noArguments,
                    label: viMessage['api.users.id'],
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
            ValidateJoi.validate(user, SCHEMA)
                .then((data) => {
                    if (id) {
                        ValidateJoi.transStringToArray(data, 'id');
                    }
                    if (roleId) {
                        ValidateJoi.transStringToArray(data, 'roleId');
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