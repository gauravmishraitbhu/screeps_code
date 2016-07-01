var structureUtils = require('structure.utils')

var config = require('config')
var creepTypes = require('creep.types')

var creepType = creepTypes.REPAIR_WALL;


var roleRepair = {

    /** @param {Creep} creep **/
    run: function(creep ) {

        // console.log(wallIds.length)


        //var wallIds = structureUtils.getWallObjectIds();
        //
        //for(var i = 0 ; i< wallIds.length ; i++){
        //    var wall = Game.getObjectById(wallIds[i]);
        //    //console.log(JSON.stringify(wall))
        //    if(wall){
        //        // console.log(wall.structureType);
        //        // console.log(wall.hits);
        //        if( (wall.structureType == STRUCTURE_WALL )
        //            && wall.hits < 3100){
        //            wallToRepair = wall;
        //            break;
        //        }
        //    }
        //
        //}

        var objectToRepair = null;
        var wallAndRoads = creep.room.find(FIND_STRUCTURES,{
            filter : (structure) => (structure.structureType == STRUCTURE_WALL ||
            structure.structureType == STRUCTURE_ROAD)
        })



        for(var i = 0 ; i < wallAndRoads.length ; i++){
            let structure = wallAndRoads[i];

            if(structure.structureType == STRUCTURE_ROAD
                && structure.hits < structure.hitsMax/2){
                objectToRepair = structure;
                break;
            }

            if(structure.structureType == STRUCTURE_WALL && structure.hits < 50000){
                objectToRepair = structure;
                break;
            }


        }



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

module.exports = roleRepair;