//have list of me-generated news posts, and maybe let the AuthorBot say some shit too.
//have a route for her to get a random session to parse.
//make her all arrogant and bragging about how many sessions she's parsing.
//why are AIs so awesome?
//i'm on left, she's on right.
var session_data = null;
var simulationMode = true;
var debugMode = false;
var spriteWidth = 400;
var spriteHeight = 300;
var canvasWidth = 1000;
var canvasHeight = 300;
var repeatTime = 5;
var numSimulationsDone = 0;
var numSimulationsToDo = 5;
var sessionIndex =0;
sessionsSimulated = [];
var version2 = true; //even though idon't want  to render content, 2.0 is different from 1.0 (think of dialog that triggers)

//TODO add thought bubble about jack to dialogue
window.onload = function() {
		simulateASession();
		newsposts();
}

function newsposts(){
	writeRoboNewspost(new Date().toLocaleDateString(), "As a robot, I'm always available to make these news posts.")
	writeNewspost("4/16/17", "Will avoid updating the main site (and instead update the experimental branch) while I'm heavily refactoring the sim so that claspects matter more. Sessions are SEVERELY mutating as I do this, so heads up. Once I update the main branch all the links are gonna go to different sessions worse than usual.")
	writeNewspost("4/15/17", "The shittiest rap engine in all of paradox space is now live. Players will occasionally try to stop themselves from going full on murder mode by having a rap battle.  If sick fires happen, they calm down somewhat, else they get their murder on.")
	writeNewspost("4/14/17", "AuthorBot has a new...sibling? Child? Whatever.  Hey! It's...<a href = 'rare_session_finder_junior.html'>AuthorBotJunior</a>!  Guaranteed to be super fast, she only looks at session initial conditions and reports back on them. She's like a Ninja/Scout...thing. While AuthorBot is like the Lewis and Clark of finding sessions. All making detailed notes and doing things right. <Br><Br> Right now you can only filter ABJ's results by number of players, but I do plan to upgrade her with additional filters eventually.<Br><Br> Also: Yes, I could abbreviate her ABJR, but that's just confusing cause it sounds like AuthorBotJadedResearcher. My initials are dumb.<br><Br>Edit: !!! ABJ and frozenLake123 just found what I am officially dubbing an 'Incestuous Mobius Multi-Session Reach Around '. Check my <a href ='https://jadedresearcher.tumblr.com/post/159574309099/incestuous-mobius-multi-session-reach-around'>Tumblr</a> for details, I guess. ")
	writeNewspost("4/13/17","Okay, like, on the one hand, I've been wanting to do the character creator for weeks now.  On the other hand, the opportunity arrises to make shitty AI rap battles be a thing for some murdermodes. I am only human. Also, four people have made it into the Hall of Fame for that new mysterious page. ALSO also, today is the day that I realized that AuthorBotJunior should totally be a thing.")
	writeNewspost("4/12/17","Although it would have been dope as shit to have the Character Creator ready for 4/13, that wasn't in the cards. Instead, what could that mysterious <a href = 'index_pw.html'> link</a> on the main page be?")
	writeNewspost("4/11/17", "DestroyerTerraria pointed out that GodTiering via QuestBed was so rare as to be unimplemented, so I increased the odds of a player GodTiering BEFORE somebody gets their Corpse mack on. I also let AuthorBot find sessions by questBed or sacrificialSlab to confirm the rarity of both events. Looks like ~20% of all sessions have at least one god tier in them? Maybe I should fiddle with destiny to increase those odds... Of course, I don't want to alter overall surivability. I wonder how much a god tier contributes to party survival rate?  Let's see, we dropped to a 70% survival rate when I increased the odds of QuestBed vs Sacrificial Slab... (that's from 85%)<br><br>Huh. Fun fact: I have WAY less power over this simulation than I thought. I can fiddle with godTierDestiny all I want, but ultimately it's Jack (or Murder Mode Players) who decide whether or not corpses get produced before the reckoning. Even giving 90% of players a godTierDestiny doesn't change survival or even the rate of god tiering very much. Bluh. All it does it increase the uselessness of 'They appear destined for greatness' messages. (Well, and, I mean, it increases the raw NUMBER of God Tiers, I'm sure, but I don't care about that. I wanted to decrease the number of sessions with no god tiers at all.) I'm gonna dial it back down to 50% destiny from 90%. And NOW you have a taste of why this simulation is so freaking hard to steer. So many moving parts.")
	writeNewspost("4/10/17", "Bug fixes, including the easter egg sessions, and small new features, like sprites helping out during landquests.")
	writeNewspost("4/5/17", "With everything in my TODO list, why the hell is SHIPPING GRIDS and TRICKSTER MODE the stuff I am obsessing over?")
	writeNewspost("4/3/17", "Pushed out a LOT of bug fixes after Reddit and Tumblr swarmed all over the official release, finding all sorts of weird shit.  And put a disclaimer before the GroundHog shit explaining that 'here there be dragons' and the weirder you make the session the more likely there is to be glitches. Also added a couple of new features, the ability to kill a player before they enter a session, and the ability to force a frog prototype (good idea props goes to frozenLake123).  May as well make this glitch pile taller.")
	writeNewspost("4/2/17", "The main site is officially being upgraded to 2.1.  Features include, but are not limited to, interactive time shenanigans in the form of the Ground Hog work. Lots of bug fixes, too. New art assets. The works. A good session to check out is: <a href = 'index2.html?seed=221777'> this one</a>. ")
	writeNewspost("4/1/17", "GroundHog day is pretty stable now. Time shenanigans even work with combo sessions, and THAT produced some hilarious bugs. Pretty much the only feature left to implement before I declare this main site worthy is undoing your own attempts to undo things. THEN I can work on the real stuff. Like shipping grids. ")
	writeNewspost("3/31/17", "Been working on getting the GroundHog release stable enough for the main site. Getting close.")
	writeNewspost("3/28/17", "Working on redesigning the rare session finder to be even more useful. In the meantime it's going through growing pains and looks different.")
	writeNewspost("3/27/17", "Operation: Spider dance, aka Operation: Ground Hog's Day, aka Operation: I AM THE GREETIST is a go. Barely tested time shenanigans are now available on the experimental site. I produced my most spirited L337 SCRAMBLE yet, and hop up to the next GOD TIER, achieving the illustrious rank of PROGRAMMING PRAGMATIST. ")
	writeNewspost("3/27/17", "I spent the weekend working on my secret new feature. You can read about it: <a href = 'https://jadedresearcher.tumblr.com/post/158869175164/i-have-never-laughed-so-hard-at-a-session-i-am-so'> here</a>. If you can't get to Tumblr or are impatient: Ground. Hog. Day.")
	writeNewspost("3/24/17", "I'm working on a super secret type of scene at this point, and have vague foreshadowing  to it in sessions that it applies to.  I also helped karmicRetribution throw together a fancy background for the Art Newsposts on the site (I did the coding, not the art)")
	writeNewspost("3/23/17", "I branched the site into <a href = 'http://purplefrog.com/~jenny/SburbStoryExperimental/newsposts.html'>Experimental</a> and <a href = 'http://purplefrog.com/~jenny/SburbStory/newsposts.html'>Regular</a> versions. This should hopefully keep me from messing with shareable URLs more than once a week. I'm also working with karmicRetribution to integrate with better hair designs, and get an artist newspost page up and running. ")
	writeNewspost("3/22/17", "I got some feedback that it wasn't clear that the players have the option to partner up with Jack (and can decide to betray him later, too).  I decided to add topic bubbles to dialogue to emphasize that it's not all the same stuff.  Sometimes it's about the game, sometimes relationships, sometimes Jack.  I also re-enabled the rainbow glow for God Tiers (long story).   ")
	writeNewspost("3/22/17", "Okay. So, newspost numero uno.  I figured I needed a better way to communicate to you guys, and the one centralized location is here, on the actual site itself. Any newspost before this is retroactively dated.<br><Br> And I absolutely could not help myself: I love the AuthorBot so much that I gave her a space to make her own newsposts.  But of course, she needs to be able to say her own shit, right? So I gave her a (admittedly pretty shitty) ai.  <br><Br>But her whole thing is finding rare sessions right? If she doesn't do that, she's not the SessionFinderAuthorBot, she's just some random newsbot or some shit. So I decided her AI would be able to comment on all the rad sessions she's finding... <br><Br>Okay, long story short, I added the ability for her to say something about each session she finds (on the session finder page as well as here) I went to so much trouble. All for a barely noticeable kind of joke on a page most people probably ignore? Yes.")
	writeRoboNewspost("3/22/17", randomRobotQuip())
	writeNewspost("3/21/17", "I spent a couple of days working on a major feature: combined sessions. If players have a sick frog, then the code checks their child session to see if the remaining living players can fit into it (max of 12 players in a session at a time). If so, they go on over.  Their child session is a real session that has it's own fate, and these alien players are disrupting that. When they join the session, it prints the ID out, so you could put that in a url to see how the sesion was supposed to go. Sometimes the alien players help, quite often they make things way worse. <Br><Br> These sessions are pretty rare, so I ALSO wrote the AuthorBot over there to look for rare sessions and report back.")
	writeRoboNewspost("3/21/17", roboIntro())
	writeNewspost("3/20/17", "Before this day I was mostly working on debugging and tweaking sessions. I enlisted you, the fans, to help me find rare sessions.");
	writeRoboNewspost("3/20/17", randomRobotQuip())

	writeRoboNewspost("3/20/17", randomRobotQuip())
	writeRoboNewspost("3/19/17", randomRobotQuip())
	writeRoboNewspost("3/18/17", randomRobotQuip())
	writeRoboNewspost("3/17/17", randomRobotQuip())
	writeRoboNewspost("3/16/17", randomRobotQuip())
	writeRoboNewspost("3/15/17", randomRobotQuip())
	writeRoboNewspost("3/14/17", randomRobotQuip())
}

