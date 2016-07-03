var roleUpgrader = require('role.upgrader');

var roleBuilder = {

    /** @param {Creep} creep **/
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
	        var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if(target != undefined) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                roleUpgrader.run(creep);
            }
	    }
	    else {
	        var toFull = creep.carryCapacity - creep.carry.energy;
            var source = creep.pos.findClosestByPath(FIND_SOURCES, {
                filter: (e) => e.energy > toFull
            });
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
	    }
	}
};

module.exports = roleBuilder;