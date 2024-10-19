import { IncomingMessage, ServerResponse } from 'node:http';
import { handleUsersRequest } from './routes/userRoutes';

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
    handleUsersRequest(req, res)
};

export default requestListener;