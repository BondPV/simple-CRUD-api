import { IncomingMessage, ServerResponse } from 'node:http';
import { handleUsersRequest } from './routes/userRoutes';

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
    try {
        const { url } = req;

        if (url?.startsWith('/api/users')) {
            handleUsersRequest(req, res);

            return;
        };
        
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Endpoint not found' }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));

        console.error(error);
    }
};

export default requestListener;
