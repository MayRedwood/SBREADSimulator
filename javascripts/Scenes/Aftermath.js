function Aftermath(session){
	this.session = session;
	this.canRepeat = false;
	this.playerList = [];  //what players are already in the medium when i trigger?
	this.trigger = function(playerList){
		this.playerList = playerList;
		return true; //this should never be in the main array. call manually.
	}


	this.democracyBonus = function(){
		var ret = "<Br><br><img src = 'images/sceneIcons/wv_icon.png'>";
		if(this.session.democraticArmy.power == 0){
			return "";
		}
		if(this.session.democraticArmy.currentHP > 10 && findLivingPlayers(this.session.players).length > 0 ){
			this.session.mayorEnding = true;
			ret += "The adorable Warweary Villein has been duly elected Mayor by the assembled consorts and Carapacians. "
			ret += " His acceptance speech consists of promising to be a really great mayor that everyone loves who is totally amazing and heroic and brave. "
			ret += " He organizes the consort and Carapacians' immigration to the new Universe. ";
		}else{
			if(findLivingPlayers(this.session.players).length > 0){
				this.session.waywardVagabondEnding = true;
				ret += " The Warweary Villein feels the sting of defeat. Although he helped the Players win their session, the cost was too great.";
				ret += " There can be no democracy in a nation with only one citizen left alive. He is the only remaining living Carapacian in the Democratic Army. ";
				ret += " He becomes the Wayward Vagabond, and exiles himself to the remains of the Players old world, rather than follow them to the new one.";
			}else{
				this.session.waywardVagabondEnding = true;
				ret += " The Warweary Villein feels the sting of defeat. He failed to help the Players.";
				ret += " He becomes the Wayward Vagabond, and exiles himself to the remains of the Players' old world. ";
			}
		}
		return ret;
	}

	//oh goodness, what is this?
	this.yellowLawnRing = function(div){
		var living = findLivingPlayers(this.session.players);
		var dead = findDeadPlayers(this.session.players);
		//time players doesn't HAVE to be alive, but it makes it way more likely.
		var singleUseOfSeed = Math.seededRandom();
		var timePlayer = findAspectPlayer(living, "Time")
		if(!timePlayer && singleUseOfSeed > .5){
			timePlayer = findAspectPlayer(this.session.players, "Time")
		}
		if(dead.length >= living.length && timePlayer || this.session.janusReward){
			//console.log("Time Player: " + timePlayer);
			timePlayer = findAspectPlayer(this.session.players, "Time") //NEED to have a time player here.
			var s = new YellowYard(this.session);
			s.timePlayer = timePlayer;
			s.trigger();
			s.renderContent(div);
		}
	}

	this.mournDead = function(div){
		var dead = findDeadPlayers(this.session.players);
		var living = findLivingPlayers(this.session.players);
		if(dead.length == 0){
			return "";
		}
		var ret = "<br><br>";
		if(living.length > 0){
			ret += " Victory is not without it's price. " + dead.length + " players are dead, never to revive. There is time for mourning. <br>";
		}else{
			ret += " The consorts and Carapacians both Prospitian and Dersite alike mourn their fallen heroes. ";
			ret += "<img src = 'images/abj_watermark.png' class='watermark'>"
		}

		for(var i = 0; i< dead.length; i++){
			var p = dead[i];
			ret += "<br><br> The " + p.htmlTitleBasic() + " died " + p.causeOfDeath + ". ";
			var friend = p.getWhoLikesMeBestFromList(living);
			var enemy = p.getWhoLikesMeLeastFromList(living);
			if(friend){
				ret += " They are mourned by the" + friend.htmlTitle() + ". ";
				div.append(ret);
				ret = "";
				this.drawMourning(div, p,friend);
				div.append(ret);
			}else if(enemy){
				ret += " The " +enemy.htmlTitle() + " feels awkward about not missing them at all. <br><br>";
				div.append(ret);
				ret = "";
			}
		}
		div.append(ret);

	}

	this.drawMourning = function(div, dead_player, friend){
		var divID = (div.attr("id")) + "_" + dead_player.chatHandle;
		var canvasHTML = "<br><canvas id='canvas" + divID+"' width='" +canvasWidth + "' height="+canvasHeight + "'>  </canvas>";
		div.append(canvasHTML);
		var canvasDiv = document.getElementById("canvas"+ divID);

		var pSpriteBuffer = getBufferCanvas(document.getElementById("sprite_template"));
		drawSprite(pSpriteBuffer,friend)

		var dSpriteBuffer = getBufferCanvas(document.getElementById("sprite_template"));
		drawSprite(dSpriteBuffer,dead_player)

		copyTmpCanvasToRealCanvasAtPos(canvasDiv, pSpriteBuffer,-100,0)
		copyTmpCanvasToRealCanvasAtPos(canvasDiv, dSpriteBuffer,100,0)
	}

	//space stuck needs love
	this.findBestSpace = function(){
		var spaces = findAllAspectPlayers(this.session.players, "Space");
		var ret = spaces[0];
		for(var i = 0; i<spaces.length; i++){
			if(spaces[i].landLevel > ret.landLevel) ret = spaces[i];
		}
		return ret;
	}
	
	this.findMostCorruptedSpace = function(){
		var spaces = findAllAspectPlayers(this.session.players, "Space");
		var ret = spaces[0];
		for(var i = 0; i<spaces.length; i++){
			if(spaces[i].landLevel< ret.landLevel) ret = spaces[i];
		}
		return ret;  //lowest space player.
	}


	this.renderContent = function(div){
		var yellowYard = false;
		var end = "<Br>";
		var living = findLivingPlayers(this.session.players);
		var spacePlayer = this.findBestSpace();
		var corruptedSpacePlayer = this.findMostCorruptedSpace();
		//var spacePlayer = findAspectPlayer(this.session.players, "Space");
		//...hrrrm...better debug this. looks like this can be triggered when players AREN"T being revived???
		if(living.length > 0  && (!this.session.king.dead || !this.session.queen.dead && this.session.queen.exiled == false)){

			end += " While various bullshit means of revival were being processed, the Black Royalty have fled Skaia to try to survive the Meteor storm. There is no more time, if the frog isn't deployed now, it never will be. There is no time for mourning. "
			this.session.opossumVictory = true; //still laughing about this. it's when the players don't kill the queen/king because they don't have to fight them because they are al lint he process of god tier reviving. so the royalty fucks off. and when the players wake up, there's no bosses, so they just pop the frog in the skia hole.
			div.append(end);
			end = "<br><br>"
		}else if(living.length>0){
				if(living.length == this.session.players.length){
					end += " All "
				}
				end += living.length + " players are alive.<BR>" ;
				div.append(end);//write text, render mourning
				end = "<Br>";
				this.mournDead(div);
		}

		if(living.length > 0){
			//check for inverted frog.
			if(corruptedSpacePlayer.landLevel <= (this.session.goodFrogLevel * -1)) return this.purpleFrogEnding(div, end);
			if(spacePlayer.landLevel >= this.session.minFrogLevel){
				end += "<br><img src = 'images/sceneIcons/frogger_animated.gif'> Luckily, the " + spacePlayer.htmlTitle() + " was diligent in frog breeding duties. ";
				if(spacePlayer.landLevel < 28){
					end += " The frog looks... a little sick or something, though... That probably won't matter. You're sure of it. ";
				}
				end += " The frog is deployed, and grows to massive proportions, and lets out a breath taking Vast Croak.  ";
				if(spacePlayer.landLevel < this.session.goodFrogLevel){
					end += " The door to the new universe is revealed.  As the leader reaches for it, a disaster strikes.   ";
					end += " Apparently the new universe's sickness manifested as its version of SBURB interfering with yours. ";
					end += " Your way into the new universe is barred, and you remain trapped in the medium.  <Br><br>Game Over.";
					end += " Or is it?"
					if(this.session.ectoBiologyStarted == true){
						//spacePlayer.landLevel = -1025; //can't use the frog for anything else, it's officially a universe. wait don't do this, breaks abs frog reporting
						this.session.makeCombinedSession = true; //triggers opportunity for mixed session
					}
					//if skaia is a frog, it can't take in the scratch command.
					this.session.scratchAvailable = false;
					//renderScratchButton(this.session);

				}else{
					end += this.democracyBonus();
					end += " <Br><br> The door to the new universe is revealed. Everyone files in. <Br><Br> Thanks for Playing. ";
					//spacePlayer.landLevel = -1025; //can't use the frog for anything else, it's officially a universe. wait don't do this, breaks abs frog reporting
					this.session.won = true;
				}
			}else{
				if(this.session.rocksFell){
					end += "<br>With Skaia's destruction, there is nowhere to deploy the frog to. It doesn't matter how much frog breeding the Space Player did."
				}else{
					end += "<br>Unfortunately, the " + spacePlayer.htmlTitle() + " was unable to complete frog breeding duties. ";
					end += " They only got " + Math.round(spacePlayer.landLevel/this.session.minFrogLevel*100) + "% of the way through. ";
					console.log(Math.round(spacePlayer.landLevel/this.session.minFrogLevel*100) + " % frog in session: " + this.session.session_id)
					if(Math.round(spacePlayer.landLevel/this.session.minFrogLevel*100) <= -100) console.log("!!!!!!!!!!!!!!!!!!!!TROLL KID ROCK INCOMING!!!!!!!!!!!!!!!!" + this.session.session_id)

					if(spacePlayer.landLevel < 0){
						end += " Stupid lousy goddamned GrimDark players fucking with the frog breeding. Somehow you ended up with less of a frog than when you got into the medium. ";
					}
					end += " Who knew that such a pointless mini-game was actually crucial to the ending? ";
					end += " No universe frog, no new universe to live in. Thems the breaks. ";
				}

				end += " If it's any consolation, it really does suck to fight so hard only to fail at the last minute. <Br><Br>Game Over.";
				end += " Or is it? "
				this.session.scratchAvailable = true;
				renderScratchButton(this.session);
				yellowYard = true;

			}
	}else{
		div.append(end);
		end = "<Br>";
		this.mournDead(div);
		end += this.democracyBonus();
		end += " <br>The players have failed. No new universe is created. Their home universe is left unfertilized. <Br><Br>Game Over. ";
	}
	var strongest = findStrongestPlayer(this.session.players)
	end += "<br> The MVP of the session was: " + strongest.htmlTitle() + " with a power of: " + strongest.power;
	end += "<br>Thanks for Playing!<br>"
	div.append(end);
	var divID = (div.attr("id")) + "_aftermath" ;


	//poseAsATeam(canvasDiv, this.session.players, 2000); //everybody, even corpses, pose as a team.
	this.lastRender(div);
	if(yellowYard == true || this.session.janusReward){
		this.yellowLawnRing(div);  //can still scratch, even if yellow lawn ring is available
	}
}


//kid rock NEEDS fraymotif: BANG DA DANG DIGGY DIGGY
//thanks goes to Ancient for this amazing idea.
this.trollKidRock = function(){
	var trollKidRockString = "b=%C3%B2%C3%9C%C2%829%C3%BE%11%10%0CCC%20&s=,,Rap,Rap,kidRock" //Ancient, thank you for best meme. 
	var trollKidRock = new CharacterEasterEggEngine().playerDataStringArrayToURLFormat([trollKidRockString])[0];
	alert(trollKidRock.title())	
	var f = new Fraymotif([],  "BANG DA DANG DIGGY DIGGY", 3) //most repetitive song, ACTIVATE!!!
	f.effects.push(new FraymotifEffect("power",3,true));  //buffs party and hurts enemies
	f.effects.push(new FraymotifEffect("power",1,false));
	f.flavorText = " OWNER plays a 90s hit classic, and you can't help but tap your feet. ENEMY seems to not be able to stand it at all.  A weakness? "
	trollKidRock.fraymotifs.push(f);
	
	var f = new Fraymotif([],  "BANG DA DANG DIGGY DIGGY", 3) //most repetitive song, ACTIVATE!!!
	f.effects.push(new FraymotifEffect("power",3,true));  //buffs party and hurts enemies
	f.effects.push(new FraymotifEffect("power",1,false));
	f.flavorText = " OWNER plays a 90s hit classic, and you can't help but tap your feet. ENEMY seems to not be able to stand it at all.  A weakness? "
	trollKidRock.fraymotifs.push(f);
	
	var f = new Fraymotif([],  "BANG DA DANG DIGGY DIGGY", 3) //most repetitive song, ACTIVATE!!!
	f.effects.push(new FraymotifEffect("power",3,true));  //buffs party and hurts enemies
	f.effects.push(new FraymotifEffect("power",1,false));
	f.flavorText = " OWNER plays a 90s hit classic, and you can't help but tap your feet. ENEMY seems to not be able to stand it at all.  A weakness? "
	trollKidRock.fraymotifs.push(f);
	
	var f = new Fraymotif([],  "BANG DA DANG DIGGY DIGGY", 3) //most repetitive song, ACTIVATE!!!
	f.effects.push(new FraymotifEffect("power",3,true));  //buffs party and hurts enemies
	f.effects.push(new FraymotifEffect("power",1,false));
	f.flavorText = " OWNER plays a 90s hit classic, and you can't help but tap your feet. ENEMY seems to not be able to stand it at all.  A weakness? "
	trollKidRock.fraymotifs.push(f);
	
	return trollKidRock;
}

this.purpleFrog = function(){
	var mvp = findStrongestPlayer(this.session.players);
	var tmpStatHolder = {};
	tmpStatHolder.minLuck = -100;
	tmpStatHolder.maxLuck = -100;
	tmpStatHolder.hp = mvp.getStat("hp") * this.session.players.length;  //this will be a challenge. good thing you have troll kid rock to lay down some sick beats.
	tmpStatHolder.mobility = -100
	tmpStatHolder.sanity = -100
	tmpStatHolder.freeWill = -100
	tmpStatHolder.power =mvp.getStat("power") * this.session.players.length; //this will be a challenge.
	tmpStatHolder.grist = 100000000;
	tmpStatHolder.RELATIONSHIPS = -100;  //not REAL relationships, but real enough for our purposes.
	var purpleFrog =  new GameEntity(this.session, " <font color='purple'>" +Zalgo.generate("The Purple Frog") + "</font>", null);
	purpleFrog.setStatsHash(tmpStatHolder);
	//what kind of attacks does a grim dark purple frog have???  Croak Blast is from rp, but what else?
	
	var f = new Fraymotif([],  "CROAK BLAST", 3) //freeMiliu_2K01 [F☆] came up with this one in the RP :)  :) :)
	f.effects.push(new FraymotifEffect("power",3,true));
	f.flavorText = " OWNER uses a weaponized croak. You would be in awe if it weren't so painful. "
	purpleFrog.fraymotifs.push(f);
	
	return purpleFrog;
}

//purple frog was the name of my old host. but also, it sounds like a grim dark frog, doesn't it?
//reference to rp at: http://forums.msparp.com/showthread.php?tid=16049
//guest starring troll kid rock
this.purpleFrogEnding = function(div, precedingText){
	alert("purple frog incoming!!!")
	//maybe load kid rock first and have callback for when he's done.
	//maybe kid rock only shows up for half purple frogs??? need plausible deniability? "Troll Kid Rock??? Never heard of him. Sounds like a cool dude, though."
	var trollKidRock = this.trollKidRock();
	alert(trollKidRock.title())
	var purpleFrog = this.purpleFrog();
	precedingText += " What...what is going on? How...how can you have NEGATIVE 100% of a frog??? This...this doesn't look right.   The vast frog lets out a CROAK, but it HURTS.  It seems...hostile.  Oh fuck. <Br><br> The " + purpleFrog.name + " initiates a strife with the Players! Troll Kid Rock appears out of nowhere to help them. (What the hell???)"
	
	div.append(precedingText);
}

//take "firstcanvas"+ this.player.id+"_" + this.session.session_id from intro, and copy it here to display for first time.
this.lastRender = function(div){
    div = $("#charSheets");
    if(div.length == 0) return; //don't try to render if there's no where to render to
	for(var i = 0; i<this.session.players.length; i++){
		var canvasHTML = "<canvas class = 'charSheet' id='lastcanvas" + this.session.players[i].id+"_" + this.session.session_id+"' width='800' height='1000'>  </canvas>";
		div.append(canvasHTML);
		var canvasDiv = document.getElementById("lastcanvas"+ this.session.players[i].id+"_" + this.session.session_id);
		var first_canvas = document.getElementById("firstcanvas"+ this.session.players[i].id+"_" + this.session.session_id);
		var tmp_canvas = getBufferCanvas(canvasDiv);
		drawCharSheet(tmp_canvas,this.session.players[i])
		copyTmpCanvasToRealCanvasAtPos(canvasDiv, first_canvas,0,0)
		copyTmpCanvasToRealCanvasAtPos(canvasDiv, tmp_canvas,400,0)
	}
}

	this.content = function(div, i){
		var ret = " TODO: Figure out what a non 2.0 version of the Intro scene would look like. "
		div.append(ret);
	}
}
