import { createServer, IncomingMessage, request, RequestOptions, ServerResponse } from 'node:http';
import { logMessage, LogTypeEnum } from './utils';

export const handleWorkerDataRequest = async (req: IncomingMessage, res: ServerResponse, port: number) => {
    const options: RequestOptions = {
        hostname: "localhost",
        port: port,
        path: req.url,
        method: req.method,
        headers: req.headers,
    };

    const workerClient = request(options, (proxyRes) => {
        const statusCode = proxyRes.statusCode || 500;
        res.writeHead(statusCode, proxyRes.headers);

        proxyRes.pipe(res, { end: true });
    });

    workerClient.on('error', (error) => {
        logMessage(LogTypeEnum.warning, `Error in worker request: ${error.message}`);

        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    });

    req.pipe(workerClient, { end: true });
};

export const createBalancer = (port: number, workersCount: number) => {
    let currentWorker = 0;
    const workers = Array.from({ length: workersCount }, (_, index) => port + index + 1);

    const balancerServer = createServer(async (req, res) => {
        try {
            const workerPort = workers[currentWorker];

            logMessage(LogTypeEnum.update, `Routing request to worker on port: ${workerPort} for URL: ${req.url}`);

            await handleWorkerDataRequest(req, res, workerPort);

            currentWorker = (currentWorker + 1) % workers.length;
        } catch (error) {
            logMessage(LogTypeEnum.warning, 'Unexpected error occurred:', error);

            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal Server Error' }));
        }
    });
    
    
    balancerServer.listen(port, () => {
        logMessage(LogTypeEnum.run, `Balancer server started on http://localhost:${port}`);
    });
};
