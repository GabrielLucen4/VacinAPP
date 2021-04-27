const http = require('http');
const app = require('./src/app.js');

const port = process.env.PORT || 4000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);