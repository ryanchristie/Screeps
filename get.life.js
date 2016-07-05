/* //Efficiency reduced
var getLife = {
    run: function(creep) {
	    
	    if(!creep.memory.needsRenew && (creep.ticksToLive <= creep.pos.getRangeTo(creep.pos.findClosestByPath(FIND_MY_SPAWNS)) * _.sum(_.map(creep.body, (x) => x.type == MOVE ? -2 : 2)))) {
            creep.memory.needsRenew = true;
            creep.say('Heals!');
	    }
	    if(creep.memory.needsRenew) {
	        getLife.run(creep);
	    }
	    else {}
	    
	    var target = Game.spawns.Spawn1;
	    
	    if(creep.memory.needsRenew && (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) && (target.renewCreep(creep) == ERR_NOT_IN_RANGE)) {
	        creep.moveTo(target, { reusePath: 10 });
	    }
	    else if(target.renewCreep(creep) == ERR_FULL || target.renewCreep(creep) == ) {
	        creep.memory.needsRenew = false;
	        creep.say('Done!');
	    }
        
    }
}

module.exports = getLife;
*/