import '../env';

import SequelizeRedis from 'sequelize-redis';
import redis from 'redis';
import bluebird from 'bluebird';

import CONFIG from '../config';

// Let's promisify Redis
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

/**
 *
 */
export default class {
  /**
   *
   */
  constructor() {
    if (!this._redisClient)
      this._redisClient = redis.createClient({
        host: CONFIG.CACHED_REDIS_HOST,
        port: CONFIG.CACHED_REDIS_PORT,
      });
  }

  // eslint-disable-next-line require-jsdoc
  get redisClient() {
    return this._redisClient;
  }

  // eslint-disable-next-line require-jsdoc
  set redisClient(value) {
    this._redisClient = value;
  }

  /**
   *
   */
  initCached() {
    // Define your redisClient
    let redisClient = this.redisClient;

    if (!redisClient)
      redisClient = redis.createClient({
        host: CONFIG.CACHED_REDIS_HOST,
        port: CONFIG.CACHED_REDIS_PORT,
      });

    // Let's start
    const sequelizeRedis = new SequelizeRedis(redisClient);

    return {
      sequelizeRedis
    }
  }
}
