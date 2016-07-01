var structureUtils = require('structure.utils')

var config = require('config')
var creepTypes = require('creep.types')

var creepType = creepTypes.REPAIR_WALL;


var roleRepair = {

    /** @param {Creep} creep **/
    run: function(creep ) {

        // console.log(wallIds.length)



        var objectToRepair = null;
        var wallAndRoads = creep.room.find(FIND_STRUCTURES,{
            filter : (structure) => (structure.structureType == STRUCTURE_WALL ||
            structure.structureType == STRUCTURE_ROAD)
        })

        objectToRepair = getObjectToRepair(wallAndRoads);


        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if(creep.memory.building) {

            if(objectToRepair == null){
                creep.say("stuckB");
            }

            if(creep.repair(objectToRepair) == ERR_NOT_IN_RANGE) {
                creep.moveTo(objectToRepair);
            }

        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            var sourceNum = getSourceNum();
            if(creep.harvest(sources[sourceNum]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[sourceNum]);
            }
        }
    }
};

function getSourceNum(){
    var sourceMap = config.SOURCES;
    return sourceMap[creepType];
}

function getObjectToRepair(wallsAndRoads){
    var wallPriority = false;
    if(Memory.currentLevel <= 2){
        wallPriority = true;
    }

    var wallToRepair;
    var roadToRepair;
    for( let i = 0 ; i < wallsAndRoads.length; i++){
        let structure = wallsAndRoads[i];

        if(structure.structureType == STRUCTURE_ROAD
            && structure.hits < 0.75 *structure.hitsMax){
            roadToRepair = structure;
            break;
        }
    }


    for( let i = 0 ; i < wallsAndRoads.length; i++){
        let structure = wallsAndRoads[i];

        if(structure.structureType == STRUCTURE_WALL && structure.hits < 10000){
            wallToRepair = structure;
            break;
        }
    }

    if(wallPriority || roadToRepair == null){
        return wallToRepair;
    }else {
        return roadToRepair;
    }

}

module.exports = roleRepair;