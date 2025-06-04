# RockBoxRadioPlayer
Demonstration web based player (HTML5 audio player) for IceCast servers. Using HTML, JS, CSS.
## Features
- Start, Stop music
- Querying and showing song title information
- Demonstrating embedded mode (iframe)
- Tested in firefox, chrome, and android browser.
- Volume control
- Modern variant with volume slider (see `modern.html`)

## Using `audioplayer.js`

1. Include the script in your page:
   ```html
   <script src="./js/audioplayer.js"></script>
   ```
2. Add an `<audio id="radio">` element and the control buttons used by the
   player (`playButton`, `stopButton`, optionally volume controls).
3. Initialize the player when the page loads:
   ```html
   <body onload="
       rbplayer.setup('https://yourserver:port','/stream?type=.mp3','My Radio',0);
       rbplayer.setupPlayer();
   ">
   ```
4. Call `rbplayer.bindVolumeSlider('volumeSlider');` if you use a volume
   slider.

See `simplesample.html` or `modern.html` for a working example.
