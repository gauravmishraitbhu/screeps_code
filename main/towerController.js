module.exports = {

    run : function(tower){
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }else {
            //look for damaged building
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(structure) {

                    if(structure.structureType == STRUCTURE_WALL && structure.hits < 10000 ){
                        return true;
                    }

                    if(structure.structureType == STRUCTURE_ROAD && structure.hits < 0.75 *structure.hitsMax){

                        return true
                    }

                    return false;

                }
            });
            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
        }
    }

}