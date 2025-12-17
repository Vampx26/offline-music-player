console.log("start")
let currentSong = new Audio();

let songs;
// let currfolder;
function formatTime(seconds) {
    // Handle invalid or empty input
    if (isNaN(seconds) || seconds < 0) return "00:00";

    // Get minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    // Add leading zeros if needed
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(secs).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs() {
    // currfolder = folder ;
    let a = await fetch(`http://127.0.0.1:3000/songs/`);
    let respone = await a.text();
    // console.log(respone)
    let div = document.createElement("div");
    div.innerHTML = respone;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".m4a") || element.href.endsWith(".mp3")) {
            songs.push(element.href.split("%5Csongs%5C")[1]);
        }
    }
    console.log(songs)
    return songs
}

const playMusic = (track) => {
    currentSong.src = "/songs/" + track
    currentSong.play()
    play.src = "pause.svg"
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {


    songs = await getsongs()

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    console.log(songs)
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")} </div>
                                <div>Vamp</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div> </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)

        })
    })

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    prev.addEventListener("click", () => {
        console.log("prev")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= length) {

            playMusic(songs[index - 1].replaceAll("%20", " "))

        }
    })


    next.addEventListener("click", () => {
        console.log("next")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        // console.log(currentSong, index)
        if ((index + 1) > length) {

            playMusic(songs[index + 1].replaceAll("%20", " "))

        }
    })

    currentSong.addEventListener("ended", () => {
        next.click();
    });

    document.getElementById("volumeslider").addEventListener("input", (e) => {
        currentSong.volume = e.target.value;
    });



}

main()