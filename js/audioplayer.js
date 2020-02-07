var player = null;  
var urlBase= "http://vps.vyata.hu:9000";  
var playerCaption= "RockBoxRadio Player";
var songInfoRefreshRate=2000;  
var player = null;        
var info = null; 
var xmlhttp = null;
var serverInfo=null;        
var infoDiv = null;            
var timeR = null;
var playButton = null;
var stopButton = null;

function setup(){
    player = document.getElementById("rockboxPlayer");     
    info = document.getElementById("actionDiv"); 
    caption = document.getElementById("caption");
    caption.innerHTML=playerCaption;
    xmlhttp = new XMLHttpRequest();
    serverInfo=null;        
    infoDiv = document.getElementById("infoDiv");         
    timeR = setInterval(function(){
        if(!player.paused){
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
                infoDiv.innerHTML=serverInfo.icestats.source[0].title;
            }else{
                infoDiv.innerHTML=serverInfo.icestats.source.title;
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
            infoDiv.innerHTML="Ready.";
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
}
