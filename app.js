
/**
 * Module dependencies.
 */

var express  = require('express'),
    mongoose = require('mongoose'),
    io       = require('socket.io'),
    ntwitter = require('ntwitter'),
    routes   = require('./routes')

var app = module.exports = express.createServer();

mongoose.connect('mongodb://localhost/ejemplo');

// Model

var Tweet = new mongoose.Schema({
  tweet: String,
  author: String,
  id: String,
  date: { type: Date, default: Date.now }
});

var TweetModel = mongoose.model('Tweet', Tweet);

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

twit.verifyCredentials(function(err, data) {
  if(err) throw new Error(err);
});

twit.stream('user', { track: "#30thingsaboutme" }, function(stream) {
  stream.on('data', function(data) {
    if(data.user) {
      var _tweet = new TweetModel({
        author: data.user.screen_name,
        tweet: data.text,
        id: data.id
      });

      _tweet.save(function(err, tweet) {
        if(err) throw new Error(err);
        io.sockets.emit('new tweet', { tweet: data.text, author: data.user.screen_name });  
      });
    }
  });
});

// Wrap socket.io in app

io = io.listen(app);

//io.disable('log level');

io.sockets.on('connection', function(socket) {
  console.log("Cliente conectado");
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
