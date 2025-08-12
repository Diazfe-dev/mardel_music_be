import winston from 'winston';
import expressWinston from 'express-winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    ]
});

export const loggerMiddleware = expressWinston.logger({
    winstonInstance: logger,
    statusLevels: true
})
