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
            var currentTargetId = creep.memory.currentTargetId;
            let currentTarget = Game.getObjectById(currentTargetId);

            if(currentTarget != null) {
                if(creep.transfer(currentTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(currentTarget);
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