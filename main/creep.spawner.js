/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.spawner');
 * mod.thing == 'a thing'; // true
 */
 
var creepConfig = require('creep.config')
var creepTypes = require('creep.types')
var config = require('config')

module.exports = {
    checkAndSpawnCreeps : function(targetCountMap){
        
        var harvesterCount = 0;
        var builderCount = 0;
        var upgraderCount = 0;
        var repairCouter = 0;

        var currentCountMap = {
            harvester : 0,
            upgrader : 0,
            builder : 0 ,
            repair : 0
        }

        //var targetCountMap = {
        //    harvester : targetHarvesterCount,
        //    upgrader : targetUpgraderCount,
        //    builder : targetBuilderCount ,
        //    repair : targetRepairCount
        //}


        for(var name in Game.creeps) {
            
            //check if creep is still alive
            if(Game.creeps[name]){
                
                //check and count roles.
                var creep = Game.creeps[name];
                if(creep.memory.role == "harvester"){
                    currentCountMap.harvester ++;
                    harvesterCount ++;
                }else if(creep.memory.role == "upgrader"){
                    currentCountMap.upgrader ++;
                    upgraderCount++;
                }else if(creep.memory.role == "builder"){
                    currentCountMap.builder ++;
                    builderCount ++;
                }else if(creep.memory.role == "repair"){
                    currentCountMap.repair ++;
                    repairCouter ++;
                }
            }
            
        }

        var panicRepair = false;
        if(targetRepairCount == -1){
            var roomName = config.getRoomName();

            var room = Game.rooms[roomName];
            var wallAndRoads = room.find(FIND_STRUCTURES,{
                filter : (structure) => (structure.structureType == STRUCTURE_WALL ||
                                        structure.structureType == STRUCTURE_ROAD)
            })

            for(var i = 0 ; i < wallAndRoads.length ; i++){
                let structure = wallAndRoads[i];
                if(structure.structureType == STRUCTURE_WALL && structure.hits < 3000){

                    targetRepairCount = 1;
                    panicRepair = true;
                    break;

                }

                if(structure.structureType == STRUCTURE_ROAD
                    && structure.hits < structure.hitsMax/2){
                    targetRepairCount = 1;
                    panicRepair = true;
                    break;
                }
            }
        }


        // console.log('Room  has '+Game.rooms["E23N26"].energyAvailable+' energy');

        var creepTypeList = creepConfig.getPriorityList(currentCountMap , panicRepair);

        for(var i=0 ; i<creepTypeList.length ; i++){
            var creepType = creepTypeList[i];
            var currentCount = currentCountMap[creepType];
            var targetCount = targetCountMap[creepType];
            // console.log(JSON.stringify(currentCountMap))
            // console.log(JSON.stringify(targetCountMap))
            if(currentCount < targetCount){
                var body = creepConfig.getBody(creepType);
                var result = Game.spawns.Spawn1.createCreep(body , null , {role : creepType})
                console.log("creating creep of type = "+creepType);
                console.log(result);
                break;
            }
        }

    }
};