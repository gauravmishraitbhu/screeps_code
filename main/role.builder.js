var config = require('config')

var creepType = "builder";

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	    }

	    if(creep.memory.building) {
	        //creep.say("building")
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                    
                }
            }
	    }
	    else {
	        //creep.say("harvest")
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

module.exports = roleBuilder;