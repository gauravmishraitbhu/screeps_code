
var structuresByType = {};

module.exports = {

    updateStructureList : function(){


        for(var name in Game.rooms) {

            var room = Game.rooms[name];

            var structures = creep.room.find(FIND_STRUCTURES)

            structures.forEach(function(structure){
                if( ! structuresByType[structure.structureType] ){
                    structuresByType[structure.structureType] = []
                }

                structuresByType[structure.structureType].push(structure);
            })
        }
    },

    getStructuresOfType : function(type){
        return structuresByType[type];
    }
}