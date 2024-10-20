import { createServer, request } from 'node:http';

export const createBalancer = (port: number, workersCount: number) => {
    let currentWorker = 0;
    const workers = Array.from({ length: workersCount }, (_, index) => port + index + 1);

    const balancerServer = createServer((req, res) => {
        try {
            const workerPort = workers[currentWorker];
            const workerUrl = `http://localhost:${workerPort}${req.url}`;

            console.log(`🔄 Routing request to worker on port: ${workerPort} for URL: ${req.url}`);

            const workerRequest = new URL(workerUrl);
            const options = {
                hostname: "localhost",
                port: workerPort,
                path: workerRequest.pathname,
                method: req.method,
                headers: req.headers,
            };

            const workerClient = request(options, (proxyRes) => {
                const statusCode = proxyRes.statusCode || 500;
                res.writeHead(statusCode, proxyRes.headers);

                console.log(`✅ Worker on port ${workerPort} responded with status code: ${statusCode} for URL: ${req.url}`);

                proxyRes.pipe(res, { end: true });
            });

            workerClient.on("error", (error) => {
                console.error(`❌ Error sending request to ${workerUrl}: ${error.message}`, error);

                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal Server Error' }));
            });

            req.pipe(workerClient);
        
            currentWorker = (currentWorker + 1) % workers.length;
        } catch (error) {
            console.error('⚠️ Unexpected error occurred:', error);

            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal Server Error' }));
        }
    });
    
    
    balancerServer.listen(port, () => {
        console.log(`🚀 Balancer server started on port ${port}`);
    });
};
