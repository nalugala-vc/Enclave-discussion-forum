//u can input the app id,token and channel b4 u ebter!!!!
var APP_ID ;
var TOKEN;
const CHANNEL='main' ;

const client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})

let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalStream = async () => {
    client.on('user-published',handleUserJoined)
    client.on('user-left',handleUserLeft)
    let UID = await client.join(APP_ID, CHANNEL, TOKEN, null)

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks() 

    let player = `<div class="video-container" id="user-container-${UID}">
                        <div class="video-player" id="user-${UID}"></div>
                  </div>`
    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

    localTracks[1].play(`user-${UID}`)
    
    await client.publish([localTracks[0], localTracks[1]])
}

let joinStream = async () => {
    APP_ID=document.getElementById('app_id').value;
    TOKEN=document.getElementById('token').value;
    await joinAndDisplayLocalStream()
    document.getElementById('main').style.display = 'none'
    document.getElementById('stream-controls').style.display = 'flex'
}

let handleUserJoined=async(user,mediaType)=>{
    remoteUsers[user.uid]=user;
    await client.subscribe(user,mediaType)

    if(mediaType==='video'){
        let player=document.getElementById(`user-container-${user.uid}`)
        if(player!=null){
            player.remove()
        }
            player=`<div class="video-container" id="user-container-${user.uid}">
                        <div class="video-player" id="user-${user.uid}"></div>
                    </div>`
        document.getElementById('video-streams').insertAdjacentHTML('beforeend',player)
        
        user.videoTrack.play(`user-${user.uid}`)
    }

    if(mediaType==='audio'){
        user.audioTrack.play()
    }

}
let handleUserLeft=async(user)=>{
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}

let leaveAndRemoveLocalStream=async()=>{
    for(let i=0;localTracks.length>i;i++){
        localTracks[1].stop()
        localTracks[1].close()
    }

    await client.leave()
    document.getElementById('main').style.display='flex'
    document.getElementById('stream-controls').style.display='none'
    document.getElementById('video-streams').innerHTML=''
}

let toggleMic=async(e)=>{
    if(localTracks[0].muted){
        await localTracks[0].setMuted(false)
        e.target.innerText='Mic on'
        e.target.style.backgroundColor="#8C6653"
        e.target.style.color="#DED5D0"
    }else{
        await localTracks[0].setMuted(true)
        e.target.innerText='Mic off'
        e.target.style.
        backgroundColor="#462A1C"
        e.target.style.color="#DED5D0"
    }
}

let toggleCamera=async(e)=>{
    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        e.target.innerText="Camera on"
        e.target.style.backgroundColor="#8C6653"
        e.target.style.color="#DED5D0"
    }else{
        await localTracks[1].setMuted(true)
        e.target.innerText='Camera off'
        e.target.style.
        backgroundColor="#462A1C"
        e.target.style.color="#DED5D0"
    }
}


document.getElementById('join-btn').addEventListener('click', joinStream)
document.getElementById('leave-btn').addEventListener('click', leaveAndRemoveLocalStream)
document.getElementById("mic-btn").addEventListener("click",toggleMic)
document.getElementById("camera-btn").addEventListener("click",toggleCamera)

