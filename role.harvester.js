var roleUpgrader = require('role.upgrader');

var roleHarvester = {

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
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_SPAWN 
                             || s.structureType == STRUCTURE_EXTENSION
                             || s.structureType == STRUCTURE_TOWER) 
                             && s.energy < s.energyCapacity
            });
            var stores = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_STORAGE
                            && s.store[RESOURCE_ENERGY] < s.storeCapacity
            });
            
            if(target != undefined) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else if(stores != undefined) {
                if(creep.transfer(stores, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(stores);
                }
            }
            //If everything is full, help the upgraders
            else {
                roleUpgrader.run(creep);
            }
        }
        else {
            var pickups = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
            if(pickups) {
                if(creep.pickup(pickups) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(pickups);
                }
            }
            else {
                var source = creep.room.find(FIND_SOURCES);
                if(creep.harvest(source[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source[0]);
                }
            }
        }
	}
};

module.exports = roleHarvester;