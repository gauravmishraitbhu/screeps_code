var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repairwall')
var spawner = require('creep.spawner2')
var structureUtils = require('structure.utils')
var creepConfig = require('creep.config')
var globalConfig = require('config');
var towerController = require('towerController')

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

        if(Game.rooms[name].energyAvailable % 10 == 0){
            console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
        }

        var room = Game.rooms[name];


        var buildings = room.find(FIND_MY_STRUCTURES , {filter : {structureType : STRUCTURE_CONTROLLER}})
        var controller = buildings[0];


        Memory.currentLevel = controller.level;

        creepConfig.setControllerLevel(controller.level);


        globalConfig.setRoomName(name);

        // var walls = Game.rooms[name].find(Game.STRUCTURE_WALL );
        // console.log(walls.length)
    }

    var creepCounterMap = creepConfig.getTargetCountMap();
    spawner.checkAndSpawnCreeps(creepCounterMap);


    //terrain.delete();
    var tower = Game.getObjectById('5777e19ce98dffe17bf23dda');
    if(tower) {
        towerController.run(tower);
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