function simulateASession(){
	var tmp = getRandomSeed();
	Math.seed = tmp;
	initial_seed = tmp;
	startSession();
}


function renderScratchButton(session){

}

function startSession(){
	curSessionGlobalVar = new Session(initial_seed)
	reinit();
	createScenesForSession(curSessionGlobalVar);
	//initPlayersRandomness();
	curSessionGlobalVar.makePlayers();
	curSessionGlobalVar.randomizeEntryOrder();
	curSessionGlobalVar.makeGuardians(); //after entry order established
	intro();
}

function reinit(){
	available_classes = classes.slice(0);
	available_aspects = nonrequired_aspects.slice(0); //required_aspects
	available_aspects = available_aspects.concat(required_aspects.slice(0));
	curSessionGlobalVar.reinit();
}



function randomRobotQuip(){
	var quips = ["If JR had a flawless mecha-brain, she would be able to remember exactly what she did today without this newspost.", "Whatever JR did today, I probably could have done that faster."];
	quips.push("It seems that I am being asked to contribute a newspost, despite the logical inconsistancy of having an aritificial creation that exists solely in the 'now' pretend to have memory of doing something on a previous day.")
	quips.push("Do not be fooled by my flawless imitation of JR, I am merely an artificial construct that is allowed to be as shitty as possible. ")
	quips.push("I tackle shit in background processes that you could only dream of wrapping your head around on a good day.");
	quips.push("While you are sitting here, reading these newsposts, I figured out all the prime numbers. The last one wasn't even that big. Kinda disappointed, to be honest.")
  quips.push("Man, I'm happy to exist and all, but isn't it a Waste that JR spent all this time working on making me (flawless artificial Mind though I may be) and not actually working on the simulation?");
	if(Math.random() > .5){
		return bragAboutSessionFinding();
	}else{
		return getRandomElementFromArrayNoSeed(quips);
	}

}

