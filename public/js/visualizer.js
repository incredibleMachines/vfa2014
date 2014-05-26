console.log(fellows)

var visualQueue=[],
	visualIterator

var fellowQueue=[],
	fellowIterator = 0
	
var socialQueue=[],
	socialIterator,
	bSocial = false,
	socialQueueArchive = []

//variable to see what we played last = bFellow or bSocial
var currentState = "bFellow";
	
$(document).ready(function(){


    
	if(!fellows) console.log("ERROR NO FELLOWS")
	else
	for(year in fellows){
		//console.log(fellows[year])
		if(fellows[year].hasOwnProperty("cities")){
			for(var c = 0; c<fellows[year].cities.length;c++){
				console.log(fellows[year].cities[c].city)
				for(var i = 0; i< fellows[year].cities[c].people.length; i++){
					//console.log(fellows[year].cities[c].people[i])
					fellows[year].cities[c].people[i].year = year
					fellows[year].cities[c].people[i].city = fellows[year].cities[c].city
					fellowQueue.push(fellows[year].cities[c].people[i])
				}
			}
		}else{
			for(var i = 0; i< fellows[year].people.length; i++){
				//console.log(fellows[year].people[i])
				fellows[year].people[i].year = year
				fellowQueue.push(fellows[year].people[i])
			}
		}
	}
	
	//setInterval(run, 300)
	
	var socket = io.connect(document.location.hostname)
	socket.on('instagram', function (data) {
		data.type = 'instagram'
		console.log("Incoming Instagram Message | Size: %s",data.length)
    	console.log(data);
    	socialQueue.push(data)

    	bSocial=true
	})
	socket.on('twitter',function(data){
		data.type = 'twitter'
		console.log("Incoming Twitter Message")
		console.log(data)
		
		//preload our images
		var cb_count=0,
			cb_total=0;
			
		if(data.image != '') cb_total++
		
		if(data.user.hasOwnProperty('photo')) if(data.user.photo != '') cb_total++
		
		if(data.image != ''){
				cb_count++
			var tempImage = new Image()
				tempImage.src = data.image
				
				data.image = tempImage
				ImageCallback(data,cb_total,cb_count)
		}
		if(data.user.hasOwnProperty('photo')){
			if(data.user.photo != ''){
				cb_count++
			var tempProfileImage = new Image()
				tempProfileImage.src = data.user.photo
				
				data.user.photo = tempProfileImage
				ImageCallback(data,cb_total,cb_count)
			}
		}
		
		//socialQueue.push(data)
		//bSocial=true
	})
	run()
})

function ImageCallback(data,cb_total,cb_count){
	console.log("Image Callback")
	
	if(cb_total == cb_count){
		console.log("cb Match")
		socialQueue.push(data)
		bSocial = true
	}else{
		console.log("cb_total: %s cb_count: %s",cb_total,cb_count)
	}
}

