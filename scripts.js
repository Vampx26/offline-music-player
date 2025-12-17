console.log("start")
let currentSong = new Audio();

let songs;
let currfolder;
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

async function getsongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let respone = await a.text();
    let div = document.createElement("div");
    div.innerHTML = respone;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".m4a") || element.href.endsWith(".mp3")) {
            // console.log(element)
            let parts = element.href.split("%5C");
            // console.log(parts)
            let filename = parts[parts.length - 1];
            // console.log(filename)
            songs.push(filename);
        }
    }


    // console.log(songs)
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    // console.log(songs)
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

    

    // attach an event listener to each song

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)

        })
    })
    
    return songs
}

const playMusic = (track) => {
    currentSong.src = `/${currfolder}/` + track
    currentSong.play()
    play.src = "pause.svg"
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function displayalbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/ `);
    let respone = await a.text();
    let div = document.createElement("div")
    div.innerHTML = respone;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        if (e.href.includes("songs")) { 

            let folder = (e.href.split("%5C").slice(-1)[0])
            // console.log(folder)
            //get the meta data of the folder
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
            let respone = await a.json();
            // console.log(respone)
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="play">

                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://
                                    www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000000" stroke-width="1.5"
                                    stroke-linejoin="round" />
                            </svg>

                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${respone.title}</h2>
                        <p>${respone.description}</p>
                    </div>`
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        // console.log(e)
        e.addEventListener("click", async item => {
            // console.log(item.currentTarget, item.currentTarget.dataset )
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)

        })
    });


}

async function main() {
    await getsongs("songs/bh")

    // display all the albums on the page
    await displayalbums()


    // add event listener to play previous and next
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


    // listen for timeupdate event

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
        console.log(index)
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


    //add event listener to mute the track
    document.querySelector(".volume > img").addEventListener("click", e=>{
        console.log(e.currentTarget)
        if(e.currentTarget.src.includes ("volume.svg")){
            e.currentTarget.src = e.currentTarget.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.getElementById("volumeslider").value = 0;
        }
        
        else{
            e.currentTarget.src = e.currentTarget.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.getElementById("volumeslider").value = .10;
        }
    })


}

main()