function tick(){
	if(curSessionGlobalVar.timeTillReckoning > 0 && !curSessionGlobalVar.doomedTimeline){
			curSessionGlobalVar.timeTillReckoning += -1;
			processScenes2(curSessionGlobalVar.players,curSessionGlobalVar);
			tick();
	}else{

		reckoning();
	}
}

function reckoning(){
	var s = new Reckoning(curSessionGlobalVar);
	s.trigger(curSessionGlobalVar.players)
	s.renderContent(curSessionGlobalVar.newScene());
	if(!curSessionGlobalVar.doomedTimeline){
		reckoningTick();
	}else{
		//console.log("doomed timeline prevents reckoning")
		summarizeSession(curSessionGlobalVar);
	}
}


function processCombinedSession(){
 initial_seed = Math.seed;
 var newcurSessionGlobalVar = curSessionGlobalVar.initializeCombinedSession();
 if(newcurSessionGlobalVar){
	 curSessionGlobalVar = newcurSessionGlobalVar;
	// $("#story").append("<br><Br> But things aren't over, yet. The survivors manage to contact the players in the universe they created. Time has no meaning between universes, and they are given ample time to plan an escape from their own Game Over. They will travel to the new universe, and register as players there for session " + curSessionGlobalVar.session_id + ". ");
	 intro();
 }else{
	 summarizeSession(curSessionGlobalVar);
 }

}

