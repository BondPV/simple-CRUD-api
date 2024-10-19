import { IncomingMessage, ServerResponse } from 'node:http';
import { addUser, getAllUsers, getUser } from '../controllers/userController';

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

        case 'POST':
            if (url === '/api/users') {
                await addUser(req, res);

                return;
            } 

        default:
            res.statusCode = 404;
            res.end(JSON.stringify({ message: 'Not Found' }));
    }
};
