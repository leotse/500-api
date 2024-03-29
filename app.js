//////////////////////////
// 500 Main Entry Point //
//////////////////////////


// dependencies
var express = require('express')
  , http = require('http')
  , path = require('path')
  , RedisStore = require('connect-redis')(express)
  , routes = require('./routes')
  , auth = require('./routes/auth')
  , config = require('./config')
  , app = express();


// configurations
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('some-session-cookie-secret'));
  app.use(express.session({ 
    secret: 'some-redis-session-store-secret',
    store: new RedisStore({ 'host': config.redis.host, 'port': config.redis.port, 'pass': config.redis.pass }),
    cookie: { maxAge: 3600000 }
  }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


// routes
app.get('/', routes.index);
app.get('/login', auth.login);
app.get('/logout', auth.logout);
app.get('/login/callback', auth.callback);


// start server
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});