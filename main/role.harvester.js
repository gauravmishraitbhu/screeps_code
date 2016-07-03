var config = require('config')
var creepTypes = require('creep.types')

var creepType = creepTypes.HARVESTER;


var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {


        if(creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = false;
        }
        if(!creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = true;
        }


        //creep.say("cap---"+creep.carryCapacity)
	    if( !creep.memory.harvesting ) {
	        //creep.say(creep.carry.energy)
            var sources = creep.room.find(FIND_SOURCES);
            var sourceNum = getSourceNum();
            if(creep.harvest(sources[sourceNum]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[sourceNum]);
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
            });

            var HARVESTER_PRIORITY = {
            }
            HARVESTER_PRIORITY[STRUCTURE_EXTENSION] = 1;
            HARVESTER_PRIORITY[STRUCTURE_SPAWN] = 2;
            HARVESTER_PRIORITY[STRUCTURE_TOWER] = 3;

            //prioritize extention then spawn then tower
            targets.sort(function(target1 , target2){
                let priority1 = HARVESTER_PRIORITY[target1.structureType];
                let priority2 = HARVESTER_PRIORITY[target2.structureType];

                return priority1 - priority2;
            })

            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                    //creep.say("move")
                }
            }else{
                creep.say("stuckH")
            }
        }
	}
};

function getSourceNum(){
    var sourceMap = config.SOURCES;
    return sourceMap[creepType];
}

module.exports = roleHarvester;