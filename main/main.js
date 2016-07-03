var CreepManager = require('CreepManager')
var spawner = require('creep.spawner2')
var structureUtils = require('structure.utils')
var creepConfig = require('creep.config')
var globalConfig = require('config');
var towerController = require('towerController')
var StructureManager = require('StructureManager')

module.exports.loop = function () {

    PathFinder.use(true);

    StructureManager.updateStructureList();

    CreepManager.freeDeadCreepMemory();
    CreepManager.updateCreepInfo();

    for(var name in Game.rooms) {

        if(Game.time % 10 == 0){
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

    CreepManager.processNextTick();
}