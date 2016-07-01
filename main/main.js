var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repairwall')
var spawner = require('creep.spawner')
var structureUtils = require('structure.utils')
var creepConfig = require('creep.config')
var globalConfig = require('config');

module.exports.loop = function () {

    PathFinder.use(true);



    for(var name in Memory.creeps) {
        //console.log(JSON.stringify(Game.creeps[name]))
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    for(var name in Game.rooms) {
        console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
        var room = Game.rooms[name];


        var buildings = room.find(FIND_MY_STRUCTURES , {filter : {structureType : STRUCTURE_CONTROLLER}})
        var controller = buildings[0];

        var extentionBuilding = room.find(FIND_MY_STRUCTURES , {filter : {structureType : STRUCTURE_EXTENSION}})
        Memory.currentLevel = controller.level;
        if(extentionBuilding.length == 0){
            creepConfig.setControllerLevel(1);
        }else{
            creepConfig.setControllerLevel(controller.level);
        }


        globalConfig.setRoomName(name);

        // var walls = Game.rooms[name].find(Game.STRUCTURE_WALL );
        // console.log(walls.length)
    }

    var creepCounterMap = creepConfig.getTargetCountMap();
    spawner.checkAndSpawnCreeps(creepCounterMap);


    //terrain.delete();
    var tower = Game.getObjectById('64abad5c27a055500aa64abf');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }

        if(creep.memory.role == "repair"){
            roleRepair.run(creep);
        }
    }
}