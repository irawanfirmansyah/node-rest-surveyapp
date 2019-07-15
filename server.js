const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;
const app = require('express');

const server = http.createServer(app);

server.listen(port);