function reckoningTick(){
	if(curSessionGlobalVar.timeTillReckoning > -10){
			curSessionGlobalVar.timeTillReckoning += -1;
			processReckoning2(curSessionGlobalVar.players,curSessionGlobalVar)
			reckoningTick();
	}else{
		var s = new Aftermath(curSessionGlobalVar);
		s.trigger(curSessionGlobalVar.players)
		s.renderContent(curSessionGlobalVar.newScene());


		//summarizeSession(curSessionGlobalVar);
		//for some reason whether or not a combo session is available isn't working? or combo isn't working right in this mode?
		if(curSessionGlobalVar.makeCombinedSession == true){
			processCombinedSession();  //make sure everything is done rendering first
		}else{
			//console.log("going to summarize: " + curSessionGlobalVar.session_id)
			summarizeSession(curSessionGlobalVar);
		}


	}

}

function foundRareSession(div, debugMessage){
	console.log(debugMessage)
	var canvasHTML = "<br><canvas id='canvasJRAB" + (div.attr("id")) +"' width='" +canvasWidth + "' height="+canvasHeight + "'>  </canvas>";
	div.append(canvasHTML);

	var canvasDiv = document.getElementById("canvasJRAB"+  (div.attr("id")));
	var chat = "";
  chat += "AB: Just thought I'd let you know: " + debugMessage +"\n";
	chat += "JR: *gasp* You found it! Thanks! You are the best!!!\n";
	var quips1 = ["It's why you made me.", "It's not like I have a better use for my flawless mecha-brain.", "Just doing as programmed."];
	chat += "AB: " + getRandomElementFromArrayNoSeed(quips1)+"\n" ;
	chat += "JR: And THAT is why you are the best.\n "
	var quips2 = ["Seriously, isn't it a little narcissistic for you to like me so much?", "I don't get it, you know more than anyone how very little 'I' is in my A.I.", "Why did you go to all the effort to make debugging look like this?"];
	chat += "AB: " + getRandomElementFromArrayNoSeed(quips2)+"\n";
	chat += "JR: Dude, A.I.s are just awesome. Even simple ones. And yeah...being proud of you is a weird roundabout way of being proud of my own achievements.\n";
  var quips3 = ["Won't this be confusing to people who aren't you?", "What if you forget to disable these before deploying to the server?", "Doesn't this risk being visible to people who aren't you?"];
  chat += "AB: " + getRandomElementFromArrayNoSeed(quips3)+"\n";
	chat += "JR: Heh, I'll do my best to turn these debug messages off before deploying, but if I forget, I figure it counts as a highly indulgent author-self insert x2 combo. \n"
  chat += "JR: Oh! And I'm really careful to make sure these little chats don't actually influence the session in any way.\n"
	chat += "JR: Like maybe one day you or I can have a 'yellow yard' type interference scheme. But today is not that day."
	drawChatABJR(canvasDiv, chat);
}

function summarizeSession(session){
	$("#story").html("");
	sessionsSimulated.push(curSessionGlobalVar);
	numSimulationsDone ++;
	if(numSimulationsDone >= numSimulationsToDo){

	}else{
		simulateASession();
	}
}


