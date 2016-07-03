var getLife = {
    run: function(creep) {
	    
	    var target = Game.spawns.Spawn1;
	    
	    if(creep.memory.needsRenew && target.renewCreep(creep) == ERR_NOT_IN_RANGE) {
	        creep.moveTo(target);
	    }
	    else if(target.renewCreep(creep) == ERR_FULL) {
	        creep.memory.needsRenew = false;
	        creep.say('Done!');
	    }
        
    }
}

module.exports = getLife;