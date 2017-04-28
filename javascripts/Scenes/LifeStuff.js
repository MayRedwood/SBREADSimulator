function LifeStuff(session){
	this.session = session;
	this.canRepeat = true;
	this.playerList = [];  //what players are already in the medium when i trigger?
	this.combo = 0;

	//arrays of [life/Doom player, other player] pairs. other player can be a corpse. other player can be null;
	this.enablingPlayerPairs = [];

	//it's weird. even though this class treats Life and Doom players as the same, in practice they behave entirely differently.
	//life players keep people from dying in the first place with high HP, while doom players make them die a LOT and become empowered by the afterlife.

	//what kind of priority should this have. players shouldn't fuck around in ream bubbles instead of land quests. but they also shouldn't avoid reviving players.
	//maybe revive stuff always happens, but anything else has a random chance of not happening?
	this.trigger = function(playerList){
		this.enablingPlayerPairs = [];
		//not just available players. if class that could revive SELF this way, can be called on dead. otherwise requires a living life/doom player.
		if(this.session.afterLife.ghosts.length == 0) return false; //can't exploit the afterlife if there isn't one.
		//first, check the dead.
		var dead = findDeadPlayers(this.session.players) //don't care about availability.
		for(var i = 0; i<dead.length; i++){
			var d = dead[i];
			if(d.aspect == "Life" || d.aspect == "Doom"){
				if(d.class_name == "Thief" || d.class_name == "Heir"){
					this.enablingPlayerPairs.push([d, null]); //gonna revive myself.
				}
			}
		}
		var guidesAndNon = this.findGuidesAndNonGuides(); //IS about availability.
		var guides = guidesAndNon[0];
		var nonGuides = guidesAndNon[1];
		//IMPORTANT if the below triggers to frequently can either changes it's priority in the scenes OR make there be a random chance of it not adding an enablingPlayer.
		//for each nonGuide, see if you can do something on your own.
		for(var i = 0; i<nonGuides.length; i++){
			var player = nonGuides[i];
			if(player.aspect == "Life" || player.aspect == "Doom"){
				if(player.className != "Witch" && player.className != "Sylph"){
					this.enablingPlayerPairs.push([player, null]);   
					removeFromArray(player, nonGuides);
				}else if(!this.session.dreamBubbleAfterlife){
					this.enablingPlayerPairs.push([player, null]); //witches and sylphs turn on the dream bubble afterlife if it's not already on.
					removeFromArray(player, nonGuides);
				}
			}
		}
		
		//for each guide, see if there are any non guides left to guide.
		for(var i = 0; i<guides.length; i++){
			if(nonGuides.length > 0){
				var guide = guides[i];
				var nonGuide = getRandomElementFromArray(nonGuides);
				removeFromArray(nonGuide, nonGuides);
				this.enablingPlayerPairs.push([guide, nonGuide]); 
			}
			
		}
		
		return this.enablingPlayerPairs.length > 0;

	}
	
	//out of available players.
	this.findGuidesAndNonGuides = function(){
		var ret = [[],[]];
		for(var i = 0; i<this.session.availablePlayers.length; i++){
			var possibleGuide = this.session.availablePlayers[i];
			if(possibleGuide.aspect == "Doom" || possibleGuide.aspect == "Life"){
				if(possibleGuide.class_name == "Seer" ||  possibleGuide.class_name == "Page" || possibleGuide.class_name == "Bard" || possibleGuide.class_name == "Rogue" ||  possibleGuide.class_name == "Maid"){
						ret[0].push(possibleGuide);
				}
			}
		}
		
		//either an active life/doom player, or any non life/doom player.
		for(var i = 0; i<this.session.availablePlayers.length; i++){
			var possibleGuide = this.session.availablePlayers[i];
			if(possibleGuide.class_name == "Heir" ||  possibleGuide.class_name == "Thief" || possibleGuide.class_name == "Prince" || possibleGuide.class_name == "Witch" ||  possibleGuide.class_name == "Sylph" || possibleGuide.class_name == "Knight" ||  possibleGuide.class_name == "Mage"){
				ret[1].push(possibleGuide);
			}else if(possibleGuide.aspect != "Doom" && possibleGuide.aspect != "Life"){
				ret[1].push(possibleGuide);
			}
		}
		return ret;
	}

	//IMPORTANT, ONLY SET AVAILABLE STATUS IF YOU ACTUALLY DO YOUR THING. DON'T SET IT HERE. MIGHT TRIGGER WITH A PRINCE WHO DOESN'T HAVE ANY DEAD SELVES TO DESTROY.
	this.renderContent = function(div){
		console.log("rendering content for life stuff (won't necessarily be on screen): " + this.enablingPlayerPairs.length + " " + this.session.session_id)
		//div.append("<br>"+this.content());
		for(var i = 0; i<this.enablingPlayerPairs.length; i++){
			var player = this.enablingPlayerPairs[i][0];
			var other_player = this.enablingPlayerPairs[i][0]; //could be null or a corpse.
			if(player.dead){
				if(player.class_name == "Heir" ||  player.class_name == "Thief"){
					this.destroyDeadForReviveSelf(div, player);
				}
			}else{
				console.log("player is not dead")
				if(player.class_name == "Mage" ||  player.class_name == "Knight"){
					this.communeDead(div, "", player, player.class_name);
				}else if((player.class_name == "Seer" ||  player.class_name == "Page") && other_player && !other_player.dead){
					this.helpPlayerCommuneDead(div, player, other_player);
				}else if(player.class_name == "Prince"){
					this.destroyDeadForPower(div, player);
				}else if(player.class_name == "Bard" && other_player && !other_player.dead){
					this.helpPlayerDestroyDeadForPower(div, player, other_player);
				}else if((player.class_name == "Rogue" ||  player.class_name == "Maid") && other_player && other_player.dead){
					this.helpDestroyDeadForReviveSelf(div, player, other_player);
				}else if((player.class_name == "Witch" ||  player.class_name == "Sylph") && !this.session.dreamBubbleAfterlife ){
					this.enableDreamBubbles(div, player);
				}else if(this.session.dreamBubbleAfterlife){
					this.dreamBubbleAfterlifeAction(div, player);
				}
			}
		}
	}
	
	
	


	//only when dream bubble afterlife is true. 1-4 players returned?
	this.findGhostsToCommuneWith = function(div, player){
		

	}

	//different flavor of afterlife based on derse or prospit?  derse has horror terror everywhere. prospit after life is filled with visions of the alpha timeline, taunting you.
	//so...if derse bubbles are Tumblr, then prospit are facebook (full of envy)
	//hang out with some random ghosts, get power boost. player on left, pile of ghosts on right.
	this.dreamBubbleAfterlifeAction = function(div, player){
		console.log("TODO dream bubble stuff: " + player.titleBasic() +  this.session.session_id);
	}
	
	//need to be consistent or I won't be able to do active/passive split the way I want.
	this.getCanvasIdForPlayer = function(player){
		
	}
	
	//have an array of "ghost warriors" or some shit. during boss fights, explicitly use them, rendered and everything. knights/pages cause this
	//mages/knights call this directly.    flavor text of knowledge or power.  huge bonus if it's your guardian.
	//renders itself and returns if it rendered anything.
	//str is empty if I'm calling this myself, and has a line about so and so helping you do this if helper.
	this.communeDead = function(div, str, player, playerClass){  //takes in player class because if there is a helper, what happens is based on who THEY are not who the player is.
		console.log("TODO  commune dead for: "+ player.titleBasic() + this.session.session_id);
		var ghost = this.session.afterLife.findGuardianSpirit(player);
		var ghostName = "";
		if(ghost){
			//talk about getting wisdom/ forging a pact with your dead guardian. different if i am mage or knight (because i am alone)
			ghostName = "teen ghost version of their ancestor"
			
		}
		if(ghost == null) ghost = this.session.afterLife.findLovedOneSpirit(player);
		
		if(ghost){
			ghostName = "ghost of a loved one"
		}
		
		if(ghost == null) ghost = this.session.afterLife.findAnyAlternateSelf(player);
		if(ghost){
			ghostName = "less fortunate alternate self"
		}
		
		if(ghost == null) ghost = this.session.afterLife.findAnyAlternateSelf(player);
		if(ghost){
			ghostName = "dead player"
		}
		
		if(ghost){
			div.append(str + this.communeDeadResult(playerClass, player, ghost, ghostName));
			this.drawCommuneDead(div, player, ghost);
			removeFromArray(player, this.session.availablePlayers);
			return true;
		}else{
			console.log("no ghosts to commune dead for: "+ player.titleBasic() + this.session.session_id);
			return false;
		}
	}
	
	
	
	this.drawCommuneDead = function(div, player, ghost){
		var canvasHTML = "<br><canvas id='" + this.getCanvasIdForPlayer(player) +"' width='" +canvasWidth + "' height="+canvasHeight + "'>  </canvas>";
		div.append(canvasHTML);
		var canvas = document.getElementById(this.getCanvasIdForPlayer(player));
		var pSpriteBuffer = getBufferCanvas(document.getElementById("sprite_template"));
		drawSprite(pSpriteBuffer,player)
		var gSpriteBuffer = getBufferCanvas(document.getElementById("sprite_template"));
		drawSpriteTurnways(pSpriteBuffer,ghost)
		//leave room on left for possible 'guide' player.
		copyTmpCanvasToRealCanvasAtPos(canvas, pSpriteBuffer,400,0)
		copyTmpCanvasToRealCanvasAtPos(canvas, gSpriteBuffer,800,0)
	}
	
	this.communeDeadResult = function(playerClass, player, ghost, ghostName){
		
		if(playerClass == "Knight" || playerClass == "Page"){
			player.ghostPacts.push(ghost);  //help with a later fight.
			return " The " +player.htmlTitleBasic() + " gains a promise of aid from the " + ghostName + ". ";
		}else if(playerClass == "Seer" || playerClass == "Mage"){
			player.power += ghost.power/2;  //direct knowledge (and as we all know, knowledge is power)
			player.aspectIncreasePower(ghost.power/2); //want to increase aspect stats, too.
			return " The " +player.htmlTitleBasic() + " gains valuable wisdom from the " + ghostName + ". Their power grows.";
		}
	}

	//seers/pages call this which calls communeDeadForKnowledge. seer/page gets boost at same time.
	this.helpPlayerCommuneDead = function(div, player1, player2){
			console.log("TODO  help commune dead for: "+ player1.titleBasic() + this.session.session_id);
			var divID = (div.attr("id")) + "_communeDeadWithGuide"+player1.chatHandle ;
			div.append("<div id ="+divID + "></div>")
			var childDiv = $("#"+divID)
			var text = "";
			if(player1.class_name == "Seer"){
				text += "The " + player1.htmlTitleBasic() + " guides the " + player2.htmlTitleBasic() + " to seek knowledge from the dead. "
			}else if(player1.class_name == "Page"){
				text += "The " + player1.htmlTitleBasic() + " guides the " + player2.htmlTitleBasic() + " to seek aid from the dead. "
			}
			var ghostCommunedWith = this.communeDead(childDiv, text, player2, player1.class_name);
			if(ghostCommunedWith){
				removeFromArray(player1, this.session.availablePlayers);
				console.log("Help communing with the dead: " + this.session.session_id);
				
				var canvas = document.getElementById(this.getCanvasIdForPlayer(player2));
				var pSpriteBuffer = getBufferCanvas(document.getElementById("sprite_template"));
				drawSprite(pSpriteBuffer,player1)
				copyTmpCanvasToRealCanvasAtPos(canvas, pSpriteBuffer,0,0)
			}
	}



	//prince drains their own ghosts and takes their power.  if not prince, can be anybody you drain. mention 'it will be a while before the ghost of X respawns' don't bother actually respawning them , but makes it different than double death
	this.destroyDeadForPower = function(div, player){
		console.log("TODO drain dead for power: "+ player.titleBasic()  + this.session.session_id);
	}

	//bards call this to power up somebody else with the dead. they gain power at same time.
	this.helpPlayerDestroyDeadForPower = function(div, player1, player2){
		console.log("TODO help drain dead for power: "+ player.titleBasic() + this.session.session_id);
	}

	//thief/heir of life/doom //flavor text of absorbing or stealing.  mention 'it will be a while before the ghost of X respawns' don't bother actually respawning them , but makes it different than double death
	this.destroyDeadForReviveSelf = function(div, player){
		console.log("TODO drain dead for revive: "+ player.titleBasic() + this.session.session_id);
	}

	//rogue/maid of life/doom
	this.helpDestroyDeadForReviveSelf = function(div, player1, player2){
		console.log("TODO  help drain dead for revive: "+ player.titleBasic() + this.session.session_id);
	}



	//witches and sylphs do this.  not gonna go with a passive/active whatever here. i just want more odds of dream bubble afterlifes.
	//different flavor of afterlife based on derse or prospit?  derse has horror terror everywhere. prospit after life is filled with visions of the alpha timeline, taunting you.
	this.enableDreamBubbles = function(div, player){
		this.session.dreamBubbleAfterlife = true;
	}

	//for claspects that can recycyle afterlife.
	this.makeAlive = function(d){
		if(d.stateBackup) d.stateBackup.restoreState(d);
		d.influencePlayer = null;
		d.influenceSymbol = null;
		d.dead = false;
		d.murderMode = false;
		d.grimDark = false;
		d.triggerLevel = 1;
		d.leftMurderMode = false; //no scars
		d.victimBlood = null; //clean face
	}

	this.makeDead = function(d){
		//console.log("make dead " + d.title())
		d.dead = true;
	}



	//1.0 mode is so not a thing anymore. just assume this isn't a thing.
	this.content = function(){
		var ret = "TODO: LIfe stuff. for 1.0";

		return ret;

	}

}
