var roleRepair = {

    /** @param {Creep} creep **/
    run: function(creep ) {
        
        var wallIds = ["577447e51d4fc289026b5a49" , "577447e919aa132a578c4006" , "577448641d4fc289026b5ab6" , "5774486cd92a7f66029aaf7e" ,"57744868b885d26443b7128e", 
        "577447ebd279341875bc56e5" , "577447eec785323e577a67c9" , '57741a5cc4df18053da05261' , '57741a62e79e71d815fbf407' , '57741a67a9b075a81559e13a' , '57741a6c6af05e5618d547e8',
        '57741a71d7dc2a8277b2d713' , '57741a76c4df18053da0527f' , "577439e2b213d3e80b2cacbd" , "577439afdb1956317eee3087","577439a962189b7775849bb1",
        "577439a4c1fa2fcb5c4b72e3" , "5774399e782bfe9d5cc956c6" , "577439932bcee96c750acf35","57743999f13e5876759f5e37" , "5774399677ff3f570242a149",
        "57743983d92a7f66029aa429" , "5774397eb213d3e80b2cac6c" , "5774397b81724cda5cc6dbd9" , "5774397989dcb83b755ce126","577439768d92287c7ec818eb"
        ,"57743973777b4f59756bdfea" , "5774396ed279341875bc4b5d" , "577439682bcee96c750acf15" , "577439632bcee96c750acf12" , "57743b95f311811d7eb2ecab",
        "57743b90fd4bc42775836910" , "57743b8bf13e5876759f5fef" , "57743b852bcee96c750ad0f5" , "57743b804a4e85c30bc9bd3c" , "57743b7b81724cda5cc6dd8a",
        "57743b7682890e62183af20c" , "57743b71f311811d7eb2ec90" , "57743b6ceb93bca85c9805fc" , "57743d5a26797a5018e3426e" , "57743d5cb571ea3102dddd45" , 
        "57743d586af05e5618d565de" , "57743c2aaa9f70c55c50abef" , "57743c2f82890e62183af29f" , "57743c2cf2a9e0d70beb6c70" , "57743c32dbd15ed55c8b2c15",
        "57743c34cfc323637ee8e394" , "57743c37fe169d6e18994efd" , "57743c3d26797a5018e3417c" , "57743c3acfc323637ee8e398" , "57743c407683033e1807ec86",
        "57743c0f782bfe9d5cc958bd" , "57743c09a2a6632c180c65df" , "57743c0121f6eead5c1a6944" , "57743bfcc1fa2fcb5c4b74ed" , "57743bf9dbd15ed55c8b2be8",
        "57743bf69f043f935caa6aab" , "57743bf37100a8451855626f" , "57743bf17100a8451855626c" , "57743beedb1956317eee32a6" , "57743f968cbf9cab0bc158d4",
        "57743fc69f043f935caa6d66" , "57743fcb3800d62302c8f5eb" , "57743fd1a5b2b04575653d03" , "57743fd70f7dfd2e43d38301", "57743abdcacb65aa0b6e04f4" ,
        "57743ab7aa9f70c55c50aacb" , "57743ababea049647e0b4fdf" , "57743ab4b571ea3102dddb2a" , "57743ab2f9ee3c1e7e49fa7e" , "57743a6d8cbf9cab0bc154d2",
        "57743a6bcacb65aa0b6e04ae" , "57743a5e0ca7cde20be8bd7a" , "57743a4f82890e62183af12f" , "57743a40b571ea3102dddabb" , "57743a3e81724cda5cc6dc74" ,
        "57743a3b77ff3f570242a1e3" , "57743a39f311811d7eb2eb9f" , "57743a3626c4707202e04fdc" ]
        
        
        // console.log(wallIds.length)
        
        var wallToRepair = null;
        for(var i = 0 ; i< wallIds.length ; i++){
            var wall = Game.getObjectById(wallIds[i]);
            //console.log(JSON.stringify(wall))
            if(wall){
                // console.log(wall.structureType);
                // console.log(wall.hits);
                if( (wall.structureType == STRUCTURE_WALL ) 
                    && wall.hits < 3000){
                    wallToRepair = wall;
                    break;
                }
            }
            
        }
        
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	    }

	    if(creep.memory.building) {
	        
            if(creep.repair(wallToRepair) == ERR_NOT_IN_RANGE) {
                creep.moveTo(wallToRepair);
            }
            
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1]);
            }
	    }
	}
};

module.exports = roleRepair;