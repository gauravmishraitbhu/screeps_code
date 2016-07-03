
var currentRoomName = "";

module.exports = {

    setRoomName : function(roomName){
        currentRoomName = roomName;
    },

    getRoomName : function(){
        return currentRoomName;
    },

    SOURCES : {
        harvester : 0,
        builder : 1,
        repair : 0,
        upgrader : 1
    }
}