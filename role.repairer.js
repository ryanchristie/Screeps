var roleHarvester = require('role.harvester');

var roleRepairer = {

    run: function(creep) {
        //if creep is working but has no energy go get some
	    if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('Hungry!');
	    }
	    //if creep isn't working but has full energy do some work
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.working = true;
	        creep.say('Work!');
	    }

	    if(creep.memory.working) {
	        //Let masons worry about wall segments
	        var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
	            filter: (s) => (s.structureType != STRUCTURE_WALL 
	                           && s.structureType != STRUCTURE_RAMPART) 
	                           && s.hits < s.hitsMax 
	        });
            if(structure != undefined) {
                if(creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure, { reusePath: 10 });
                }
            }
            //If everything is repaired, help harvesters
            else {
                roleHarvester.run(creep);
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

module.exports = roleRepairer;