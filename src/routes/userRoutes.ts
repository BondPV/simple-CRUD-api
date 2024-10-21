import { IncomingMessage, ServerResponse } from 'node:http';
import { addUser, getAllUsers, getUser, modifyUser, removeUser } from '../controllers/userController';

const sendNotFoundResponse = (res: ServerResponse): void => {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'Not Found' }));
};

const handleUsersGetRequest = async (url: string | undefined, req: IncomingMessage, res: ServerResponse) => {
    if (url === '/api/users') {
        await getAllUsers(req, res);
    } else if (url?.startsWith('/api/users/')) {
        await getUser(req, res);
    } else {
        sendNotFoundResponse(res);
    }
};

const handleUsersPostRequest = async (url: string | undefined, req: IncomingMessage, res: ServerResponse) => {
    if (url === '/api/users') {
        await addUser(req, res);
    } else {
        sendNotFoundResponse(res);
    }
};

const handleUsersPutRequest = async (url: string | undefined, req: IncomingMessage, res: ServerResponse) => {
    if (url?.startsWith('/api/users/')) {
        await modifyUser(req, res);
    } else {
        sendNotFoundResponse(res);
    }
};

const handleUsersDeleteRequest = async (url: string | undefined, req: IncomingMessage, res: ServerResponse) => {
    if (url?.startsWith('/api/users/')) {
        await removeUser(req, res);
    } else {
        sendNotFoundResponse(res);
    }
};

export const handleUsersRequest = async (req: IncomingMessage, res: ServerResponse) => {
    const { method, url } = req;

    res.setHeader('Content-Type', 'application/json');

    switch (method) {
        case 'GET':
            await handleUsersGetRequest(url, req, res);
            break;
        case 'POST':
            await handleUsersPostRequest(url, req, res);
            break;
        case 'PUT':
            await handleUsersPutRequest(url, req, res);
            break;
        case 'DELETE':
            await handleUsersDeleteRequest(url, req, res);
            break;
        default:
            res.statusCode = 405;
            res.end(JSON.stringify({ message: 'Method not allowed' }));
    }
};
