/**
 *
 *  Instagram Module
 *
 */
 var keys = require('../modules/Keys'),
  	 https = require('https'),
  	 request = require('request'),
  	 querystring = require('querystring'),
  	 _ = require('underscore')

 var Subscriptions = {}

 function createSubscription(data,cb){
	 var url = "https://api.instagram.com/v1/subscriptions";
	 data.client_secret=keys.Instagram.client_secret
	 data.client_id = keys.Instagram.client_id
  //  data.verify_token = "myVerifyToken"
  //  data.object = tag
  //  data.object_id="incmachinesdev"
  //  callback_url="https://www.incrediblemachines.net"
	 //url += querystring.stringify(data)
	 var options = {
		 headers: {'content-type' : 'application/x-www-form-urlencoded'},
		 url: url,
		 body: querystring.stringify(data)
	 }
	 request.post(options,function(error,resp,body){
		 console.log('Completed Post')
		 //console.log(body);
		 cb(error,body)
	 })

 }
 exports.createSubscription = createSubscription

 function delete_(cb){

 	//console.log('delete')
 	var url = "https://api.instagram.com/v1/subscriptions?client_secret="+keys.Instagram.client_secret+"&object=all&client_id="+keys.Instagram.client_id
	request.del(url, function(err, response,body){
		//console.log(body)
		//console.log(err)
		cb(err,body)
	})

 }
 exports.delete_ = delete_

 function submission(_data,io){

 	for(var i =0; i<_data.length;i++){

		var data = _data[i]
	 	delete data.changed_aspect
	 	delete data.data
	 	delete data.time

	 	var object_id = data.object_id
	 	console.log("Incoming Object: ".inverse.magenta+" "+object_id)
	 	if(!Subscriptions.hasOwnProperty(object_id)){
	 		data.count = 1;
		 	Subscriptions[object_id] = data
	 	}else Subscriptions[object_id].count++

	 	if(Subscriptions[object_id].hasOwnProperty('min_tag_id')){

		 	var options = ["min_tag_id="+Subscriptions[object_id].min_tag_id]
		 	getRecentMedia(io,Subscriptions[object_id].object,Subscriptions[object_id].object_id, options)

	 	}else getRecentMedia(io,Subscriptions[object_id].object,Subscriptions[object_id].object_id)

 	}

 	//console.log(Subscriptions)

 }
 exports.submission = submission;


function getRecentMedia(io,object, object_id,options){

	var info = ''
	https.get(query(object,object_id,options),function(res){
	  //console.log("statusCode: ", res.statusCode);
	  //console.log("headers: ", res.headers);

	  res.on('data', function(d) {
	  	info+=d
	    //process.stdout.write(d);
	    //if(d.length==0) console.log("close".magenta)
	    //if(info.indexOf('\0\r\n\r\n')>-1) console.log(info)
	  });

	  res.on('close',complete)
	  res.on('end',complete)

	}).on('error', function(e) {
	  console.error(e);
	})

	function complete(){
		console.log('Got End or Close'.inverse.magenta)
		//console.log(info)
		//process our data by the next function
		processImages(io,object_id,JSON.parse(info))
	}
}

 function processImages(io,object_id,info){
	 //set the mintagid

	 Subscriptions[object_id].min_tag_id = info.pagination.min_tag_id;

	 var message = []
	 for(var i = 0; i< info.data.length;i++){
		 var obj = {
			 text: info.data[i].caption.text,
			 image: info.data[i].images.standard_resolution.url,
			 user: { username: info.data[i].user.username,
			 		 photo: (info.data[i].user.hasOwnProperty("profile_picture"))? info.data[i].user.profile_picture : '',
			 		 name: info.data[i].user.full_name
			 }
		 }

		 if(info.data.length>5) message.push(obj)
		 else io.sockets.emit('instagram', obj)

	 }

	 if(info.data.length>5) io.sockets.emit('instagram',obj)

 }
 //optional array of options
 function query(object,object_id,options){

	 this.base = 'https://api.instagram.com/v1/'
	 this.query = object+'s/'+object_id
	 this.recent = '/media/recent?'
	 this.creds = 'client_id='+keys.Instagram.client_id
     this.options = (options!=null)? '&'+options.join('&') : ''
     this.string = this.base+this.query+this.recent+this.creds+this.options
     console.log("query:".inverse+" "+ string)
     return string
 }
