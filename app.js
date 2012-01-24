
/**
 * Module dependencies.
 */

var express  = require('express'),
    mongoose = require('mongoose'),
    io       = require('socket.io'),
    ntwitter = require('ntwitter'),
    routes   = require('./routes')

var app = module.exports = express.createServer();

// Configure credentials

var twit = new ntwitter({
  consumer_key: 'KnGiKFvB6gXfN5KOSLHCCw',
  consumer_secret: 'KhHKGcOOXMN87eY0pu4T2vR391bXPKblZE1zer7dN6o',
  access_token_key: '12549842-HTsOUfKJaHmKcBmY6nrGz5Tg2XlnjrLRJduuhYvTE',
  access_token_secret: 'zoBir6DIy8I0N56FPvi4n1f1TASQkjuQZQgpvqoM8'
});

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);

// Wrap socket.io in app

io.listen(app);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
