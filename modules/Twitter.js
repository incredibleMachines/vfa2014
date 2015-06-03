var ImmortalNTwitter = require('immortal-ntwitter'),
	Keys = require('../modules/Keys');

var twitter = ImmortalNTwitter.create(Keys.Twitter);

var profanity = [
'2g1c','2 girls 1 cup','acrotomophilia','anal','anilingus','anus','arsehole','ass','asshole','assmunch','auto erotic','autoerotic','babeland','baby batter','ball gag','ball gravy','ball kicking','ball licking','ball sack','ball sucking','bangbros','bareback','barely legal','barenaked','bastardo','bastinado','bbw','bdsm','beaver cleaver','beaver lips','bestiality','bi curious','big black','big breasts','big knockers','big tits','bimbos','birdlock','bitch','black cock','blonde action','blonde on blonde action','blow j','blow job','blow your l', 'blow your load','blue waffle','blumpkin','bollocks','bondage','boner','boob','boobs','booty call','brown showers','brunette action','bukkake','bulldyke','bullet vibe','bung hole','bunghole','busty','butt','buttcheeks','butthole','camel toe','camgirl','camslut','camwhore','carpet muncher','carpetmuncher','chocolate rosebuds','circlejerk','cleveland steamer','clit','clitoris','clover clamps','clusterfuck','cock','cocks','coprolagnia','coprophilia','cornhole','cum','cumming','cunnilingus','cunt','darkie','date rape','daterape','deep throat','deepthroat','dick','dildo','dirty pillows','dirty sanchez','dog style','doggie style','doggiestyle','doggy style','doggystyle','dolcett','domination','dominatrix','dommes','donkey punch','double dong','double penetration','dp action','eat my ass','ecchi','ejaculation','erotic','erotism','escort','ethical slut','eunuch','faggot','fecal','felch','fellatio','feltch','female squirting','femdom','figging','fingering','fisting','foot fetish','footjob','frotting','fuck', '#fuck','fucking', 'fuck1ng', 'fuckin', 'fucka','fuck buttons','fudge packer','fudgepacker','futanari','g-spot','gang bang','gay sex','genitals','giant cock','girl on','girl on top','girls gone wild','goatcx','goatse','gokkun','golden shower','goo girl','goodpoop','goregasm','grope','group sex','guro','hand job','handjob','hard core','hardcore','hentai','homoerotic','honkey','hooker','hot chick','how to kill','how to murder','huge fat','humping','incest','intercourse','jack off','jail bait','jailbait','jerk off','jigaboo','jiggaboo','jiggerboo','jizz','juggs','kike','kinbaku','kinkster','kinky','knobbing','leather restraint','leather straight jacket','lemon party','lolita','lovemaking','make me come','male squirting','masturbate','menage a trois','milf','missionary position','motherfucker','mound of venus','mr hands','muff diver','muffdiving','nambla','nawashi','negro','neonazi','nig nog','nigga','nigger','nimphomania','nipple','nipples','nsfw images','nude','nudity','nympho','nymphomania','octopussy','omorashi','one cup two girls','one guy one jar','orgasm','orgy','paedophile','panties','panty','pedobear','pedophile','pegging','penis','phone sex','piece of shit','piss pig','pissing','pisspig','playboy','pleasure chest','pole smoker','ponyplay','poof','poop chute','poopchute','porn','porno','pornography','prince albert piercing','pthc','pubes','pussy','queaf','raghead','raging boner','rape','raping','rapist','rectum','reverse cowgirl','rimjob','rimming','rosy palm','rosy palm and her 5 sisters','rusty trombone','s&m','sadism','scat','schlong','scissoring','semen','sex','sexo','sexy','shaved beaver','shaved pussy','shemale','shibari','shit','shota','shrimping','slanteye','slut','smut','snatch','snowballing','sodomize','sodomy','spic','spooge','spread legs','strap on','strapon','strappado','strip club','style doggy','suck','sucks','suicide girls','sultry women','swastika','swinger','tainted love','taste my','tea bagging','threesome','throating','tied up','tight white','tit','tits','titties','titty','tongue in a','topless','tosser','towelhead','tranny','tribadism','tub girl','tubgirl','tushy','twat','twink','twinkie','two girls one cup','undressing','upskirt','urethra play','urophilia','vagina','venus mound','vibrator','violet blue','violet wand','vorarephilia','voyeur','vulva','wank','wet dream','wetback','white power','women rapping','wrapping men','wrinkled starfish','xx','xxx','yaoi','yellow showers','yiffy','zoophilia','motherfucker','mothafucka','fuck','fuch'
];

var trackPhrases = ['#incmachinesdev',
'#vfa',
'#vfa2015',
'#vfaparty',
'#ventureforamerica',
'#buildthings',
'#SmartPeopleShouldBuildThings',
'#WeareVFA',
'#VFAmily',
'#FellowFounded',
'#venture4america',
'#summercelebration',
'#fellowfounders' /*, '#wtf'*/ ];

//the string we need to track tweets with
var trackString = trackPhrases.join();

var following = ['1716295890', '19726058']; //@makeitMEGA && @riotfest user_ids

var followingString = following.join();

exports.run = function(io){

	twitter.immortalStream('statuses/filter',{track:trackString,stall_warnings:true},function(stream){
		stream.on('data',function(data){
			//profanity check
			if(!cursing(data.text)){
				//console.log(data)
				console.log(JSON.stringify(data.entities))
				var instagram = false;

				//check if the tweet is an instagram
				//if it is ignore it cause we'll be getting
				//the data from the instagram module
				if(data.entities.hasOwnProperty("urls"))
					for(var i = 0; i< data.entities.urls.length;i++)
						if(data.entities.urls[i].expanded_url.indexOf('instagram')>=0) instagram = true;

				if(!instagram){
					var obj = {}
					obj.text = data.text
					obj.image = (data.entities.hasOwnProperty("media"))? data.entities.media[0].media_url: ''
					obj.user = {}
					obj.user.username = data.user.screen_name
					obj.user.photo = data.user.profile_image_url
					obj.user.name = data.user.name
					io.sockets.emit('twitter',obj)
				}else console.log("Instagram Post")

			}

		})
		//Deal with errors
		stream.on('error', function(error, code){
			console.error('[TWITTER] Error! Code: %s'.inverse.yellow,code);
			console.error(error);
			//throw error;
		});
		stream.on('end', function (response) {
			// Handle a disconnection
			console.log('[TWITTER] End:'.inverse.red);
			console.log(response);
		});
		stream.on('destroy', function (response) {
			// Handle a 'silent' disconnection from Twitter, no end/error event fired
			console.log('[TWITTER] Destroy:'.inverse.red);
			console.log(response);
		});
	})

}

function cursing(text){
	for (i = 0; i < profanity.length; i++) {
		// Use whole word match regex for things like 'analysis' not testing positive for 'anal'
		if (new RegExp("\\b" + profanity[i] + "\\b", "i").test(text)) {
			return true;
			console.log("CUSSING!");
		}
	}
	return false
}