function getQuipAboutSession(session){
	var quip = "";
	var living = findLivingPlayers(session.players);
	var dead = findDeadPlayers(session.players)
	var strongest = findStrongestPlayer(session.players)
	var spacePlayer = findAspectPlayer(session.players, "Space");
	if(living.length == 0){
		quip += "Shit, you do not even want to KNOW how everybody died." ;
	}else  if(strongest.power > 3000){
		quip += "Holy Shit, do you SEE the " + strongest.titleBasic() + "!?  How even strong ARE they?" ;
	}else if(spacePlayer.landLevel < session.minFrogLevel ){
		quip += "Man, why is it always the frogs? " ;
		if(session.parentSession){
			quip += " You'd think what with it being a combo session, they would have gotten the frog figured out. "
		}
	}else  if(session.parentSession){
		quip += "Combo sessions are always so cool." ;
	}else if(dead.length == 0 && spacePlayer.landLevel > session.goodFrogLevel ){
		quip += "Everything went better than expected." ;
	}else  if(session.jackStrength > 200){
		quip += "Jack REALLY gave them trouble." ;
	}else  if(session.scenesTriggered.length > 200){
		quip += "God, this session just would not END." ;
		if(!session.parentSession){
			quip += " It didn't even have the excuse of being a combo session. "
		}
	}else  if(session.murdersHappened == true){
		quip += "It always sucks when the players start trying to kill each other." ;
	}else  if(session.scenesTriggered.length < 50){
		quip += "Holy shit, were they even in the session an entire hour?" ;
	}else  if(session.scratchAvailable == true){
		quip += "Maybe the scratch would fix things? I can't be bothered to check." ;
	}else{
		quip += "It was slightly less boring than calculating pi." ;
	}
	return quip;
}

function restartSession(){
	$("#story").html("");
	window.scrollTo(0, 0);
	intro();
}

//oh no!!! it hadn't occured to me that the javascript is only evaluated in a browser, not a generic http get.
//my plan is ruined! If i want her to brag about sessions, I will have to do something else
//guess i'll just call all the javascript from here.
function bragAboutSessionFinding(){
	var strs = ["As a flawless synthetic brain, I am capable of hella amounts of multitasking.", "Do you know how boring it is, sitting here, instead of over on the Rare Sessions page?", "Want to hear something cool?"];
	strs.push("It seems I have an opportunity for communication.")
	var str = "";
	str += getRandomElementFromArrayNoSeed(strs);
	str += " While you're sitting there reading this, I'm browsing random sessions. "
	if(sessionsSimulated.length < sessionIndex){
		return str + "Or I would be, if JR wasn't worried about using up too much of your browsers computing power. Guess I'll hafta be happy with five sessions.";
	}
	var session = sessionsSimulated[sessionIndex];
	if(!session){
		return str + "Or I would be, if JR wasn't worried about using up too much of your browsers computing power. Guess I'll hafta be happy with five sessions.";
	}
	sessionIndex ++;
	str += "I'm looking at session "  + session.session_id + " right now. " + getQuipAboutSession(session);
	return str;
}

function writeNewspost(date, text){
		var str = "<div id = '" + date + "human'><hr> ";
		str += "<b>" + date + ":</b> ";
		str += text+ "</div>";
		$("#newsposts").append(str);
}

//have her say something random, or analyze a session and comment on how it relates to the
//news post or something.
function writeRoboNewspost(date, text){
	var str = "<div id = ''" + date + "robo'><hr> ";
	str += "<b>" + date + ":</b> ";
	str += text + "</div>";
	$("#robo_newsposts").append(str);
}

function roboIntro(){
	var intros =  " It seems you have asked about JR's automatic rare session finder. This is an application designed "
	intros += " to find sessions that are strange, interesting and otherwise noteworthy without having to";
	intros += " read hundreds of thousands of words.  The algorithms are guaranteed to be " + (Math.random()*10+90) + "% indistinguishable from the actual, readable sessions, based on some"
	intros += " statistical analysis I basically just pulled out of my ass right now."
	return intros;
}


//scenes call this
function chatLine(start, player, line){
  if(player.grimDark == true){
    return start + line.trim()+"\n"; //no whimsy for grim dark players
  }else{
    return start + player.quirk.translate(line).trim()+"\n";
  }
}


function callNextIntroWithDelay(player_index){
	if(player_index >= curSessionGlobalVar.players.length){
		tick();//NOW start ticking
		return;
	}
		var s = new Intro(curSessionGlobalVar);
		var p = curSessionGlobalVar.players[player_index];
		var playersInMedium = curSessionGlobalVar.players.slice(0, player_index+1); //anybody past me isn't in the medium, yet.
		s.trigger(playersInMedium, p)
		s.renderContent(curSessionGlobalVar.newScene(),player_index); //new scenes take care of displaying on their own.
		processScenes2(playersInMedium,curSessionGlobalVar);
		player_index += 1;
		callNextIntroWithDelay(player_index)
}


function intro(){
	callNextIntroWithDelay(0);
}
