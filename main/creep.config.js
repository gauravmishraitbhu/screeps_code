var CREEP_TYPES = require('creep.types')

var creepConfig = {

    1:{
        harvester : {
            type : "harvester",
            body : [ WORK  , MOVE , CARRY ],
            count : 1,
            priority  : 1
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
            priority : 1
        },

        repair : {
            type : "repair",
            body : [ WORK  , MOVE , CARRY ] ,
            count : 0,
            priority : 4
        }
    },
    2: {
        harvester : {
            type : "harvester",
            body : [ WORK , WORK , MOVE , CARRY ],
            count : 2,
            priority  : 1
        },
        upgrader : {
            type : "upgrader",
            body : [ WORK , WORK , MOVE , CARRY ],
            count : 3,
            priority : 2
        },

        builder : {
            type : "builder",
            body : [ WORK , WORK , MOVE , CARRY ],
            count : 3,
            priority : 3
        },

        repair : {
            type : "repair",
            body : [ WORK , WORK , MOVE , CARRY ] ,
            count : -1,
            priority : 4
        }
    }

}

var controllerLevel = "1";

module.exports = {

    setControllerLevel : function(level){
        controllerLevel =  level.toString();
    },

    getBody : function(creepType){


        return creepConfig[controllerLevel][creepType].body;
    },

    getTargetCountMap : function(){
        var map = {};
        var creepTypes = [CREEP_TYPES.HARVESTER , CREEP_TYPES.BUILDER , CREEP_TYPES.REPAIR_WALL , CREEP_TYPES.UPGRADER];

        creepTypes.forEach(function(creepType){
            map[creepType] = creepConfig[controllerLevel][creepType].count
        })

        return map;

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
        var body = creepConfig[creepType].body
        var buildCost = 0;
        for (var index = 0; index < body.length; ++index) {
            var bodypart = body[index];
            switch(bodypart){
                case MOVE:
                case CARRY:
                    buildCost+=50;
                    break;
                case WORK:
                    buildCost+=20;
                    break;
                case HEAL:
                    buildCost+=200;
                    break;
                case TOUGH:
                    buildCost+=20;
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
}