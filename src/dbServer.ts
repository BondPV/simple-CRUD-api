import { createServer } from 'http';
import requestListener from './routes/routes';
import { logMessage, LogTypeEnum } from './utils';

const DB_PORT = 3000;
const dataBaseServer = createServer(requestListener);

dataBaseServer.on('error', (error: Error) => {
    logMessage(LogTypeEnum.warning, `Data base server failed to start: ${error.message}`);
});

dataBaseServer.listen(DB_PORT, () => {
    logMessage(LogTypeEnum.success, `DataBase server running on port http://localhost:${DB_PORT}`);
});
