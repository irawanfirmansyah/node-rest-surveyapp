try {
    //Import and set local environment
    require('dotenv').config();
}
catch{
    //do nothing
}
const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);