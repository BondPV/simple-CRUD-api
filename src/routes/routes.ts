import { IncomingMessage, ServerResponse } from 'node:http';
import { logMessage, LogTypeEnum } from '../utils';
import { handleUsersRequest } from './userRoutes';

const requestListener = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    try {
        const { url } = req;

        if (url?.startsWith('/api/users')) {
            await handleUsersRequest(req, res);

            return;
        }

        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Endpoint not found' }));
    } catch (error) {
        logMessage(LogTypeEnum.warning, ' Unexpected error occurred:', error);

        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
};

export default requestListener;
