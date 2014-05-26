//NOTES:
// Things we need to track
// #VFAparty
// #DetroitHustlesHarder


/**
 *
 *   External Module dependencies.
 *
 */

var express = require('express');
var http = require('http');
var path = require('path');
var colors = require('colors')
var socketIO = require('socket.io')
//var ImmortalNTwitter = require('immortal-ntwitter');


//Globals
var socket, io, server;


/**
 *
 * Custom Modules
 *
 */

var Database = require('./modules/DBConnection')
var Twitter = require('./modules/Twitter')
var Instagram = require('./modules/Instagram')
var Twitter = require('./modules/Twitter')


/**
 *
 *  Setup Custom Modules
 *
 */

Database.MongoConnect()

/**
 *
 *  Application Routes.
 *
 */

var routes = {}
routes.main = require('./routes/index-route');
routes.instagram = require('./routes/instagram-route')

/**
 *
 * Express Application Config
 *
 */

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use( require('less-middleware')(path.join( __dirname + '/public' ) ));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


/**
 *
 *  Boot Server, Socket.IO and Twitter Stream
 *
 */

server = http.createServer(app)
io = socketIO.listen(server)

io.configure(function () { 
  io.set("transports", ['websocket', 'xhr-polling']); 
  io.set('log level', 1);
  //io.set("polling duration", 10); 
});

server.listen(app.get('port'), function(){
  console.log(' Express server listening on port '.inverse +' '+ app.get('port').toString().magenta);
});

io.sockets.on('connection', function(socket){
	console.log('new socket connection')
})

Twitter.run(io)

/**
 *
 *  Application Routes
 *
 */

app.get('/', routes.main.index);
app.get('/setup',routes.main.setup)
app.get('/visualizer', routes.main.visualizer)

//for testing posts
app.post('/setup',function(req,res){
	console.log(req.body)
	res.send('')
})
app.get('/instagram', routes.instagram.create )
app.post('/instagram', routes.instagram.consume(Database, Instagram, io) )
app.post('/instagram/new',routes.instagram.new(Instagram))
app.delete('/instagram',routes.instagram.delete(Instagram) )

app.get('/test', function(req,res){
	res.render('test-view',{})
})

