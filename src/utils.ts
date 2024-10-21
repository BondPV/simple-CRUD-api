export enum LogTypeEnum {
    error = '❌',
    exit = '🔴',
    success = '✅',
    run = '🚀',
    master = '💻',
    server = '🌐',
    update = '🔄',
    warning = '⚠️',
}

export const logMessage = (type: LogTypeEnum, message: string, object?: unknown): void =>
    object ? console.log(`${type} ${message}`, object) : console.log(`${type} ${message}`);
