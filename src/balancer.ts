import { createServer, IncomingMessage, request, RequestOptions, ServerResponse } from 'node:http';

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
        console.error(`⚠️ Error in worker request: ${error.message}`);

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

            console.log(`🔄 Routing request to worker on port: ${workerPort} for URL: ${req.url}`);

            await handleWorkerDataRequest(req, res, workerPort);

            currentWorker = (currentWorker + 1) % workers.length;
        } catch (error) {
            console.error('⚠️ Unexpected error occurred:', error);

            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal Server Error' }));
        }
    });
    
    
    balancerServer.listen(port, () => {
        console.log(`🚀 Balancer server started on http://localhost:${port}`);
    });
};
