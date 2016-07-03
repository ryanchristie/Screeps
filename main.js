require('prototype.spawn')();
var getLife = require('get.life');
var roleHarvester = require('role.harvester');
var roleRepairer = require('role.repairer');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {
    
    for(let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing dead creep memory: ', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    
    var energy = Game.spawns.Spawn1.room.energyCapacityAvailable;
    var name = "undefined";
    
    if(harvesters.length < 4) {
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'harvester');
        if (name == ERR_NOT_ENOUGH_ENERGY && harvesters.length < 2) {
            name = Game.spawns.Spawn1.createCustomCreep(Game.spawns.Spawn1.room.energyAvailable, 'harvester');
        }
        if(!(name < 0)) console.log('Spawning harvester: ' + name);
    }
    else if(upgraders.length < 2) {
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'upgrader');
        if(!(name < 0)) console.log('Spawning upgrader: ' + name);
    }
    else if(repairers.length < 2) {
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'repairer');
        if(!(name < 0)) console.log('Spawning repairer: ' + name);
    }
    else if(builders.length < 2) {
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'builder');
        if(!(name < 0)) console.log('Spawning builder: ' + name);
    }
    
    for(let name in Game.creeps) {
        var creep = Game.creeps[name];
        if(!creep.memory.needsRenew && (creep.ticksToLive <= creep.pos.getRangeTo(creep.pos.findClosestByPath(FIND_MY_SPAWNS)) * _.sum(_.map(creep.body, (x) => x.type == MOVE ? -2 : 2)))) {
            creep.memory.needsRenew = true;
            creep.say('Heals!');
	    }
	    if(creep.memory.needsRenew) {
	        getLife.run(creep);
	    }
	    else {
            switch (creep.memory.role) {
                case 'harvester': roleHarvester.run(creep);
                break;
                
                case 'builder': roleBuilder.run(creep);
                break;
                
                case 'upgrader': roleUpgrader.run(creep);
                break;
                
                case 'repairer': roleRepairer.run(creep);
                break;
                
                default: console.log(name + ' needs a job.');
                break;
            }
	    }
    }
}