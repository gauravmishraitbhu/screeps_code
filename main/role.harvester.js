var config = require('config')
var creepTypes = require('creep.types')

var creepType = creepTypes.HARVESTER;

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //creep.say("cap---"+creep.carryCapacity)
	    if(creep.carry.energy < creep.carryCapacity) {
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