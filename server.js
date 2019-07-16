try {
    //Use local dev environment if exists
    require('dotenv').config()
}
catch{
    //No local dev environment (assume it is deployment), then do nothing
}
const http = require('http');
const app = require('./app');
const cors = require('cors');
app.use(cors());
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);