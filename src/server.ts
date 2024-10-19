import { createServer } from 'node:http';
import dotenv from 'dotenv';
import requestListener from './app';

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = createServer(requestListener);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

server.on('error', (error: Error) => {
    console.error(`Server failed to start: ${error.message}`);
});