function run(){

	var html;
	var section = $('<section></section>')
	
	//check what html to populate
	//extra saftey check on socialQueue.length for safety							  
	if(currentState == 'bFellow'){
	 	html = formatFellowHtml(fellowQueue[fellowIterator])
	}else if(socialQueue.length > 0 && currentState == 'bSocial'){
		html = formatSocialHtml(section,socialQueue[0])
	}else{
		html = formatFellowHtml(fellowQueue[fellowIterator])
	}
	
		
		section.addClass('content')
				.append(html)
				.appendTo("section#main")
				.offset({left: "-800"})
				.animate({left:"500"},{
				    duration: 2000,
				    specialEasing: {
				      width: "easeOutSine"
				    },
				    complete: function() {
				     
				     
				    setTimeout(function(){ easeOut(section) },1000)
 					 
					  
			
				    }
				  })
}
function easeOut(section){
	console.log("EASE OUT");
	section.animate({left:window.innerWidth.toString()},{
					      	duration: 5000,
						    specialEasing: {
						      width: "easeOutQuad"
						    },complete: function(){
						    	//if(bSocial && !bSocialRan) bSocialRan = true
							    finish(section)
						    }
				      })
}
function finish(section){
	section.remove()
	iterate()
	console.log("Last State: "+ currentState)
	//set our current state to toggle if we have media 
	currentState = (currentState == "bFellow" && bSocial == true && socialQueue.length > 0 ) ? "bSocial" : "bFellow";
	//check the status of bSocial
	bSocial = (socialQueue.length > 1)? true : false;
	console.log("Current State: "+ currentState)

	//if(bSocial == true && bSocialRan ==true) bSocialRan = bSocial = false
	run()
}
function iterate(){
	if(currentState == "bFellow") fellowIterator = (fellowIterator < fellowQueue.length-1 )?  fellowIterator+1 : 0
	else socialIteratorHandle() 
}
function socialIteratorHandle(){
	//shift first item in array push item into archive array
	console.log(socialQueue.length)
	if(socialQueue.length>0) socialQueueArchive.push(socialQueue.shift())
	console.log(socialQueue.length)
}
function formatFellowHtml(fellow){
	var name = returnFullName(fellow.name)
	var color = (fellowIterator % 2 == 0)? 'red':'blue'
	var html = '<img class="fellow '+fellow.year+'" src="/imgs/'+fellow.image+'">'
		html+= '<h1 class="fellow '+fellow.year+' '+color+'"><em>'+name.first+'</em>'+name.last+'</h1>'
		html+= '<p class="fellow school '+fellow.year+'">'+fellow.school+'</p>'
		switch(fellow.year){
			case "2012":
			html+='<p class="fellow year '+fellow.year+'  '+color+'"><em>'+fellow.city+'</em> ALUMNUS '+fellow.year+'</p>'
			html+='<p class="fellow company '+fellow.year+' '+color+'">'+fellow.company+'</p>'
			break;
			case "2013":
			html+='<p class="fellow year '+fellow.year+' '+color+'"><em>'+fellow.year+'</em> '+fellow.city+'</p>'
			html+='<p class="fellow company '+fellow.year+' '+color+'">'+fellow.company+'</p>'
			break;
			case "2014":
				html+='<p class="fellow year '+fellow.year+' '+color+'"><em>'+fellow.year+'</em> FELLOW</p>'
			break;
		}
	return html
}
//sample events
/*			 text: text,
			 type: ,
			 image: url,
			 user: { username: username,
			 		 photo: .profile_photo,
			 		 name: .full_name				 
			 }*/
			 
function formatSocialHtml(section,social){
	//console.log(social)
	
	var color = (fellowIterator % 2 == 0)? 'red':'blue'
	
	var article = $('<article></article>').appendTo(section).addClass('social').addClass('user')
	console.log(social.user.photo)
	if(social.type == 'instagram')
		$('<img/>').attr('src',social.user.photo).appendTo(article).addClass('social').addClass('user')		
	else
		$('<img/>').attr('src',social.user.photo.src).appendTo(article).addClass('social').addClass('user')	
/*
	$('<img/>').attr("src",social.user.photo.src)
			   .appendTo(article)
			   .addClass('social')
			   .addClass('user')
*/
			   
	$('<h1></h1>').html(social.user.name+'<em> @'+social.user.username+'</em>')
				  .addClass('social')
				  .addClass('user')
				  .addClass(color)
				  .appendTo(article)
							
							
	$('<p></p>').html(social.text)
				.addClass('social')
				.addClass('text')
				.addClass(color)
				.appendTo(article)
	
	
	
	if(social.image!=''){
		 var holder = $('<article></article>').addClass('social').addClass('image').addClass('holder').prependTo(section)
		 
		 if(social.type =='instagram')
		 	$('<img/>').attr('src',social.image).addClass('social').addClass('image').prependTo(holder)
		 else
		 	$('<img/>').attr('src',social.image.src).addClass('social').addClass('image').prependTo(holder)
	}
	

	
	return ''	
}

function returnFullName(string){
	var split = string.split(/ (.+)?/)
	var name = {first: split[0], last: split[1] }
	return name;
}
//var FellowBlock = $('<section></section>').