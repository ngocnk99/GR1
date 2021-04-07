/* eslint-disable global-require */
import { Sequelize } from 'sequelize';
// import fs from 'fs';
// import path from 'path';
import associate from './references';
import { sequelize } from '../db/db';
import CachedRedis from '../db/sequelize-redis';
import CONFIG from '../config';

// const basename = path.basename(__filename)
// const env = process.env.NODE_ENV || 'development'
const models = {};


const modules = [
    require('./roles'),
    require('./users'),
    require('./employer'),
    require('./jobker'),
    // require('./posts'),
    // require('./jobkerPost')
];

// Initialize models
modules.forEach(module => {
    const model = module(sequelize, Sequelize);

    console.log("model name ", model.name);
    models[model.name] = model;
});


associate(models);


if (CONFIG.CACHED_DB_RESDIS === 'true') {
    // for (const model of models) {
    for (let index = 0; index < models.length; index++) {
        const model = models[index];

        const { sequelizeRedis } = new CachedRedis().initCached();
        const cachedSeconds = Number(CONFIG.CACHED_DB_MINUTES) * 60;
        const modelCached = sequelizeRedis.getModel(model, { ttl: Number(cachedSeconds) });
        // const modelCached = model;

        models[index] = modelCached;
    }
}

models.sequelize = sequelize;
models.Sequelize = Sequelize;
models.Op = Sequelize.Op;

export default models;