const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

// Get our API routes
const api = require('./server/routes/api');

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// static path to dist
app.use(express.static(path.join(__dirname, 'dist/WebsocketsDemo')));

// Setting api routes
app.use('/api', api, (req,res) => {
  io.emit('dataDirty', res.locals.newData);
});

// Catching all other routes and returning the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/WebsocketsDemo/index.html'));
});

/**
 * Get port from environment and storing in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Creating HTTP server.
 */
const server = http.createServer(app);

// Setting up WebSockets
const socketIO = require('socket.io');
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log("connected socket:" + " " + socket);
});


/**
 * Listening on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));