import { IncomingMessage, ServerResponse } from 'http';
import { getUserById, getUsers } from '../models/user';
import { validate } from 'uuid';

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
