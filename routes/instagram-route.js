/** 
 *
 * Instagram Routes
 *	
 */
 


exports.create =function(req,res){
  //respond to the Instagram Server to create subscription
  console.log("Got Create Request")
  console.log(req.query)
  res.send(req.query['hub.challenge'])
}

exports.consume = function(Database,Instagram,io){
  //receives updates from Instagram
  return function(req,res){
  		console.log("New Subscription Post:".inverse.green)
	  	console.log(req.body)
	  	res.send('')
	  	
	  	Instagram.submission(req.body,io)
	  	
  }
}
exports.new = function(Instagram){
	return function(req,res){
		Instagram.createSubscription(req.body,function(e,body){
			if(!e) res.jsonp(JSON.stringify(body))
			else res.jsonp({error: e})
		}) 
	}
}
exports.delete = function(Instagram){

	return function(req,res){
		//console.log('Here')
		Instagram.delete_(function(e,body){
			if(!e) res.jsonp({success:200})
			else res.jsonp(500, {error:e})
		})	
	}
}
