$(document).ready(function(){
	
	var canvas, 
		context, 
		queue = []
		
	canvas = document.getElementById('main');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
    context = canvas.getContext("2d");
    
    context.fillStyle = "rgba(255,0,0,0.8)";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    context.font = "bold 30px sans-serif";
    context.fillStyle = "rgba(255,255,255,0.8)";
	context.fillText("x", 248, 43);
	//context.fillText("y", 58, 165);
	
	//make sure to get underscore
	var pos = {}
	pos.x =300
	pos.y=300;
	
	//text(context,pos, "This is my text")
	
	var socket = io.connect(document.location.hostname)
	
	socket.on('instagram', function (data) {
    	console.log(data);
		//socket.emit('my other event', { my: 'data' });
	})
	
	socket.on('twitter',function(data){
		console.log(data)
		//makeNewDrawable()
		
	})
	
})
/*var obj = {
			 text: info.data[i].caption.text,
			 image: info.data[i].images.standard_resolution.url,
			 user: { username: info.data[i].user.username,
			 		 photo: info.data[i].user.profile_photo,
			 		 name: info.data[i].user.full_name				 
			 }
		 }
*/
function Drawable(canvas,context,data){
	
	
	this.update = function(cb){
		this.pos.x++;
		this.pos.y++;
		this.age++;
		cb()
	}
	this.draw = function(){
		context.fillText(text,this.pos.x,this.pos.y)	
	}
	this.age = 0
	this.pos = {x:Math.random()*canvas.width,y:Math.random()*canvas.height}
	
}

function text(context, pos, text){
	
	
	console.log(pos)
	context.fillStyle = "rgba(255,255,255,0.8)";
	context.fillText(text,pos.x,pos.y)
	
}

