
var structuresByType = {};
var constructionSitesByType = {};

module.exports = {

    updateStructureList : function(){


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
    }
}