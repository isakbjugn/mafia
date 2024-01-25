var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Store clients
let clients = [];

// Middleware for setting SSE headers
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  next();
});

// SSE endpoint
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send a keep-alive message to prevent the connection from closing
  const keepAlive = setInterval(() => {
    res.write(': keep-alive\n\n');
  }, 30000);

  // Add this client to the clients array
  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res
  };
  clients.push(newClient);

  // Remove this client from the array when the connection is closed
  req.on('close', () => {
    clearInterval(keepAlive);
    clients = clients.filter(client => client.id !== clientId);
  });
});

// Function to send an event to all connected clients
function sendEventToAllClients(data) {
  clients.forEach(client =>
    client.res.write(`data: ${JSON.stringify(data)}\n\n`)
  );
}

// Example of triggering an event (this could be in response to a duel)
app.post('/trigger-event', (req, res) => {
  const { duelResult } = req.body;
  sendEventToAllClients(duelResult);
  res.status(204).end();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
