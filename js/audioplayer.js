var player = null;  
var urlBase= "https://vps.vyata.hu:9011";  
var playerCaption= "RockBoxRadio Player";
var songInfoRefreshRate=4000;
var maxSongTitleLength=60;  
var forceSongShowTitle=false;
var player = null;        
var info = null; 
var xmlhttp = null;
var serverInfo=null;        
var infoDiv = null;            
var timeR = null;
var playButton = null;
var stopButton = null;
var pauseInterval=null;

function setSongTitle(title){
    if(maxSongTitleLength<title.length){
        infoDiv.innerHTML=title.substring(0,maxSongTitleLength)+"...";
    }else{
        infoDiv.innerHTML=title;
    }
}

function setup(){
    player = document.getElementById("rockboxPlayer");     
    info = document.getElementById("actionDiv"); 
    caption = document.getElementById("caption");
    caption.innerHTML=playerCaption;
    xmlhttp = new XMLHttpRequest();
    serverInfo=null;        
    infoDiv = document.getElementById("infoDiv");         
    timeR = setInterval(function(){
        if((!player.paused && pauseInterval==null) || forceSongShowTitle===true){
            xmlhttp.open("GET", urlBase.concat("/", "status-json.xsl"), true);
            xmlhttp.send();    
        }else{
            // do nothing                
        }         
    }, songInfoRefreshRate);
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            serverInfo = JSON.parse(this.responseText);
            if(Array.isArray(serverInfo.icestats.source)){
                setSongTitle(serverInfo.icestats.source[0].title);
            }else{
                setSongTitle(serverInfo.icestats.source.title);
                //setSongTitle("aaaaaaaaaa bbbbbbbbbb cccccc ccccc dddddddddd eeeeeeeeee");                 
            }
        }
    };
    playButton = document.getElementById("playButton");
    stopButton = document.getElementById("stopButton");        

    player.oncanplay=function() {
        playButton.disabled=false;            
        stopButton.disabled=true;
        //info.innerHTML=playerCaption;
        if(player.paused){
            infoDiv.innerHTML="Press '>' to play.";
        }
    };              
    player.onplaying=function() { 
        playButton.disabled=true;            
        stopButton.disabled=false;            
    };
    player.onpause=function() {
        playButton.disabled=false;            
        stopButton.disabled=true;                
        infoDiv.innerHTML="Stopped";        
    };   
    player.onloadstart=function() {
        playButton.disabled=false;            
        stopButton.disabled=true;                
        infoDiv.innerHTML="Loading...";
    };                
}

function playRock(){
    player.load();
    player.play();
}

function pauseRock(){
    player.pause();
}  

function setupPlayer(){
    var audio=document.getElementById("rockboxPlayer");
    audio.src=urlBase.concat("/stream?type=.mp3");
    audio.type="audio/mpeg";
    setVolumeButtons();
    //playRock();    
}

function setPausedTimer(){
    if(player.paused){
        if(pauseInterval==null){
            pauseInterval=setInterval(function(){
                if(player.paused){
                    infoDiv.innerHTML="Stopped";
                } 
                clearInterval(pauseInterval);
                pauseInterval=null;  
            }, songInfoRefreshRate);                
        }
    }
}

function volumeString(){
    return "Volume: " + player.volume*100 + "%";
}

function setVolumeButtons(){
    var volUp=document.getElementById("volUp");  
    var volDown=document.getElementById("volDown");     
    if(volUp!=null){ 
        volUp.disabled=player.volume==1;
    }
    if(volDown!=null){
        volDown.disabled=player.volume==0;
    }
}

function volUp(){
    if(player.volume<1){
        setPausedTimer();
        player.volume=Math.round((player.volume+0.1)*10)/10;
        infoDiv.innerHTML=volumeString();
        setVolumeButtons();
    }
}  

function volDown(){
    if(0<player.volume){
        setPausedTimer();        
        player.volume=Math.round((player.volume-0.1)*10)/10;        
        infoDiv.innerHTML=volumeString();
        setVolumeButtons();        
    }
}  

function forceSongTitle(){
    forceSongShowTitle=true;
}
