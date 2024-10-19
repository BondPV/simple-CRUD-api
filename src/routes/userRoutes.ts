import { IncomingMessage, ServerResponse } from 'node:http';
import { parse } from 'node:url';
import { getAllUsers, getUser } from '../controllers/userController';

export const handleUsersRequest = async (req: IncomingMessage, res: ServerResponse ): Promise<void> => {
    const { method, url } = req;

    res.setHeader('Content-Type', 'application/json');

    switch (method) {
        case 'GET':
            if (url === '/api/users') {
                await getAllUsers(req, res)

                return;
            }
            
            if (url?.startsWith('/api/users/')) {
                await getUser(req, res);

                return;
            }

            res.statusCode = 404;
            res.end(JSON.stringify({ message: 'Not Found' }));

            return;

        default:
            res.statusCode = 405;
            res.end(JSON.stringify({ message: 'Method Not Allowed' }));
    }
};
