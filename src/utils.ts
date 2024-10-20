export enum LogTypeEnum {
    info = '🎉',
    success = '✅',
    warning = '⚠️',
    error = '❌',
    exit = '🔴',
    master = '💻',
    run = '🚀',
    server = '🌐',
    update = '🔄',
} ;

export const logMessage = (type: LogTypeEnum, message: string, object?: unknown) => {
    object ?  console.log(`${type} ${message}`, object) : console.log(`${type} ${message}`);
};
