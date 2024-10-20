import dotenv from 'dotenv';
import cluster from 'node:cluster';
import { createServer } from 'node:http';
import os from 'node:os';
import requestListener from './routes/routes';
import { createBalancer, handleWorkerDataRequest } from './balancer';
import { fork } from 'node:child_process';
import { resolve } from 'node:path';

const dataBaseServer = resolve(__dirname, './dbServer.ts');

dotenv.config();

const PORT = parseInt(process.env.PORT || '4000', 10);
const USE_BALANCER = process.env.BALANCER === 'true';
const WORKERS_COUNT = os.cpus().length - 1;

const server = createServer(async (req, res) => {
    if (USE_BALANCER && cluster.isWorker) {
        await handleWorkerDataRequest(req, res, 3000);
    } else {
        requestListener(req, res);
    }
});

server.on('error', (error: Error) => {
    console.error(`⚠️ Server failed to start: ${error.message}`);
});

if (USE_BALANCER) {
    if (cluster.isPrimary) {
        console.log(`💻 Master process started with ${WORKERS_COUNT} worker processes`);

        createBalancer(PORT, WORKERS_COUNT);

        for (let i = 0; i < WORKERS_COUNT; i++) {
            const worker = cluster.fork();
            console.log(`🚀 Worker process ${worker.id} started`);
        }

        fork(dataBaseServer);

        cluster.on("exit", (worker) => {
            console.log(`🔴 Worker process ${worker.id} exited`);
        });
    } else if (cluster.worker) {
        const workerId = cluster.worker.id;
        const workerPort = PORT + workerId;

        server.listen(workerPort, () =>
            console.log(`✅ Worker process ${workerId} is running on http://localhost:${workerPort}`)
        );
    };
} else {
    server.listen(PORT, () => {
        console.log(`🌐 Server is running on http://localhost:${PORT}`);
    });
}
