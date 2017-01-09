// TODO: Kick the user while he is logined;
var query = window.location.href.split('?')[1].split("&");
var username = query[0].split("=")[1];
var roomID = query[1].split("=")[1];

////////////////////
//////SOCKET////////
////////////////////
var Users = {};
var game;
var player;
var world;

var rtc;
var stream;

console.log('YO main.js');

var socket = io.connect("/", {query: "username="+username});
socket.on('sys', function(data){
    console.log('sys:' + data);
});

console.log('YO socekt connection');

socket.on('create game', function(user){
    if(game)return ;
    console.log("[Create Game By User]" , user, user.type);
    // player = eval("new "+user.type+"()");
    // player = new Saiyan();
    // player = new Character();

    //for rtc
    player = new Character(user);
    // player.getLocalStream(stream);
    // console.log('stream in main = ', stream);
    //
    game = new Game("GamePlay", player, socket);

    //for rtc
    rtc = new RTC(socket, player, Users);
    //

    console.log("[game created]", game.scene);
});

socket.on('start game', function(){
    if(game.isRunning())return console.log("Game is already running");
    game.start();
    console.log("[game started]");
});

socket.on('render item', function(data){
    console.log("[Render Item] ",data.id);
    switch (data.type) {
        case "script":
            var scripts = "var item = ";
            scripts += data.data.scripts.join();
            eval(scripts);
            if(data.position)
                item.position.set(data.position.x, data.position.y, data.position.z);
            if(data.rotation)
                item.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
            game.add(item);
            item.prop = data.data.prop;
            item.name = data.id;

            player.manipulate(item);
            break;
        case "file":
            var loader = new THREE.ObjectLoader();
            loader.load(data.data.path, function(item) {
                if(data.position)item.position.set(data.position.x, data.position.y, data.position.z);
                if(data.rotation)item.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
                game.add(item);
                // Property
                item.prop = data.data.prop;
                item.name = data.id;

                player.manipulate(item);

            });
            break;
    }


});


socket.on('add user', function(userdata){
    console.log("[Add user]", userdata.name, ":",Users );

    //for rtc
    var other;
    console.log('added userdata.id = ' + userdata.id);
    Users[userdata.id] = userdata;
    Users[userdata.id].object = other = new Character(userdata);
    Users[userdata.id].object.name = userdata.name;
    game.add(Users[userdata.id].object);

    // socket.emit('')

    console.log(Users);
    //

    /*
    Users[userdata.id] = userdata;
    // Users[userdata.id].object = (new Character()).model;
    Users[userdata.id].object = eval('new '+userdata.type+'()');
    Users[userdata.id].object.name = userdata.name;
    game.add(Users[userdata.id].object);
    console.log(Users);
    // because pos,rot is all 0 , so we don't set them
    */
})
socket.on('remove user', function(userid){
    console.log('[remove user]',Users);
    if(Users[userid]){
        game.remove(Users[userid].object);
        delete Users[userid];
        console.log('now Users, ',Users);
    }
});

socket.on('fetch userdata', function(receiver){
    console.log("send data to"+receiver);
    socket.emit('update user to one',{
        receiver: receiver,
        position:game.Controller.position,
        rotation:game.Controller.rotation
    });
})



socket.on('update user', function(userdata){
    // console.log("["+userdata.name+" Move]", userdata);
    if(Users[userdata.id]){
        Users[userdata.id].object.position.x = userdata.position.x;
        Users[userdata.id].object.position.y = userdata.position.y;
        Users[userdata.id].object.position.z = userdata.position.z;
        Users[userdata.id].object.rotation.y = userdata.rotation._y;
        Users[userdata.id].object.update();
        // Users[userdata.id].object.rotation.x = userdata.rotation.x;
        // Users[userdata.id].object.rotation.y = userdata.rotation.y;
        // Users[userdata.id].object.rotation.z = userdata.rotation.z;
    }

});

socket.on('destroy game', function(){
    console.log("[destroy Game]");
    game.stop();
    delete game;
});

socket.on('logout', function(){
    console.log("[logout]");
    game.stop();
    delete game;
    socket.disconnect();
});


////////////////////
////////MAIN////////
////////////////////

socket.on('welcome',function(){
    socket.emit('join', roomID);
})

// var Ninja = Character.extend({
//     init: function(){
//         this._super();
//         this.body.material.color.setHex( 0x000000 );
//     }
// });

//for rtc
// socket.on('get local stream', function() {
//     var stream = player.webcam.getLocalStream();
//     socket.emit('add local stream in pc', stream);
// });

// socket.on('set new remote stream', function(event) {
//     player.webcam.setRemoteStream(event);
// });
//
