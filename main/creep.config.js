var creepTypes = require('creep.types')

var creepConfig = {
    harvester : {
        type : "harvester",
        body : [ WORK , MOVE , MOVE , CARRY ],
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
    }
}