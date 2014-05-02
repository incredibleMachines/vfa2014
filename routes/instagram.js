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

exports.consume = function(Database,Instagram){
  //receives updates from Instagram
  return function(req,res){
  		console.log("New Subscription Post:".inverse.green)
	  	console.log(req.body)
	  	res.send('')
  }
}
