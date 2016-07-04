
var structuresByType = {};
var _constructionSitesByType = {};
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

                if( !_constructionSitesByType[constructionSite.structureType] ){
                    _constructionSitesByType[constructionSite.structureType] = []
                }

                !_constructionSitesByType[constructionSite.structureType].push(constructionSite);

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
        return _constructionSitesByType[type];
    },

    getHarvestableStructures : function(){
        var room = Game.rooms[ currentRoomName ]
        var targets = room.find(FIND_STRUCTURES, {
            filter: (structure) => {

                    if(structure.structureType == STRUCTURE_STORAGE){
                        return structure.store[RESOURCE_ENERGY] < structure.storeCapacity
                    }else{
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity
                    }

            }
        });

        return targets;
    },

    /**
     *
     * @param sortOrder -- array of sorting list
     */
    getAllConstructionSites : function(sortOrder = []){
        var result = [];

        for(let structureType in _constructionSitesByType){
            var list = _constructionSitesByType[structureType]
            result = result.concat(list);
        }

        if(result.length > 0 && sortOrder.length > 0){
            var sortMap = {};

            //create priority map
            sortOrder.forEach(function(structureType , index){
                sortMap[structureType] = index;
            })

            result = sortStructureList(result , sortMap);
        }
        return result;
    }
}

function sortStructureList( list , sortPriorityMap){

    list.sort(function(target1 , target2){
        let priority1 = sortPriorityMap[target1.structureType];
        let priority2 = sortPriorityMap[target2.structureType];

        return priority1 - priority2;
    })
    return list;
}