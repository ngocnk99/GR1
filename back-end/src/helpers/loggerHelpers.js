import logger from '../utils/logger';
import loggerFormat from '../utils/loggerFormat';


const TYPE = {
    CREATE: 1,
    UPDATE: 2,
    DELETE: 3
}

export default {
    logInfor: (req, res, logs) => {
        const objLogger = loggerFormat(req, res);

        logger.info('Logs ', {
            ...objLogger,
            ...logs
        });
    },
    logAxiosInfo: (response) => {
        logger.info('Logs ', {
            ...response
        });
    },
    logInfo: (req, res, logs) => {
        const objLogger = loggerFormat(req, res);

        logger.info('Logs ', {
            ...objLogger,
            ...logs
        });
    },
    logError: (req, res, error) => {
        const objLogger = loggerFormat(req, res);

        logger.error('Error', {
            ...objLogger,
            ...error
        });
    },
    logAxiosError: (error) => {
        // logger.error('Error', {
        //   ...error
        // });
        logger.error('Error',
            error
        );
    },

}