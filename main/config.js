
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
        repair : 1,
        upgrader : 1
    }
}