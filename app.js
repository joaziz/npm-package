const winston = require('winston');
const {ElasticsearchTransport, ElasticsearchTransformer} = require('winston-elasticsearch');

const esTransport = new ElasticsearchTransport({
    level: 'info',

    clientOpts: {node: 'http://localhost:9200'},
    transformer: (logData) => {
        const transformed = ElasticsearchTransformer(logData);
        transformed._server_id = (Math.random() * 100000).toString()
        transformed.app = (Math.random() * 100000).toString()
        transformed.id = 'customValue'
        // transformed.process_id = 'service running'
        // transformed.request_id = 'service running'

        return transformed;
    }
});
const logger = winston.createLogger({
    transports: [
        esTransport, new winston.transports.Console({ //we also log to console if we're not in production
            format: winston.format.simple()
        })
    ]
});

// Compulsory error handling
logger.on('error', (error) => {
    console.error('Error in logger caught', error);
});
esTransport.on('error', (error) => {
    console.error('Error in logger caught', error);
});
logger.log({
    "message": "Some message",
    "level": "info",
    "meta": {
        "method": "GET",
        "url": "/sitemap.xml",
    }
})