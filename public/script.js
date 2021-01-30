var socket = io("/")
var video_class = document.getElementById("video-grid")
var peer = new Peer(undefined, {
    host: "/",
    port: "3001"
});
var my_video = document.createElement("video")
var my_audio = document.createElement("audio")
my_audio.setAttribute("controls", "")
my_audio.setAttribute("src", "D:\\chat\\public\\55 Track 55.wma")
my_video.setAttribute("controls", "controls");
video_class.append(my_audio)
var all_peer = {}
my_video.muted = true
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    add_video_stream(my_video, stream)
    peer.on("call", call => {
        call.answer(stream)
        var user_video_all = document.createElement("video")
        call.on("stream", user_video_for => {
            add_video_stream(user_video_all, user_video_for)
        })
    })
    socket.on("user-connected", userId => {
        console.log("user-connected : " + userId)
        connectToNewsUser(userId, stream)
    })
})
socket.on("user-disconnect", userId => {
    console.log(userId)
    if (all_peer[userId]) all_peer[userId].close()
})
peer.on("open", id => {
    socket.emit("join-room", room_id, id)
})

function connectToNewsUser(userId, stream) {
    var call = peer.call(userId, stream)
    var user_video_all = document.createElement("video")
    user_video_all.setAttribute("controls", "controls");
    call.on("stream", user_video_for => {
        add_video_stream(user_video_all, user_video_for)
    })
    call.on("close", () => {
        user_video_all.remove()
    })
    all_peer[userId] = call
}

function add_video_stream(video, stream) {
    video.srcObject = stream
    video.setAttribute("controls", "controls");
    /*video.addEventlistener("loadedmetadata", () => {
        video.play()
    })*/
    video.onloadedmetadata = function(e) {
        video.play();
    };
    video_class.append(video)
}