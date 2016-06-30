var creepTypes = require('creep.types')

var creepConfig = {
    harvester : {
        type : "harvester",
        body : [ WORK , WORK , MOVE , CARRY ],
        priority  : 1
    },
    upgrader : {
        type : "upgrader",
        body : [ WORK , WORK , MOVE , CARRY ],
        priority : 2
    },

    builder : {
        type : "builder",
        body : [ WORK , WORK , MOVE , CARRY ],
        priority : 3
    },

    repair : {
        type : "repair",
        body : [ WORK , WORK , MOVE , CARRY ] ,
        priority : 4
    }
}

module.exports = {

    getBody : function(creepType){
        return creepConfig[creepType].body;
    },

    getPriorityList : function(currentCountMap){
        //var configs = Object.values(creepConfig);

        var currentHarvester = 0, currentBuilder = 0, currentUpgrader = 0;

        if(currentCountMap){
            currentHarvester = currentCountMap[creepTypes.HARVESTER];
            currentBuilder = currentCountMap[creepTypes.BUILDER];
            currentUpgrader = currentCountMap[creepTypes.UPGRADER]
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