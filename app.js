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


/**
 *
 * Custom Modules
 *
 */

var Database = require('./modules/DBConnection')
var Twitter = require('./modules/Twitter')
var Instagram = require('./modules/Instagram')


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
routes.main = require('./routes');
routes.instagram = require('./routes/instagram')

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
 *  Application Routes
 *
 */

app.get('/', routes.main.index);
app.get('/setup',routes.main.setup)
app.post('/setup',function(req,res){
	console.log(req.body)
	res.send('')
})
app.get('/instagram', routes.instagram.create )
app.post('/instagram', routes.instagram.consume(Database, Instagram) )

/**
 *
 *  Boot Server and Socket.IO
 *
 */

var server = http.createServer(app)
var io = socketIO.listen(server)

server.listen(app.get('port'), function(){
  console.log(' Express server listening on port '.inverse +' '+ app.get('port').toString().magenta);
});
