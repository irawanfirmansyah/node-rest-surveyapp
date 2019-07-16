try {
    require('dotenv').config()
}
catch{
    //do nothing
}
const http = require('http');
const app = require('./app');
app.conf
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);