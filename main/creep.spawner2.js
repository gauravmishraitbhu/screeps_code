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

        var roomName = config.getRoomName();
        var currentEnergy = Game.rooms[roomName].energyAvailable;

        var energyRequiredToSpawn = creepConfig.getCurrentEnergyRequirement();

        if(currentEnergy < energyRequiredToSpawn){
            return;
        }

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

        var total = 0;

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
        total = harvesterCount + upgraderCount + builderCount + repairCouter;
        if(total > 12){
            console.log("more than 12 already")
            return;
        }
        var nextCreepType = creepConfig.getNextCreepTypeToSpawn(currentCountMap);

        var body = creepConfig.getBody(nextCreepType);
        var result = Game.spawns.Spawn1.createCreep(body , null , {role : nextCreepType})
        console.log("creating creep of type = "+nextCreepType);
        console.log(result);
    }
};