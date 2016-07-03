var roleRepairer = require('role.repairer');

var roleHarvester = {

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
            var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_SPAWN 
                            || s.structureType == STRUCTURE_EXTENSION
                            || s.structureType == STRUCTURE_TOWER) 
                            && s.energy < s.energyCapacity
            });
            if(target != undefined) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                roleRepairer.run(creep);
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

module.exports = roleHarvester;