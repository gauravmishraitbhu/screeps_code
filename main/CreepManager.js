var CREEP_TYPES = require('creep.types')
var harvesterController = require('role.harvester')
var builderController = require('role.builder')
var upgraderController = require('role.upgrader');
var repairController = require('role.repairwall')
var StructureManager = require('StructureManager')

var creepListByType = {}

module.exports = {

    /**
     * should be called once every tick
     */
    updateCreepInfo : function(){

        Object.keys(CREEP_TYPES).forEach(function(key){
            var creepType = CREEP_TYPES[key];
            creepListByType[creepType] = [];

        })

        for( let name in Game.creeps ) {
            let creep = Game.creeps[name];

            creepListByType[creep.memory.role].push(creep);
        }
    },

    /**
     * should be called once every tick
     */
    freeDeadCreepMemory : function(){
        for(let name in Memory.creeps) {
            //console.log(JSON.stringify(Game.creeps[name]))
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    },

    getCurrentCreepCountMap : function(){
        var countMap = {};

        for ( let creepType in creepListByType ){
            var creepList = creepListByType[creepType];
            countMap[creepType] = creepList.length;
        }

        return countMap;
    },

    processNextTick : function(){
        // harvester creeps
        var harvesterCreeps = creepListByType[CREEP_TYPES.HARVESTER]

        harvesterCreeps.forEach(function(creep){

            if(creep.memory.currentTarget){
                //check if currentTarget needs to change
                let currentTarget = creep.memory.currentTarget;
                if(currentTarget.energy == currentTarget.energyCapacity){
                    //switch target
                    creep.memory.currentTarget = getNextTargetToHarvest();
                }
            }else{
                // new creep so get one target
                creep.memory.currentTarget = getNextTargetToHarvest();
            }
            harvesterController.run(creep);
        })


        //builder creeps
        var builderCreeps = creepListByType[CREEP_TYPES.BUILDER]
        builderCreeps.forEach(function(creep){
            builderController.run(creep);
        })

        //repair creeps
        var repairCreeps = creepListByType[CREEP_TYPES.REPAIR]
        repairCreeps.forEach(function(creep){
            repairController.run(creep);
        })

        //upgrader creeps
        var upgraderCreeps = creepListByType[CREEP_TYPES.UPGRADER]
        upgraderCreeps.forEach(function(creep){
            upgraderController.run(creep);
        })
    }
}


function getNextTargetToHarvest(){
    var structures = StructureManager.getHarvestableStructures();

    var HARVESTER_PRIORITY = {
    }
    HARVESTER_PRIORITY[STRUCTURE_EXTENSION] = 1;
    HARVESTER_PRIORITY[STRUCTURE_SPAWN] = 2;
    HARVESTER_PRIORITY[STRUCTURE_TOWER] = 3;

    //prioritize extention then spawn then tower
    structures.sort(function(target1 , target2){
        let priority1 = HARVESTER_PRIORITY[target1.structureType];
        let priority2 = HARVESTER_PRIORITY[target2.structureType];

        return priority1 - priority2;
    })

    return structures[0];
}