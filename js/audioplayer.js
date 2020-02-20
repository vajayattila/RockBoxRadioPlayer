/**
 *  @file audioplayer.js
 *  @brief Web based player (HTML5 audio player) for IceCast servers. Using HTML, JAVASCRIPT, CSS. 
 *  Project home: https://github.com/vajayattila/RockBoxRadioPlayer
 *	@author Vajay Attila (vajay.attila@gmail.com)
 *  @copyright MIT License (MIT)
 *  @date 2020.02.05-2020.02.20
 *  @version 1.0.0.1
 */

/*
sample parameters
var urlBase= "https://vps.vyata.hu:9011"; // https://rockboxradio.wixsite.com/official
var playerCaption= "RockBoxRadio Player"; // https://rockboxradio.wixsite.com/official
var sourceIndex=0; // https://rockboxradio.wixsite.com/official
var urlParams= "/stream?type=.mp3";
*/

var rbplayer={
    urlBase: "", 
    playerCaption: "", 
    sourceIndex: 0,
    urlParams: "",
    songInfoRefreshRate: 4000,
    maxSongTitleLength: 60,  
    forceSongShowTitle: false,
    player: null,        
    info: null, 
    xmlhttp: null,
    serverInfo: null,        
    infoDiv: null,  
    statusDiv: null,           
    timeR: null,
    playButton: null,
    stopButton: null,
    pauseInterval: null,
    forceDecodeUtf8: false,
    setForceDecodeUtf8: function(){
        forceDecodeUtf8=true;
    },
    forceUnicodeEncoding: function(str) {
        if(rbplayer.forceDecodeUtf8==true){
            str=rbplayer.decodeURIComponent(escape(str));
        }
        return str;
    },
    setSongTitle: function (title){
        statusDiv.style.display="none";    
        infoDiv.style.display="flex"
        infoDiv.innerHTML=rbplayer.forceUnicodeEncoding(title);    
    },
    setStausText: function (title){
        infoDiv.style.display="none"    
        statusDiv.style.display="flex";    
        statusDiv.innerHTML=title;  
    },
    setup: function(pUrlBase, pUrlParams, pPlayerCaption, pSourceIndex){
        rbplayer.urlBase= pUrlBase;
        rbplayer.playerCaption= pPlayerCaption;
        rbplayer.sourceIndex=pSourceIndex;   
        rbplayer.urlParams= pUrlParams;
        rbplayer.player = document.getElementById("radio");     
        rbplayer.info = document.getElementById("actionDiv"); 
        rbplayer.caption = document.getElementById("caption");
        rbplayer.caption.innerHTML=rbplayer.playerCaption;
        rbplayer.xmlhttp = new XMLHttpRequest();
        rbplayer.serverInfo=null;        
        rbplayer.infoDiv = document.getElementById("infoDiv"); 
        rbplayer.statusDiv=document.getElementById("statusDiv");     
        rbplayer.statusDiv.style.display="none";        
        rbplayer.timeR = setInterval(function(){
            if(
                (!rbplayer.player.paused && rbplayer.pauseInterval==null) || 
                rbplayer.forceSongShowTitle===true
            ){
                rbplayer.xmlhttp.open("GET", rbplayer.urlBase.concat("/", "status-json.xsl"), true);
                rbplayer.xmlhttp.send();    
            }else{
                // do nothing                
            }         
        }, rbplayer.songInfoRefreshRate);
        rbplayer.xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                rbplayer.serverInfo = JSON.parse(this.responseText);
                if(Array.isArray(rbplayer.serverInfo.icestats.source)){
                    rbplayer.setSongTitle(rbplayer.serverInfo.icestats.source[rbplayer.sourceIndex].title);
                }else{
                    rbplayer.setSongTitle(rbplayer.serverInfo.icestats.source.title);                
                }
            }
        };
        playButton = document.getElementById("playButton");
        stopButton = document.getElementById("stopButton");        

        rbplayer.player.oncanplay=function() {
            playButton.disabled=false;            
            stopButton.disabled=true;
            if(rbplayer.player.paused){
                rbplayer.setSongTitle("Ready.");
            }
        };              
        rbplayer.player.onplaying=function() { 
            playButton.disabled=true;            
            stopButton.disabled=false;            
        };
        rbplayer.player.onpause=function() {
            playButton.disabled=false;            
            stopButton.disabled=true;     
            rbplayer.setStausText("Stopped");       
        };   
        rbplayer.player.onloadstart=function() {
            playButton.disabled=false;            
            stopButton.disabled=true;                
            rbplayer.setStausText("Loading..."); 
        };                
    },
    playRock: function(){
        rbplayer.player.load();
        rbplayer.player.play();
    },
    pauseRock: function(){
        rbplayer.player.pause();
    },
    setupPlayer: function(){
        var audio=document.getElementById("radio");
        audio.src=rbplayer.urlBase.concat(rbplayer.urlParams);
        audio.type="audio/mpeg";
        rbplayer.setVolumeButtons();
    },
    setPausedTimer: function(){
        if(rbplayer.player.paused){
            if(rbplayer.pauseInterval==null){
                rbplayer.pauseInterval=setInterval(function(){
                    if(rbplayer.player.paused){
                        rbplayer.setStausText("Stopped");                    
                    } 
                    clearInterval(rbplayer.pauseInterval);
                    rbplayer.pauseInterval=null;  
                }, rbplayer.songInfoRefreshRate);                
            }
        }
    },
    volumeString: function(){
        return "Volume: " + rbplayer.player.volume*100 + "%";
    },
    setVolumeButtons: function(){
        var volUp=document.getElementById("volUp");  
        var volDown=document.getElementById("volDown");     
        if(volUp!=null){ 
            volUp.disabled=rbplayer.player.volume==1;
        }
        if(volDown!=null){
            volDown.disabled=rbplayer.player.volume==0;
        }
    },
    volUp: function(){
        if(rbplayer.player.volume<1){
            rbplayer.setPausedTimer();
            rbplayer.player.volume=Math.round((rbplayer.player.volume+0.1)*10)/10;
            rbplayer.setStausText(rbplayer.volumeString());
            rbplayer.setVolumeButtons();
        }
    },  
    volDown: function (){
        if(0<rbplayer.player.volume){
            rbplayer.setPausedTimer();        
            rbplayer.player.volume=Math.round((rbplayer.player.volume-0.1)*10)/10;        
            rbplayer.setStausText(rbplayer.volumeString());
            rbplayer.setVolumeButtons();        
        }
    },
    forceSongTitle: function(){
        rbplayer.forceSongShowTitle=true;
    }
}