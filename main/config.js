
var currentRoomName = "";

module.exports = {

    setRoomName : function(roomName){
        currentRoomName = roomName;
    },

    getRoomName : function(){
        return currentRoomName;
    },

    SOURCES : {
        harvester : 1,
        builder : 1,
        repair : 0,
        upgrader : 0
    }
}