import { IncomingMessage, ServerResponse } from 'node:http';

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader('Content-Type', 'application/json');

    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Not Found' }));
};

export default requestListener;