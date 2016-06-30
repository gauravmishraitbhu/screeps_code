/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.spawner');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    checkAndSpawnCreeps : function(targetHarvesterCount , targetBuilderCount , targetUpgraderCount,targetRepairCount){
        
        var harvesterCount = 0;
        var builderCount = 0;
        var upgraderCount = 0;
        var repairCouter = 0;
        for(var name in Game.creeps) {
            
            //check if creep is still alive
            if(Game.creeps[name]){
                
                //check and count roles.
                var creep = Game.creeps[name];
                if(creep.memory.role == "harvester"){
                    harvesterCount ++;
                }else if(creep.memory.role == "upgrader"){
                    upgraderCount++;
                }else if(creep.memory.role == "builder"){
                    builderCount ++;
                }else if(creep.memory.role == "repair"){
                    repairCouter ++;
                }
            }
            
        }
        
        // console.log('Room  has '+Game.rooms["E23N26"].energyAvailable+' energy');
        
        
        // if(harvesterCount < targetHarvesterCount){
        //     console.log("harvester count="+harvesterCount)
        //     console.log("detected less harvesters than required--"+targetHarvesterCount)
        // }
        
        // if(builderCount < targetBuilderCount){
        //     console.log("builder count="+builderCount)
        //     console.log("detected less builder than required")
        // }
        
        // if(upgraderCount < targetUpgraderCount){
        //     console.log("upgraderCount count="+upgraderCount)
        //     console.log("detected less upgrader than required")
        // }
        
        
        
        for(var i = harvesterCount ; i < targetHarvesterCount ; i++){
            var result = Game.spawns.Spawn1.createCreep([WORK ,WORK, MOVE , CARRY] , null , {role : "harvester"})
            console.log("creating harvester");
            console.log(result);
        }
        
        for(var i = builderCount ; i < targetBuilderCount ; i++){
            var result = Game.spawns.Spawn1.createCreep([WORK , WORK ,MOVE , CARRY] , null , {role : "builder"})
            console.log("creating builder");
            console.log(result);
        }
        
        for(var i = upgraderCount ; i < targetUpgraderCount ; i++){
            var result = Game.spawns.Spawn1.createCreep([WORK ,WORK, MOVE , CARRY] , null , {role : "upgrader"})
            console.log("creating upgrader");
            console.log(result);
        }
        
        for(var i = repairCouter ; i < targetRepairCount ; i++){
            var result = Game.spawns.Spawn1.createCreep([WORK , MOVE , CARRY] , null , {role : "repair"})
            console.log("creating repair");
            console.log(result);
        }
    }
};