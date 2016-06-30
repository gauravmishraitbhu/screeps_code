var structureUtils = require('structure.utils')

var config = require('config')
var creepTypes = require('creep.types')

var creepType = creepTypes.REPAIR_WALL;


var roleRepair = {

    /** @param {Creep} creep **/
    run: function(creep ) {

        // console.log(wallIds.length)

        var wallToRepair = null;
        var wallIds = structureUtils.getWallObjectIds();

        for(var i = 0 ; i< wallIds.length ; i++){
            var wall = Game.getObjectById(wallIds[i]);
            //console.log(JSON.stringify(wall))
            if(wall){
                // console.log(wall.structureType);
                // console.log(wall.hits);
                if( (wall.structureType == STRUCTURE_WALL )
                    && wall.hits < 3100){
                    wallToRepair = wall;
                    break;
                }
            }

        }


        
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	    }

	    if(creep.memory.building) {

            if(wallToRepair == null){
                creep.say("stuckB");
            }

            if(creep.repair(wallToRepair) == ERR_NOT_IN_RANGE) {
                creep.moveTo(wallToRepair);
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