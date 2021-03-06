var mongoose = require('./dbconnection');

var UserSchema = new mongoose.Schema({
  name : String,
  password : String,
  type: String,
  VoxelWarehouse: Array,
  friends: Array
  });

UserSchema.statics.getByName = function(name,callback){
    if(!name)return ;
    return this.findOne({name:name},(err, user)=>{
        if(user)
            callback(err, {name:user.name, type:user.type});
        else {
            callback(err);
        }
    });
};

UserSchema.statics.appendVoxel = function(username, data, callback){
    if(!username || !data)return;
    // check data
    if(!data.geometries || !data.materials|| !data.object)return ;
    var object = data.object;
    if(object.children.length >200)return console.log("Max children exceed");
    if(object.type !== "Object3D" || !object.name.length)return ;
    // update
    this.update(
        {name:username},
        {$push: {"VoxelWarehouse": data}},
        {safe: true, upsert: true, new : true},
        function(err, result){
            callback && callback();
        }
    )
}
UserSchema.statics.deleteVoxel = function(username, itemName, callback){
    if(!username || !itemName)return;
    var scope = this;
    this.update(
        {name: username},
        {$pull: {"VoxelWarehouse": {"object.name": itemName}}},
        {safe: true, upsert: true, new : true},
        function(err, result){
            callback && callback();
        }
    )
}

UserSchema.statics.getVoxel = function(username, itemName, callback){
    this.findOne(
        {name: username},
        function(err, result){
            if(err)return console.error(err);
            var VoxelWarehouse = result.VoxelWarehouse;
            result = VoxelWarehouse.find((element)=>{
                return element.object.name === itemName;
            });
            callback && callback(result);
        }
    )
}

//for friends
UserSchema.statics.getFriends = function(username, callback) {
    if(!username || !callback) return;

    this.findOne(
        {name: username},
        function(err, result) {
            if(err) return console.log(err);
            callback && callback(result.friends);
        }
    );
}

UserSchema.statics.appendFriend = function(username, friend, callback) {
    if(!username || !friend) return;

    this.getFriends(username, (friends) => {

        if(friends.indexOf(friend) == -1) {
            this.update(
                {name: username},
                {$push: {"friends": friend}},
                {safe: true, upsert: true, new : true},
                function(err, result){
                    callback && callback(result);
            });
        }
        else {
            console.log('friend has been in friends');
        }
    });
}

UserSchema.statics.removeFriend = function(username, friend, callback) {
    if(!username || !friend) return;

    this.getFriends(username, (friends) => {
        if(friends.indexOf(friend) != -1) {
            this.update(
                {name: username},
                {$pull: {"friends": friend}},
                {safe: true, upsert: true, new : true},
                function(err, result){
                    callback && callback(result);
            });
        }
        else {
            console.log('friend is not in friends');
        }
    });
}
//


var User = mongoose.model('User', UserSchema);

module.exports = User;
