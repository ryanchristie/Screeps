var roleRepairer = require('role.repairer');

var roleMason = {
	run: function(creep) {
		var TARGET_MAX = 150000;
		
		if(creep.memory.working && creep.carry.energy === 0) {
		    creep.memory.targetId  = undefined;
			creep.memory.working = false;
			creep.say('Hungry!');
		}
		if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
			creep.memory.working = true;
			creep.say('Work!');
		}
		
		//if mason creep is working and his memory hasn't been set 
		if(creep.memory.working) {
		    if(creep.memory.targetId == undefined) {
    			var walls  = creep.room.find(FIND_STRUCTURES, {
    				filter: (s) => (s.structureType == STRUCTURE_RAMPART 
    							|| s.structureType == STRUCTURE_WALL) 
    							&& s.hits < TARGET_MAX
    			});
    			if ((walls !== undefined) && (walls.length > 1)) {
    				walls.sort((a,b) => a.hits - b.hits);
    				creep.memory.targetId = walls[0].id;
    			}
    			else {
    			    creep.memory.targetId = 'noTarget';
    			}
		    }
		    if(creep.carry.energy > 0 && creep.memory.targetId != 'noTarget') {
		        var target = Game.getObjectById(creep.memory.targetId);
		        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
    				creep.moveTo(target);
    			}
		    }
			else {
				roleRepairer.run(creep);
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

module.exports = roleMason;