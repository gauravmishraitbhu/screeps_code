var config = require('config')
var creepTypes = require('creep.types')

var creepType = creepTypes.HARVESTER;

var _ownerRoom;
var _targetRoom;

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var ownerRoomName = config.getRoomName();
        _ownerRoom = Game.rooms[ownerRoomName];
        _targetRoom = Game.flags.Flag1.room;

        if( !creep.memory.mining && creep.carry.energy == 0) {
            creep.memory.mining = true;
        }
        if( creep.memory.mining && creep.carry.energy == creep.carryCapacity) {
            creep.memory.mining = false;
        }


        //creep.say("cap---"+creep.carryCapacity)
        if( !creep.memory.mining ) {
            //creep.say(creep.carry.energy)
            var storage = _ownerRoom.storage;

            if(creep.transfer(storage , RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
            }
        }
        else {

            var sources = _targetRoom.find(FIND_SOURCES);

            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }

        }
    }
};

function getSourceNum(){
    var sourceMap = config.SOURCES;
    return sourceMap[creepType];
}

module.exports = roleHarvester;