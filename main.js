const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $(".cd");
const playlist = $(".playlist");
const player = $(".player");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const btnPlay = $(".btn-toggle-play");
const progress = $("#progress");
const btnNext = $(".btn-next");
const btnPrev = $(".btn-prev");
const btnReload = $(".btn-repeat");
const btnRandom = $(".btn-random");

let currentIndex = 0;
let isPlaying = false;
let isRandom = false;

var songApi = "http://localhost:3000/songs";

fetch(songApi)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);

    start(data);
  });

//function start web
var start = function (data) {
  render(data);

  loadCurrentSong(data);

  handleEvents(data);
};

//function render songs
var render = function (data) {
  const htmls = data.map((song, index) => {
    return `
                        <div class="song ${
                          index === currentIndex ? "active" : ""
                        }"data-index="${index}">
                            <div class="thumb"
                                style="background-image: url('${song.image}')">
                            </div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>
                    `;
  });
  playlist.innerHTML = htmls.join("");
};

//handleEvents
var handleEvents = function (data) {

  //handle cd
  const cdWidth = cd.offsetWidth;
  document.onscroll = function () {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const newCdWidth = cdWidth - scrollTop;
    cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
    cd.style.opacity = newCdWidth / cdWidth;
  };


  //handle play
  btnPlay.onclick = function () {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };


  //onplay
  audio.onplay = function () {
    isPlaying = true;
    player.classList.add("playing");
  };


  //onpause
  audio.onpause = function () {
    isPlaying = false;
    player.classList.remove("playing");
  };


  //change timeline
  audio.ontimeupdate = function () {
    if (audio.duration) {
      const progressPercent = Math.floor(
        (audio.currentTime / audio.duration) * 100
      );
      progress.value = progressPercent;
    }
  };


  //seekTime
  progress.oninput = function () {
    const seekTime = (audio.duration / 100) * progress.value;
    audio.currentTime = seekTime;
  };


  //next song
  btnNext.onclick = function () {
    if (isRandom) {
      playRandom(data);
      loadCurrentSong(data);
      audio.play();
      render(data);
    } else {
      currentIndex++;
      if (currentIndex >= data.length) {
        currentIndex = 0;
      }
      loadCurrentSong(data);
      audio.play();
      render(data);
    }
  };


  //prev song
  btnPrev.onclick = function () {
    if (isRandom) {
      playRandom(data);
      loadCurrentSong(data);
      audio.play();
      render(data);
    } else {
      currentIndex--;
      if (currentIndex < 0) {
        currentIndex = data.length - 1;
      }
      loadCurrentSong(data);
      audio.play();
      render(data);
    }
  };


  //reload song
  btnReload.onclick = function () {
    audio.currentTime = 0;
  };


  //active random btn
  btnRandom.onclick = function () {
    isRandom = !isRandom;
    btnRandom.classList.toggle("active", isRandom);
  };


  //move to next song when ended
  audio.onended = function () {
    if (isRandom) {
      playRandom(data);
      loadCurrentSong(data);
      audio.play();
      render(data);
    } else {
      currentIndex++;
      if (currentIndex > data.length) {
        currentIndex = 0;
      }
      loadCurrentSong(data);
      audio.play();
      render(data);
    }
  };


  //click playlist
  playlist.onclick = function (e) {
    const songNode = e.target.closest(".song:not(.active)");
    if (songNode) {
      currentIndex = Number(songNode.dataset.index);
      loadCurrentSong(data);
      audio.play();
      render(data);
    }
  };
};


//get currentSong
var getCurrentSong = function (data) {
  return data[currentIndex];
};


//load current song
var loadCurrentSong = function (data) {
  const currentSong = getCurrentSong(data);
  heading.textContent = currentSong.name;
  cdThumb.style.backgroundImage = `url('${currentSong.image}`;
  audio.src = currentSong.path;
  // console.log(heading, cdThumb, audio);
};


//play random song
var playRandom = function (data) {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * data.length);
  } while (newIndex === currentIndex);

  currentIndex = newIndex;
};
