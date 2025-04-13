import pino from 'pino';
import dayjs from 'dayjs';

export function errorLog (contents: unknown): void {
    const date = dayjs().format('YYMMDD');
    const logger = pino({
        level: 'error',
        transport: {
            target: 'pino/file',
            options: {
                destination: `logs/error_${date}.log`,
                mkdir: true
            }
        }
    });

    logger.error(contents);
}