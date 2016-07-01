var CREEP_TYPES = require('creep.types')

var creepConfig = {

    //starting of room.
    1:{
        harvester : {
            type : "harvester",
            body : [ WORK  , MOVE , CARRY ],
            count : 1,
            priority  : 2
        },
        upgrader : {
            type : "upgrader",
            body : [ WORK  , MOVE , CARRY ],
            count : 2,
            priority : 1
        },

        builder : {
            type : "builder",
            body : [ WORK  , MOVE , CARRY ],
            count : 2,
            priority : 3
        },

        repair : {
            type : "repair",
            body : [ WORK  , MOVE , CARRY ] ,
            count : 0,
            priority : 4
        }
    },



    //upgraded controller level to 2
    2: {
        harvester : {
            type : "harvester",
            body : [ WORK , WORK , MOVE , CARRY ],
            count : 2,
            priority  : 2
        },
        upgrader : {
            type : "upgrader",
            body : [ WORK , WORK , MOVE , CARRY ],
            count : 4,
            priority : 1
        },

        builder : {
            type : "builder",
            body : [ WORK , WORK , MOVE , CARRY ],
            count : 1,
            priority : 3
        },

        repair : {
            type : "repair",
            body : [ WORK , WORK , MOVE , CARRY ] ,
            count : 0,
            priority : 4
        }
    }

}

var colonyLevel = "1";

module.exports = {

    setControllerLevel : function(level){
        if(level > 2){
            level = 2;
        }
        colonyLevel =  level.toString();
    },

    getCurrentEnergyRequirement(){
        if(colonyLevel == 1){
            return 200;
        }else {
            return getBodyCost([WORK , WORK , CARRY , MOVE]);
        }
    },

    getBody : function(creepType){


        return creepConfig[colonyLevel][creepType].body;
    },

    getTargetCountMap : function(){
        var map = {};
        var creepTypes = [CREEP_TYPES.HARVESTER , CREEP_TYPES.BUILDER , CREEP_TYPES.REPAIR_WALL , CREEP_TYPES.UPGRADER];

        creepTypes.forEach(function(creepType){
            map[creepType] = creepConfig[controllerLevel][creepType].count
        })

        return map;

    },

    getNextCreepTypeToSpawn : function(currentCountMap){
        let nextCreepToSpawn = null;
        let levelConfig = creepConfig[colonyLevel];
        var creepTypeForLevel = [];

        Object.keys(levelConfig).forEach(function(creepType){
            creepTypeForLevel.push ({
                type : creepType,
                priority : levelConfig[creepType].priority
            })
        })

        //sort based on priority
        creepTypeForLevel.sort(function(creepObject1 , creepObject2){
            return creepObject1.priority - creepObject2.priority;
        })

        //first check if any creep is below recommended number
        for( let i=0;i<creepTypeForLevel.length ; i++){
            let creepObject = creepTypeForLevel[i];
            let creepType = creepObject.type;
            if(levelConfig[creepType].count > currentCountMap[creepType]){
                nextCreepToSpawn = creepType;
                break;
            }
        }

        if(!nextCreepToSpawn){

            console.log("we already have recommended count going for excess")
            // now  we already have all recommended creeps still we need to decide on next
            var highestPriCreep = creepTypeForLevel[0];
            var secondHighest = creepTypeForLevel[1];

            let highestCreepExcess = currentCountMap[highestPriCreep.type] - levelConfig[highestPriCreep.type].count;
            let secondCreepExcess = currentCountMap[secondHighest.type] - levelConfig[secondHighest.type].count;

            if(highestCreepExcess > secondCreepExcess){
                nextCreepToSpawn = secondHighest.type;
            }else{
                nextCreepToSpawn = highestPriCreep.type;
            }

        }

        return nextCreepToSpawn;
    },

    getPriorityList : function(currentCountMap , panicRepair){
        //var configs = Object.values(creepConfig);

        var currentHarvester = 0, currentBuilder = 0, currentUpgrader = 0;

        if(currentCountMap){
            currentHarvester = currentCountMap[CREEP_TYPES.HARVESTER];
            currentBuilder = currentCountMap[CREEP_TYPES.BUILDER];
            currentUpgrader = currentCountMap[CREEP_TYPES.UPGRADER]
        }

        if(panicRepair){
            return ["repair" , "upgrader" , "builder" , "harvester"]
        }

        //in case if thrashing is occuring. ie harvesting rate is not enuf to spawn
        // even one instance of low priority creep.
        if(currentBuilder < 1 && currentHarvester >= 1 && currentUpgrader >= 1){
            return ["builder" , "harvester" , "upgrader" , "repair"];
        }else if( currentUpgrader < 1 && currentHarvester >=1){
            return ["upgrader" , "harvester" , "builder" , "repair"];
        }

        return ["harvester" , "upgrader" , "builder" , "repair"]
    },

    getBuildCost: function(creepType){
        return creepConfig[colonyLevel][creepType].body
    }
}

function getBodyCost(body){
    var buildCost = 0;
    for (var index = 0; index < body.length; ++index) {
        var bodypart = body[index];
        switch(bodypart){
            case MOVE:
            case CARRY:
                buildCost+=50;
                break;
            case WORK:
                buildCost+=100;
                break;
            case HEAL:
                buildCost+=250;
                break;
            case TOUGH:
                buildCost+=10;
                break;
            case ATTACK:
                buildCost+=80;
                break;
            case RANGED_ATTACK:
                buildCost+=150;
                break;
        }
        console.log(bodypart.toUpperCase()+" costs "+buildCost);
    }
    return buildCost;
}