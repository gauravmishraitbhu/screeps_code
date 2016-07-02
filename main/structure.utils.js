var config = require('config')


module.exports = {
    updateStructures : function(){
        var room = Game.rooms[config.getRoomName()];

        //var roomData = room.lookAtArea(0,0,49,49);
        var roomData = {};
        for (var i = 0;i<50;i++){
            for(var j=0;j<50 ;j++){
                var  objects = room.lookAt(i,j);
                if(!roomData[i]){
                    roomData[i] = {};
                }

                if(roomData[i][j] == null){
                    roomData[i][j] = [];
                }

                roomData[i][j] = objects;
            }
        }

        Memory.roomData = roomData;

    },

    getWallObjectIds : function(){
        var roomData = Memory.roomData;
        var wallObjects = [];
        for( var i=0 ; i<50 ; i++ ){
            for( var j=0 ; j<50 ; j++ ){
                var objects = roomData[i][j];

                objects.forEach(function(object){
                    if(object.type == "structure" && object.structure.structureType == STRUCTURE_WALL){
                        wallObjects.push(object.structure.id);
                    }
                })
            }
        }

        return wallObjects;
    },

    getCurrentEnergetCapacity : function(){

        var harvesterCount = 0;

        for(var name in Game.creeps) {
            //check if creep is still alive


            //check and count roles.
            var creep = Game.creeps[name];
            if(creep.memory.role == "harvester"){
                harvesterCount ++;
            }

        }

        if(harvesterCount == 0){
            return 300;
        }else{
            var room = Game.rooms[config.getRoomName()];
            var buildings = room.find(FIND_MY_STRUCTURES , {filter : {structureType : STRUCTURE_EXTENSION}})

            return 300 + buildings.length * 50;
        }


    }
}
