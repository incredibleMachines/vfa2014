console.log(fellows)

var visualQueue=[],
	visualIterator

var fellowQueue=[],
	fellowIterator = 0

var socialQueue=[],
	socialIterator,
	bSocial = false,
	bSocialRan = false,
	socialQueueArchive = []

//variable to see what we played last = bFellow or bSocial
var currentState = "bSocial";

var bSponsors = false

var counter = 0;
var sponsorCounter = 0;
var sponsorImages = ["SocialScreen_Sponsors_2.jpg",
					 "SocialScreen_Sponsors_3.jpg",
					 "SocialScreen_Sponsors_4.jpg"]

$(document).ready(function(){

	var total = 0;
    var total2012 = 0
    var total2013 = 0

	// if(!fellows) console.log("ERROR NO FELLOWS")
	// else
	// for(year in fellows){
	// 	console.log(fellows[year])
	// 	if(fellows[year].hasOwnProperty("cities")){
	// 		for(var c = 0; c<fellows[year].cities.length;c++){
	// 			//console.log(fellows[year].cities[c].city)
	// 			//console.log(fellows[year].cities[c].people.length)
	// 			//console.log(fellows[year].cities[c].city)
	// 			//console.log(fellows[year].cities[c].people.length)
	// 			if(year =="2012") total2012 += fellows[year].cities[c].people.length
	// 			if(year =="2013") total2013 += fellows[year].cities[c].people.length
	// 			total += fellows[year].cities[c].people.length
	// 			for(var i = 0; i< fellows[year].cities[c].people.length; i++){
	// 				console.log(fellows[year].cities[c].people[i].name)
	// 				fellows[year].cities[c].people[i].year = year
	// 				fellows[year].cities[c].people[i].city = fellows[year].cities[c].city
	// 				fellowQueue.push(fellows[year].cities[c].people[i])
	// 			}
	// 		}
	// 	}else{
	// 		total += fellows[year].people.length
	// 		for(var i = 0; i< fellows[year].people.length; i++){
	// 			console.log(fellows[year].people[i].name)
	// 			fellows[year].people[i].year = year
	// 			fellowQueue.push(fellows[year].people[i])
	// 		}
	// 	}
	// }
	// console.log(total)
	// console.log("2012 "+total2012 )
	// console.log("2013 "+total2013 )
	// console.log("2014 "+fellows["2014"].people.length)
	// //setInterval(run, 300)

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

		if(currentState == 'bFellow')
		 	html = formatFellowHtml(fellowQueue[fellowIterator])
		else if(socialQueue.length > 0){
			html = formatSocialHtml(section,socialQueue[0])
			console.log("DISPLAY TWEET")
			bSocialRan=true
		}
		else
			// html = formatFellowHtml(fellowQueue[fellowIterator])
			html = formatSponsor(section)



		section.addClass('content')
				.append(html)
				.appendTo("section#main")
				.offset({left: "-1200"})
				.animate({left:"500"},{
				    duration: 2000,//2000
				    specialEasing: {
				      width: "easeOutSine"
				    },
				    complete: function() {

				    /*if(socialQueue.length > 0 && currentState == 'bSocial'){

				    }else*/ setTimeout(function(){ easeOut(section) },2500)//2500

				    }
				  })
}
function easeOut(section){
	console.log("EASE OUT");
	section.animate({left:window.innerWidth.toString()},{
					      	duration: 5000,//5000
						    specialEasing: {
						      width: "easeOutQuad"
						    },complete: function(){
						    	//if(bSocial && !bSocialRan) bSocialRan = true
							    finish(section)
						    }
				      })
}
function finish(section){
	//console.log(counter)
	section.remove()
	iterate()
	console.log("Last State: "+ currentState)
	// if(bSponsors == false){
	// 	//set our current state to toggle if we have media
	// 	// currentState = (currentState == "bFellow" && bSocial == true && socialQueue.length > 0 ) ? "bSocial" : "bFellow";
	// 	//check the status of bSocial
	// 	bSocial = (socialQueue.length > )? true : false;
	// 	console.log("Current State: "+ currentState)
	// }else bSponsors = false
	//
	// if(counter > 0) bSponsors = true
	// else bSponsors = false
	//if(bSocial == true && bSocialRan ==true) bSocialRan = bSocial = false
	run()
}
function iterate(){
	counter++;
	if(currentState == "bFellow") fellowIterator = (fellowIterator < fellowQueue.length-1 )?  fellowIterator+1 : 0
	else if(bSocialRan==true) socialIteratorHandle()
}
function socialIteratorHandle(){
	//shift first item in array push item into archive array
	console.log(socialQueue.length)
	if(socialQueue.length>0) socialQueueArchive.push(socialQueue.shift())
	bSocialRan=false
	console.log(socialQueue.length)
}
function formatFellowHtml(fellow){
	var name = returnFullName(fellow.name)
	var color = (fellowIterator % 2 == 0)? 'red':'blue'
	var html = '<img class="fellow '+fellow.year+'" src="/imgs/'+fellow.image+'">'
		html+= '<h1 class="fellow '+fellow.year+' '+color+'"><em>'+name.first+'</em>'+name.last+'</h1>'
		switch(fellow.year){
			case "2012":
			html+='<p class="fellow company large '+fellow.year+' '+color+'">'+fellow.company+'</p>'
			html+='<p class="fellow year '+fellow.year+'  '+color+'">'+fellow.year+' <em>'+fellow.city+'</em></p>'
			html+= '<p class="fellow school small '+fellow.year+'">'+fellow.school+'</p>'

			break;
			case "2013":
			html+='<p class="fellow company large '+fellow.year+' '+color+'">'+fellow.company+'</p>'
			html+='<p class="fellow year '+fellow.year+' '+color+'"><em>'+fellow.year+'</em> '+fellow.city+'</p>'
			html+= '<p class="fellow school small '+fellow.year+'">'+fellow.school+'</p>'

			break;
			case "2014":
				html+= '<p class="fellow school '+fellow.year+'">'+fellow.school+'</p>'
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
	var bHasImage = false

	if(social.image!='') bHasImage = true
	var color = (fellowIterator % 2 == 0)? 'red':'blue'

	if(bHasImage == false)
		var article = $('<article></article>').appendTo(section).addClass('social').addClass('user').addClass('just-text')
	else
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
	if(bHasImage == false){
	$('<h1></h1>').html(social.user.name+'<em> @'+social.user.username+'</em>')
				  .addClass('social')
				  .addClass('user')
				  .addClass('just-text')
				  .addClass(color)
				  .appendTo(article)


	$('<p></p>').html(social.text)
				.addClass('social')
				.addClass('text')
				.addClass('just-text')
				.addClass(color)
				.appendTo(article)

	}else{
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
	}


	if(social.image!=''){
		 var holder = $('<article></article>').addClass('social').addClass('image').addClass('holder').prependTo(section)

		 if(social.type =='instagram')
		 	$('<img/>').attr('src',social.image).addClass('social').addClass('image').prependTo(holder)
		 else
		 	$('<img/>').attr('src',social.image.src).addClass('social').addClass('image').prependTo(holder)
	}



	return ''
}

function formatSponsor(section){

	$('<img/>').attr('src','/imgs/'+sponsorImages[sponsorCounter]).addClass('sponsor').prependTo(section)



	sponsorCounter = (sponsorCounter<sponsorImages.length-1)? sponsorCounter+1: 0
}
function returnFullName(string){
	var split = string.split(/ (.+)?/)
	var name = {first: split[0], last: split[1] }
	return name;
}
//var FellowBlock = $('<section></section>').
