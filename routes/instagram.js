exports.create =function(req,res){
  //respond to the Instagram Server to create subscription
  console.log("Got Create Request")
  console.log(req.query)
  res.send(req.query['hub.challenge'])
}

exports.consume = function(Database){
  //receives updates from Instagram
  return function(req,res){

  }
}
