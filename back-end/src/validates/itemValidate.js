import ValidateJoi, { noArguments } from '../utils/validateJoi';
import regexPattern from '../utils/regexPattern';
import viMessage from '../locales/vi';
import { sequelize } from '../db/db';

const DEFAULT_SCHEMA = {
    name: ValidateJoi.createSchemaProp({
        string: noArguments,
        label: viMessage['api.items.name'],
    }),
};

export default {
    authenCreate: (req, res, next) => {
        console.log("validate authenCreate")
            // const usersCreatorId = req.auth.userId;

        const { name } = req.body;
        const item = { name };

        const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
            name: {
                max: 45,
                required: noArguments
            },
        });

        console.log(item)
        ValidateJoi.validate(item, SCHEMA)
            .then((data) => {
                res.locals.body = data;
                next()
            })
            .catch(error => next({...error, message: "Định dạng gửi đi không đúng" }));
    },
    authenUpdate: (req, res, next) => {
        console.log("validate authenUpdate")

        const { name } = req.body;
        const item = { name };

        const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
            name: {
                max: 45,
            },
        });

        ValidateJoi.validate(item, SCHEMA)
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
            const { id, name, FromDate, ToDate } = JSON.parse(filter);
            const item = { id, name, FromDate, ToDate };

            console.log(item)
            const SCHEMA = {
                id: ValidateJoi.createSchemaProp({
                    string: noArguments,
                    label: viMessage['api.items.id'],
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
            ValidateJoi.validate(item, SCHEMA)
                .then((data) => {
                    if (id) {
                        ValidateJoi.transStringToArray(data, 'id');
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