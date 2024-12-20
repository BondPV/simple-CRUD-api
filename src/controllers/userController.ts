import { validate } from 'uuid';
import { IncomingMessage, ServerResponse } from 'node:http';
import { createUser, deleteUser, getUserById, getUsers, updateUser, UserWithoutIdType } from '../models/user';

export const getAllUsers = async (_req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const allUsers = await getUsers();

    res.statusCode = 200;
    res.end(JSON.stringify(allUsers));
};

export const getUser = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const userId = req.url?.split('/')[3] || '';
    const isIdValid = validate(userId);

    if (!userId || !isIdValid) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: 'User ID is invalid (not uuid)' }));

        return;
    }

    const user = await getUserById(userId || '');

    if (!user) {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'User not found' }));

        return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify(user));
};

export const addUser = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const { username, age, hobbies }: UserWithoutIdType = JSON.parse(body);

            if (!username || !age || !Array.isArray(hobbies)) {
                res.statusCode = 400;
                res.end(JSON.stringify({ message: 'Invalid request. Missing required fields' }));

                return;
            }

            const newUser = await createUser(username, age, hobbies);

            res.statusCode = 201;
            res.end(JSON.stringify(newUser));
        } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ massage: 'Invalid request' }));
        }
    });
};

export const modifyUser = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const userId = req.url?.split('/')[3] || '';
    const isIdValid = validate(userId);

    if (!userId || !isIdValid) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: 'User ID is invalid (not uuid)' }));

        return;
    }

    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const { username, age, hobbies }: UserWithoutIdType = JSON.parse(body);

            if (!username || !age || !Array.isArray(hobbies)) {
                res.statusCode = 400;
                res.end(JSON.stringify({ message: 'Invalid request. Missing required fields' }));

                return;
            }

            const updatedUser = await updateUser(userId, username, age, hobbies);

            if (updatedUser) {
                res.statusCode = 200;
                res.end(JSON.stringify(updatedUser));
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ message: 'User not found' }));
            }
        } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ message: 'Invalid request' }));
        }
    });
};

export const removeUser = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const userId = req.url?.split('/')[3] || '';
    const isIdValid = validate(userId);

    if (!userId || !isIdValid) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: 'User ID is invalid (not uuid)' }));

        return;
    }

    const isDeleteUser = await deleteUser(userId);

    if (isDeleteUser) {
        res.statusCode = 204;
        res.end();
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'User not found' }));
    }
};
