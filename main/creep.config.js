
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

    getPriorityList : function(){
        //var configs = Object.values(creepConfig);
        return ["harvester" , "upgrader" , "builder" , "repair"]
    }
}