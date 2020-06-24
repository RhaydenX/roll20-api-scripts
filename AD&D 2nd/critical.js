
/* jshint undef: true */
/* globals
 sendChat,
 randomInteger,
 _,
 on
 */

var Critical = (function()
{
    'use strict';
    
	const criticalHit = new Map();
	let t = new Map();
	let l = new Map();
	l.set('legs',[
		{low: 1,  high: 3,  result: "No unusual effect"},
		{low: 4,  high: 4,  result: "Victim knocked down"},
		{low: 5,  high: 5,  result: "Knee struck, knockdown, 1/2 move"},
		{low: 6,  high: 6,  result: "Foot broken, 1/2 move"},
		{low: 7,  high: 7,  result: "Armor damaged, leg injured if target has no armor to cover legs, 1/4 move"},
		{low: 8,  high: 8,  result: "Hip broken, minor bleeding, no move"},
		{low: 9,  high: 9,  result: "Armor damaged, leg broken if target has no armor to cover legs, no move"},
		{low: 10,  high: 10,  result: "Knee shattered, no move, –2 penalty to attacks"},
		{low: 11,  high: 11,  result: "Hip shattered, minor bleeding, no move or attack"},
		{low: 12,  high: 12,  result: "Leg shattered, no move or attack, major bleeding from compoundfractures"},
		{low: 13,  high: 99,  result: "Leg shattered, no move or attack, major bleeding from compoundfractures, triple damage dice"}
	]);
	l.set('abdomen', [
		{low: 1,  high: 3,  result: "No unusual effect"},
		{low: 4,  high: 4,  result: "Victim stunned 1d6 rounds"},
		{low: 5,  high: 5,  result: "Abdomen struck, victim stunned 1 round and reduced to 1/2 move"},
		{low: 6,  high: 6,  result: "Armor damaged, victim stunned 1d6 rounds, triple damage if no armor"},
		{low: 7,  high: 7,  result: "Abdomen injured, 1/2 move, –2 penalty to attacks"},
		{low: 8,  high: 8,  result: "Abdomen injured, minor internal bleeding, 1/2 move and –2 penalty to attacks"},
		{low: 9,  high: 9,  result: "Armor damage, abdomen injured, minor bleeding, 1/2 move and –2 penalty to attacks"},
		{low: 10,  high: 10,  result: "Abdomen injured, no move or attack, minor internal bleeding"},
		{low: 11,  high: 11,  result: "Abdomen crushed, no move or attack, major internal bleeding"},
		{low: 12,  high: 12,  result: "Abdomen crushed, victim reduced to 0 hit points with severe internal bleeding"},
		{low: 13,  high: 99,  result: "Abdomen crushed, victim reduced to 0 hit points with severe internal bleeding, triple damage dice"}
	]);
	l.set('torso', [
		{low: 1,  high: 3,  result: "No unusual effect"},
		{low: 4,  high: 4,  result: "Knockdown, stunned 1d4 rounds"},
		{low: 5,  high: 5,  result: "Torso struck, victim stunned 1 round and reduced to 1/2 move"},
		{low: 6,  high: 6,  result: "Shield damage, torso struck, 1/2 move"},
		{low: 7,  high: 7,  result: "Armor damage, torso struck, 1/2 move, –2 penalty to attacks"},
		{low: 8,  high: 8,  result: "Torso injured, minor internal bleeding, no move or attack"},
		{low: 9,  high: 9,  result: "Ribs broken, minor internal bleeding, 1/2 move, –2 penalty to attacks"},
		{low: 10,  high: 10,  result: "Ribs broken, major internal bleeding, no move or attack"},
		{low: 11,  high: 11,  result: "Torso crushed, victim reduced to 0 hit points with severe internal bleeding"},
		{low: 12,  high: 99,  result: "Torso crushed, victim killed"}
	]);
	l.set('arms', [
		{low: 1,  high: 3,  result: "No unusual effect"},
		{low: 4,  high: 4,  result: "Hand struck, weapon/shield dropped"},
		{low: 5,  high: 5,  result: "Arm struck, shield damage/weapon dropped"},
		{low: 6,  high: 6,  result: "Hand broken, –2 penalty to attacks/shield dropped"},
		{low: 7,  high: 7,  result: "Armor damage, arm broken if victim has no armor to cover limb"},
		{low: 8,  high: 8,  result: "Shield damage, arm broken, stunned 1 round"},
		{low: 9,  high: 9,  result: "Weapon dropped, arm broken, stunned 1d4 rounds"},
		{low: 10,  high: 10,  result: "Shoulder injured, no attacks, minor bleeding"},
		{low: 11,  high: 11,  result: "Arm shattered, 1/2 move, no attacks, minor bleeding"},
		{low: 12,  high: 12,  result: "Shoulder shattered, no move or attacks, major bleeding"},
		{low: 13,  high: 99,  result: "Shoulder shattered, no move or attacks, major bleeding, triple damage dice"}
	]);
	l.set('head', [
		{low: 1,  high: 3,  result: "No unusual effect"},
		{low: 4,  high: 4,  result: "Victim stunned 1d6 rounds"},
		{low: 5,  high: 5,  result: "Head struck, helm removed, victim stunned 1 round; –2 penalty to attack rolls if victim had no helm"},
		{low: 6,  high: 6,  result: "Head struck, –2 penalty to attacks"},
		{low: 7,  high: 7,  result: "Helm damaged, face injured, stunned 1d6 rounds, 1/2 move, –4 penalty to attacks"},
		{low: 8,  high: 8,  result: "Skull broken, helm damaged, victim reduced to 0 hit points and unconscious 1d4 hours"},
		{low: 9,  high: 9,  result: "Face crushed, minor bleeding, no move or attack, Cha drops by 2 points permanently"},
		{low: 10,  high: 10,  result: "Head injured, unconscious 1d6 days, lose 1 point each of Int/Wis/Cha permanently"},
		{low: 11,  high: 11,  result: "Skull crushed, reduced to 0 hit points, major bleeding, Int, Wis, Cha all drop by 1/2 permanently"},
		{low: 12,  high: 99,  result: "Skull crushed, immediate death"}
	]);
	t.set('h', l);
    criticalHit.set('b', t);
	const location = new Map();
	location.set('h', [
		{low: 1, high: 4, result: "legs"},
		{low: 5, high: 5, result: "abdomen"},
		{low: 6, high: 7, result: "torso"},
		{low: 8, high: 9, result: "arms"},
		{low: 10, high: 10, result: "head"}
	]);
	location.set('a', [
		{low: 1, high: 4, result: "legs/wings"},
		{low: 5, high: 5, result: "tail"},
		{low: 6, high: 7, result: "abdomen"},
		{low: 8, high: 9, result: "torso"},
		{low: 10, high: 10, result: "head"}
	]);
	location.set('m', [
		{low: 1, high: 4, result: "legs/wings"},
		{low: 5, high: 5, result: "tail"},
		{low: 6, high: 7, result: "abdomen"},
		{low: 8, high: 9, result: "torso"},
		{low: 10, high: 10, result: "head"}
	]);
	

	function registerEventHandlers()
	{
		on('chat:message', Critical.handleChatMessage);
	}

	/**
	 * Grab chat message objects
	 *
	 * @param {object} msg
	 */
	function handleChatMessage(msg)
	{

		// Check if we are dealing with a !critical command.
		if (msg.type === "api" && msg.content.indexOf("!critical") !== -1)
		{
			var content = msg.content;
			var words = content.split(' ');

			// Sanity check
			if (words.length > 0)
			{
				// Sanity check
				if (words[0] === '!critical')
				{
					var target = '';
					var severity = 0;
					var type = '';
					var loc = 0;

					// check for target
					if (words[1].charAt(0).toLowerCase() === 'h' || words[1].charAt(0).toLowerCase() === 'a' || words[1].charAt(0).toLowerCase() === 'm')
					{
						target = words[1].charAt(0).toLowerCase();
					}
					else
					{
						sendChat('Critical Hit', 'Invalid target given, or something went wrong.');
					}

					//check for severity
					switch(words[2].toLowerCase()) 
					{
						case 'minor':
							severity = randomInteger(6);
							break;
						case 'major':
							severity = randomInteger(4) + randomInteger(4);
							break;
						case 'severe':
							severity = randomInteger(6) + randomInteger(6);
							break;
						case 'mortal':
							severity = randomInteger(8) + randomInteger(8);
							break;
						default:
							sendChat('Critical Hit', 'Invalid severity given, or something went wrong.');
					}

					// check for weapon type
					if (words[3].charAt(0).toLowerCase() === 'b' || words[3].charAt(0).toLowerCase() === 'p' || words[3].charAt(0).toLowerCase() === 's')
					{
						type = words[3].charAt(0).toLowerCase();
					}
					else
					{
						sendChat('Critical Hit', 'Invalid weapon type given, or something went wrong.');
					}

					//check for location
					if  (words.length > 4)
					{
						switch(words[4].toLowerCase()) 
						{
							case 'low':
								loc = randomInteger(6);
								break;
							case 'high':
								loc = randomInteger(6) + 4;
								break;
							default:
								sendChat('Critical Hit', 'Invalid location given, or something went wrong.');
						}
					}
					else 
					{
						loc = randomInteger(10);
					}
					
					var location = Critical._determineLocation(target, loc)
					
					// Get the smack object as a smash variable
					var smash = Critical._determineCritical(target, severity, type, location.result);

					// Sanity check
					if (smash)
					{
						// Send the critical result as a formatted string in chat
						sendChat('Critical Hit', smash.result);
					}
					else
					{
						sendChat('Critical Hit', 'Invalid % roll given, or something went wrong. GM makes something up.');
					}
				}
			}
		}
	}

	/**
	 * Internal function given the roll value and target determines the location of the critical
	 *
	 * @param {int} roll
	 * @return {object} smack
	 * @private
	 */
	function _determineLocation(target, roll)
	{
		return _.find(location.get(target), function (hit)
		{
			return (roll >= hit.low && roll <= hit.high);
		});
	}

	/**
	 * Internal function given the roll value returns the object indicating the result and effect.
	 *
	 * @param {int} roll
	 * @return {object} smack
	 * @private
	 */
	function _determineCritical(target, severity, type, location)
	{
		// Use _.find to figure out what happened.
		return _.find(criticalHit.get(type).get(target).get(location), function (hit)
		{
			return (severity >= hit.low && severity <= hit.high);
		});
	}

	return {
		registerEventHandlers: registerEventHandlers,
		handleChatMessage: handleChatMessage,
		_determineCritical: _determineCritical,
		_determineLocation: _determineLocation
		}
}());

/**
 * Fires when the page has loaded.
 */
on("ready", function()
{
	Critical.registerEventHandlers();
});
