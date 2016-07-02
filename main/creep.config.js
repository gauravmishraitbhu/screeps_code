var CREEP_TYPES = require('creep.types')
var config = require('config')
var structureUtils = require('structure.utils')

var creepConfig = {

    //starting of room.
    1:{
        harvester : {
            type : "harvester",
            body : [ WORK  , MOVE , CARRY ],
            count : 1,
            priority  : 1,
            maxCount : 2,
        },
        upgrader : {
            type : "upgrader",
            body : [ WORK  , MOVE , CARRY ],
            count : 2,
            priority : 2,
            maxCount : 4
        },

        builder : {
            type : "builder",
            body : [ WORK  , MOVE , CARRY ],
            count : 0,
            priority : 3,
            maxCount : 0
        },

        repair : {
            type : "repair",
            body : [ WORK  , MOVE , CARRY ] ,
            count : 0,
            priority : 4,
            maxCount : 0
        }
    },



    //upgraded controller level to 2
    2: {
        harvester : {
            type : "harvester",
            body : [ WORK , WORK , MOVE , CARRY ],
            count : 2,
            priority  : 1,
            maxCount : 3
        },
        upgrader : {
            type : "upgrader",
            body : [ WORK , MOVE , MOVE , CARRY ],
            count : 2,
            priority : 2,
            maxCount : 5
        },

        builder : {
            type : "builder",
            body : [ WORK , WORK , MOVE , CARRY ],
            count : 1,
            priority : 3,
            maxCount : 2
        },

        repair : {
            type : "repair",
            body : [ WORK , MOVE , MOVE , CARRY ] ,
            count : 2,
            priority : 4,
            maxCount : 2
        }
    },


    3: {
        harvester : {
            type : "harvester",
            body : [ WORK , WORK , MOVE , CARRY ],
            count : 2,
            priority  : 1,
            maxCount : 3
        },
        upgrader : {
            type : "upgrader",
            body : [ WORK , MOVE , MOVE , CARRY ],
            count : 2,
            priority : 2,
            maxCount : 4
        },

        builder : {
            type : "builder",
            body : [ WORK , WORK , MOVE , CARRY ],
            count : 3,
            priority : 3,
            maxCount : 4
        },

        repair : {
            type : "repair",
            body : [ WORK , MOVE , MOVE , CARRY ] ,
            count : 1,
            priority : 4,
            maxCount : 1
        }
    }

}

var colonyLevel = "1";

module.exports = {

    setControllerLevel : function(level){
        if(level > 3){
            level = 3;
        }
        colonyLevel =  level.toString();
    },

    getCurrentEnergyRequirement(){
        return getBodyCost(getBodyInternal(CREEP_TYPES.HARVESTER));

    },

    getBody : function(creepType){

        return getBodyInternal(creepType)
    },

    getTargetCountMap : function(){
        var map = {};
        var creepTypes = [CREEP_TYPES.HARVESTER , CREEP_TYPES.BUILDER , CREEP_TYPES.REPAIR_WALL , CREEP_TYPES.UPGRADER];

        creepTypes.forEach(function(creepType){
            map[creepType] = creepConfig[colonyLevel][creepType].count
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

            let minExcessCount = 99999;
            var minExcessType = null;

            for( let i = 0 ; i<creepTypeForLevel.length ; i++){


                let creepObject = creepTypeForLevel[i];
                let creepType = creepObject.type;
                let maxCount = levelConfig[creepType].maxCount;
                if(maxCount == null){
                    maxCount = 9999;
                }

                // if config has count < 0 that means never spawn this creep.
                if( levelConfig[creepType].count < 0 || maxCount >= currentCountMap[creepType]){
                    continue;
                }

                let excess = currentCountMap[creepType] - levelConfig[creepType].count;
                if(excess < minExcessCount){
                    minExcessCount = excess;
                    minExcessType = creepType;
                }
            }

            nextCreepToSpawn = minExcessType;

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
    }
}


function getBodyInternal(creepType){
    var baseBody = creepConfig[colonyLevel][creepType].body;
    return getOptmalBodyConfig(baseBody);
}

function getOptmalBodyConfig(baseBody){

    var newBody = [...baseBody]
    var energeyCap = structureUtils.getCurrentEnergetCapacity();

    switch(energeyCap){
        case 300:
        case 350:
            newBody = [WORK , WORK , CARRY , MOVE];
            break;
        case 400:
            newBody = [WORK , WORK , MOVE , MOVE , CARRY]
            break;
        case 450:
            newBody = [WORK , WORK , WORK , MOVE , MOVE ,CARRY]
            break;
        case 500:
            newBody = [WORK , WORK , WORK , CARRY ,CARRY, MOVE , MOVE]
            break;
        case 550:
            newBody = [WORK , WORK , WORK , CARRY,CARRY , MOVE , MOVE]
            break;
        case 600:
            newBody = [WORK , WORK , WORK ,WORK, CARRY,CARRY , MOVE , MOVE]
            break;
        case 650:
            newBody = [WORK , WORK , WORK , WORK , CARRY ,CARRY ,MOVE, MOVE , MOVE]
            break;
        case 700:
            newBody = [WORK , WORK , WORK , WORK , CARRY ,CARRY , MOVE ,MOVE, MOVE , MOVE]
            break;
        default:
            newBody = [WORK , WORK , WORK , WORK,CARRY , CARRY , MOVE];
            break;
    }


    return newBody;
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
        //console.log(bodypart.toUpperCase()+" costs "+buildCost);
    }
    return buildCost;
}