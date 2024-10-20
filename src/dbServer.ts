import { createServer } from 'http';
import requestListener from './routes/routes';

const DB_PORT = 3000;
const dataBaseServer = createServer(requestListener);

dataBaseServer.on('error', (error: Error) => {
    console.error(`⚠️ Data base server failed to start: ${error.message}`);
});

dataBaseServer.listen(DB_PORT, () => {
    console.log(`🎉 Data base server running on port http://localhost:${DB_PORT}`);
});
