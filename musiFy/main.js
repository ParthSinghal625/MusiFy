const progress = document.getElementById("progBar");
const timeDisplay = document.getElementById("timer");
const totalTimeDisplay = document.getElementById("finalTimer");
const playBTN = document.getElementById("playBtn");
const volDiv = document.getElementById("volSlider");
const shuffleIMG = document.getElementById("shuffleImg");
const lyricsIMG = document.getElementById("lyricsImg");
let song;
let queueArray = [];
// let startTime = 0;
// let elapsedTime = 0;
runningTime = false;
songRunTime = false;
shuffle = false;
lyricOn = false;

const music = fetch("music.json")
              .then((response) => response.json())
              .then((values) => values.forEach((value) => {
                //create new song bars
                const newDiv = document.createElement("div");
                newDiv.id = "song";
                newDiv.textContent = value.name

                //add audio to div
                const Audio = document.createElement("audio");
                Audio.src = value.audioFile;
                Audio.id = `song${value.id}`;
                newDiv.appendChild(Audio);
                queueArray.push(Audio.id);

                newDiv.addEventListener("click", () => {
                    if(song){reset()};

                    song = Audio;
                    songPlay();
                    progressBar();

                    //dynamic image-song sync
                    updateSongImage(Audio.id);

                    //total duration
                    if(song.readyState > 0){
                        updateTotalTime();
                    }else{
                        song.addEventListener("loadedmetadata", updateTotalTime);
                    };

                    setupSongTimer(song);

                })

                document.getElementById("songSlider").appendChild(newDiv);
              }))

// songBtn.addEventListener("click", () => {
    
//     reset();
//     songPlay();
//     progressBar();

//     console.log(song.duration);
// });

// function time(){
//     if(!runningTime){
//         startTime = Date.now() - elapsedTime;
//         timer = setInterval( update, 1000);
//         runningTime = true;
//     }
// }

// function update(){
//     elapsedTime = Date.now() - startTime;

//     let minutes = String(Math.floor(elapsedTime / (1000 * 60) % 60)).padStart(2, "0");
//     let seconds = String(Math.floor(elapsedTime / 1000 % 60)).padStart(2, "0");

//     timeDisplay.textContent = `${minutes}:${seconds}`;

//     if(Math.floor(elapsedTime / 1000) >= Math.floor(song.duration)){
//         clearInterval(timer);
//         reset();
//     }
// }

function setupSongTimer(song) {
    song.addEventListener("timeupdate", () => {
        let current = Math.floor(song.currentTime);
        let minutes = String(Math.floor(current / 60)).padStart(2, "0");
        let seconds = String(current % 60).padStart(2, "0");
        timeDisplay.textContent = `${minutes}:${seconds}`;
    });
}

function updateTotalTime() {
  let totalMinutes = String(Math.floor(song.duration / 60)).padStart(2, "0");
  let totalSeconds = String(Math.floor(song.duration % 60)).padStart(2, "0");
  totalTimeDisplay.textContent = `${totalMinutes}:${totalSeconds}`;
}

function updateSongImage(songId) {
    // Find the song data by id
    fetch("music.json")
        .then(response => response.json())
        .then(values => {
            const songData = values.find(val => `song${val.id}` === songId);
            if (songData) {
                const songImgDiv = document.getElementById("songImg");
                songImgDiv.innerHTML = "";
                const img = document.createElement("img");
                img.src = songData.songCover;
                img.style.width = "100%";
                img.style.height = "auto";
                img.style.borderRadius = "20px";
                songImgDiv.appendChild(img);
            }
        });
}

//controls

function reset(){
    if(song){
        songPause();
        song.currentTime = 0;
    }
    runningTime = false;
    songRunTime = false;
    totalTimeDisplay.textContent = "00:00";
    timeDisplay.textContent = "00:00";
    progress.style.width = "0%";
    controlPlayBtn();
}

function playFromBeginning(){
    reset();
    songPlay();
    updateTotalTime();
}

function playNext(){

    reset();

    let currentSongId = song.id;
    x = queueArray.findIndex(songId => songId === currentSongId);
    
    nextSongIndex = (x + 1) % queueArray.length;
    nextSongId = queueArray[nextSongIndex];

    song = document.getElementById(nextSongId);
    songPlay();
    progressBar();
    updateTotalTime();
    updateSongImage(nextSongId);
    setupSongTimer(song);
}

function songPlay(){
    if(song){
        song.play();
        songRunTime = true;
        runningTime = true;
        controlPlayBtn();
    }
}

function songPause(){
    if(!song) return;
    if(songRunTime){
        runningTime = false;
        songRunTime = false;
        song.pause();
        controlPlayBtn();
    }else{
        runningTime = true;
        songRunTime = true;
        song.play();
        controlPlayBtn();
    }
}

function songStop(){
    if(!song) return;
    songPause();
    song.currentTime = 0;
}

function progressBar(){
    if(!song) return;
    song.addEventListener("timeupdate", () => {
        const percent = (song.currentTime / song.duration) * 100;
        progress.style.width = `${percent}%`;
    });

    if(progress.style.width >= "100%"){
        reset();
    }
}

//creating control button image
const imgTag = document.createElement("img");
playBTN.appendChild(imgTag);
imgTag.id = "controlBarImg";

function controlPlayBtn() {
    if(!song){
        imgTag.src = "core/play.png";
    }else if(song){
        imgTag.src = "core/pause.png";
        if(songRunTime){
            imgTag.src = "core/pause.png";
        }else if(!songRunTime){
            imgTag.src = "core/play.png";
        }
    }
}

let y;
const slider = document.getElementById("sliderVolume");

slider.oninput = () => {
    y = this.value;
}

slider.addEventListener("mousemove", () => {
    let x = slider.value;
    var colour = `linear-gradient(90deg, rgb(199, 29, 255) 0%, rgb(199, 29, 255) ${x}%, rgb(82, 82, 82) ${x}%, rgb(82, 82, 82) 100%)`;
    slider.style.background = colour;

    //volume - audio sync
    let vol = x / 100;
    if(song) song.volume = vol;
})

function volume(){
    
    if (volDiv.style.display === "none" || volDiv.style.display === "") {
        volDiv.style.display = "block";
    } else {
        volDiv.style.display = "none";
    }
}

//shuffle mode
function shuffleMode(){
    
    if(!shuffle){
        shuffle = true;
        shuffleIMG.src = "core/shuffle-on.png";

        async function shuffleWorking() {
            await playnext();


        }
    }else{
        shuffle = false;
        shuffleIMG.src = "core/shuffle.png";
    }

    
}

function lyricsMode(){
    
    if(!lyricOn){
        lyricOn = true;

        lyricsIMG.src = "core/lyrics-on.png";

        async function lyricsModeWorking() {
            await playnext();


        }
    }else{
        lyricOn = false;
        lyricsIMG.src = "core/lyrics.png";
    }

    
}

controlPlayBtn();