
var structuresByType = {};
var constructionSitesByType = {};
var currentRoomName;

module.exports = {

    updateStructureList : function(roomName){

        for(var name in Game.rooms) {
            currentRoomName = name;
        }

        for(var name in Game.rooms) {

            var room = Game.rooms[name];

            var structures = room.find(FIND_STRUCTURES)

            structures.forEach(function(structure){
                if( !structuresByType[structure.structureType] ){
                    structuresByType[structure.structureType] = []
                }

                structuresByType[structure.structureType].push(structure);
            })

            var constructionSites = room.find(FIND_CONSTRUCTION_SITES);

            constructionSites.forEach(function(constructionSite){

                if( !constructionSitesByType[constructionSite.structureType] ){
                    constructionSitesByType[constructionSite.structureType] = []
                }

                !constructionSitesByType[constructionSite.structureType].push(constructionSite);

            })
        }
    },

    /**
     * returns all structures including walls and roads
     * @param type
     * @returns {*}
     */
    getStructuresOfType : function(type){
        return structuresByType[type];
    },

    getConstructionSiteByType : function(type){
        return constructionSitesByType[type];
    },

    getHarvestableStructures : function(){
        var room = Game.games[ currentRoomName ]
        var targets = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });

        return targets;
    }
}