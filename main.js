require('prototype.spawn')();
//var getLife = require('get.life');
var roleHarvester = require('role.harvester');
var roleRepairer = require('role.repairer');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMason = require('role.mason');

module.exports.loop = function () {
    
    for(let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing dead creep memory: ', name);
        }
    }
    
    var towers = Game.rooms.E34N18.find(FIND_MY_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_TOWER
    });
    for(let tower of towers) {
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target != undefined) {
            tower.attack(target);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var masons = _.filter(Game.creeps, (creep) => creep.memory.role == 'mason');
    
    var energy = Game.spawns.Spawn1.room.energyCapacityAvailable;
    var name = "undefined";
    
    if(harvesters.length < 2) {
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'harvester');
        if (name == ERR_NOT_ENOUGH_ENERGY && harvesters.length < 1) {
            name = Game.spawns.Spawn1.createCustomCreep(Game.spawns.Spawn1.room.energyAvailable, 'harvester');
        }
        if(!(name < 0)) console.log('Spawning harvester: ' + name);
    }
    else if(upgraders.length < 1) {
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'upgrader');
        if(!(name < 0)) console.log('Spawning upgrader: ' + name);
    }
    else if(repairers.length < 1) {
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'repairer');
        if(!(name < 0)) console.log('Spawning repairer: ' + name);
    }
    else if(masons.length < 2) {
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'mason');
        if(!(name < 0)) console.log('Spawning mason: ' + name);
    }
    else if(builders.length < 1) {
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'builder');
        if(!(name < 0)) console.log('Spawning builder: ' + name);
    }
    
    for(let name in Game.creeps) {
        var creep = Game.creeps[name];
        switch (creep.memory.role) {
            case 'harvester': roleHarvester.run(creep);
            break;
            
            case 'builder': roleBuilder.run(creep);
            break;
            
            case 'upgrader': roleUpgrader.run(creep);
            break;
            
            case 'repairer': roleRepairer.run(creep);
            break;
            
            case 'mason': roleMason.run(creep);
            break;
            
            default: console.log(name + ' needs a job.');
            break;
        }
    }
}