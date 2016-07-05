var roleUpgrader = {
	    
    run: function(creep) {
        
        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('Hungry!');
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('Work!');
        }
    
	    if(creep.memory.working) {
	        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { reusePath: 10 });
            }
        }
        else {
            var toFull = creep.carryCapacity - creep.carry.energy;
            var source = creep.pos.findClosestByPath(FIND_SOURCES, {
                filter: (e) => e.energy > toFull
            });
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { reusePath: 10 });
            }
        }
	}
};

module.exports = roleUpgrader;