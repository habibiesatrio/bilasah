const { createServer } = require('http');
const next = require('next');

const app = next({ dev: false });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

process.on('unhandledRejection', (error) => {
    console.error('Unhandled rejection:', error);
    process.exit(1);
});

app.prepare()
    .then(() => {
        const server = createServer((req, res) => {
            handle(req, res);
        });

        server.listen(PORT, HOST, () => {
            console.log(`> Ready on ${HOST}:${PORT}`);
        });

        server.on('error', (error) => {
            console.error('Server error:', error);
            process.exit(1);
        });
    })
    .catch((error) => {
        console.error('Failed to prepare Next.js app:', error);
        process.exit(1);
    });