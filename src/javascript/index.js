import airencuoguo from "../assets/lyric_爱人错过.json";
import shuixingji from "../assets/lyric_水星记.json";
import zhengdema from "../assets/lyric_真的吗.json";
import fannaoge from "../assets/lyric_烦恼歌.json";
import jiazhuang from "../assets/lyric_假装.json";
import qianqianquege from "../assets/lyric_千千阙歌.json";
import onlyMyRailgun from "../assets/lyric_only_my_railgun.json";
import mjiazhuang from "../assets/陈雪凝 - 假装.mp3";
import mairencuoguo from "../assets/告五人-爱人错过.mp3";
import mshuixingji from "../assets/郭顶-水星记.mp3";
import mzhengdema from "../assets/莫文蔚-真的吗.mp3";
import mfannaoge from "../assets/张学友-烦恼歌.mp3";
import mOnlyMyRailgun from "../assets/only_my_railgun.mp3";
import mqianqianquege from "../assets/陈慧娴 - 千千阙歌.mp3";
import Swiper from "./swiper";

class Player {
  constructor(node) {
    this.$ = (selector) => this.root.querySelector(selector);
    this.$$ = (selector) => this.root.querySelectorAll(selector);
    this.root = typeof node === "string" ? document.querySelector(node) : node;
    this.songList = [];
    this.currentIndex = 0;
    this.audio = new Audio();
    this.start();
    this.bind();
  }
  start() {
    this.songList = [
      {
        id: "-1",
        title: "only my railgun",
        author: "fripside",
        albumn: "某科学的超电磁炮",
        lyric: onlyMyRailgun,
        url: mOnlyMyRailgun,
      },
      {
        id: "0",
        title: "真的吗",
        author: "莫文蔚",
        albumn: "我要说I Say",
        lyric: zhengdema,
        url: mzhengdema,
      },
      {
        id: "1",
        title: "水星记",
        author: "郭顶",
        albumn: "飞行器的执行周期",
        lyric: shuixingji,
        url: mshuixingji,
      },
      {
        id: "3",
        title: "假装",
        author: "陈雪凝",
        albumn: "拾陆",
        lyric: jiazhuang,
        url: mjiazhuang,
      },
      {
        id: "4",
        title: "烦恼歌",
        author: "张学友",
        albumn: "在你身边",
        lyric: fannaoge,
        url: mfannaoge,
      },
      {
        id: "5",
        title: "爱人错过",
        author: "告五人",
        albumn: "我肯定在几百年前就说过爱你",
        lyric: airencuoguo,
        url: mairencuoguo,
      },
      {
        id: "6",
        title: "千千阙歌",
        author: "陈慧娴",
        albumn: "千千阙歌",
        lyric: qianqianquege,
        url: mqianqianquege,
      },
    ];
    this.renderSong();
  }
  bind() {
    this.audio.src = this.songList[this.currentIndex].url;
    this.$(".play-pause").onclick = (e) => {
      if (e.target.classList.contains("playing")) {
        this.audio.pause();
        e.target.classList.remove("playing");
      } else {
        this.audio.play();
        e.target.classList.add("playing");
      }
    };

    this.$(".play-prev").onclick = () => {
      this.playPrevSong();
    };
    this.$(".play-next").onclick = () => {
      this.playNextSong();
    };

    this.$(".area-bar .progress-button").ontouchstart = (e) => {
      this.progressButtonTouchStart = {
        x: e.touches[0].clientX,
        left: e.target.offsetLeft,
      };
    };
    this.$(".area-bar .progress-button").ontouchmove = (e) => {
      const delta = e.touches[0].clientX - this.progressButtonTouchStart.x;
      const bar = this.$(".area-bar .bar");
      const progress = this.$(".area-bar .progress");
      progress.style.width =
        Math.min(
          Math.max(
            ((delta + this.progressButtonTouchStart.left) / bar.offsetWidth) *
              100,
            0
          ),
          100
        ) + "%";
    };
    this.$(".area-bar .progress-button").ontouchend = () => {
      this.progressButtonTouchStart = undefined;
      const progress = this.$(".area-bar .progress");
      this.audio.currentTime =
        (this.audio.duration * parseInt(progress.style.width)) / 100;
    };

    this.audio.ontimeupdate = () => {
      this.locateLyric();
      if (!this.progressButtonTouchStart) {
        this.setProgerssBar();
      }
    };

    let swiper = new Swiper(this.$(".panels"));
    swiper.on("swipLeft", (e) => {
      e.classList.remove("panel1");
      e.classList.add("panel2");
      this.$$(".header .balls span")[1].classList.add("current");
      this.$$(".header .balls span")[0].classList.remove("current");
      this.$(".footer .buttons").style.opacity = 0;
      this.$(".footer .buttons").style.pointerEvents = "none";
    });
    swiper.on("swipRight", (e) => {
      e.classList.remove("panel2");
      e.classList.add("panel1");
      this.$$(".header .balls span")[1].classList.remove("current");
      this.$$(".header .balls span")[0].classList.add("current");
      this.$(".footer .buttons").style.opacity = 1;
      this.$(".footer .buttons").style.pointerEvents = "auto";
    });
  }
  renderSong() {
    let songObj = this.songList[this.currentIndex];
    this.$(".header h1").innerText = songObj.title;
    this.$(".header p").innerText = songObj.author + "-" + songObj.albumn;
    this.audio.onloadedmetadata = () =>
      (this.$(".time-end").innerText = this.formateTime(this.audio.duration));
    this.loadLyrics();
  }
  playPrevSong() {
    this.currentIndex =
      (this.songList.length + this.currentIndex - 1) % this.songList.length;
    this.audio.src = this.songList[this.currentIndex].url;
    this.audio.play();
    this.$(".play-pause").classList.add("playing");
    this.renderSong();
  }
  playNextSong() {
    this.currentIndex = (this.currentIndex + 1) % this.songList.length;
    this.audio.src = this.songList[this.currentIndex].url;
    this.audio.play();
    this.$(".play-pause").classList.add("playing");
    this.renderSong();
  }

  loadLyrics() {
    this.setLyrics(this.songList[this.currentIndex].lyric.lrc.lyric);
  }

  locateLyric() {
    const currentTime = (this.audio?.currentTime ?? 0) * 1000;
    for (let index = 0; index < this.lyricsArr.length; index++) {
      if (this.lyricsArr[index][0] < currentTime) {
        this.lyricIndex = index;
      } else {
        break;
      }
    }
    let node = this.$(
      '[data-time="' + this.lyricsArr[this.lyricIndex][0] + '"]'
    );
    if (node) {
      this.setLyricToCenter(node);
    }
    this.$$(".panel-effect .lyrics p")[0].innerText =
      this.lyricsArr[this.lyricIndex][1];
    this.$$(".panel-effect .lyrics p")[1].innerText = this.lyricsArr[
      this.lyricIndex + 1
    ]
      ? this.lyricsArr[this.lyricIndex + 1][1]
      : "";
  }

  setLyrics(lyrics) {
    this.lyricIndex = 0;
    let fragment = document.createDocumentFragment();
    this.lyricsArr = [];
    lyrics
      .split(/\n/)
      .filter((str) => str.match(/\[.+?\]/))
      .forEach((line) => {
        let str = line.replace(/\[.+?\]/g, "");
        line.match(/\[.+?\]/g).forEach((t) => {
          t = t.replace(/[\[\]]/g, "");
          let milliseconds =
            parseInt(t.slice(0, 2)) * 60 * 1000 +
            parseInt(t.slice(3, 5)) * 1000 +
            parseInt(t.slice(6));
          this.lyricsArr.push([milliseconds, str]);
        });
      });

    this.lyricsArr = this.lyricsArr
      .filter((line) => line[1].trim() !== "")
      .sort((v1, v2) => {
        if (v1[0] > v2[0]) {
          return 1;
        } else {
          return -1;
        }
      });
    this.lyricsArr.forEach((line) => {
      let node = document.createElement("p");
      node.setAttribute("data-time", line[0]);
      node.innerText = line[1];
      fragment.appendChild(node);
    });
    this.$$(".panel-effect .lyrics p")[0].innerText =
      this.lyricsArr[this.lyricIndex][1];
    this.$$(".panel-effect .lyrics p")[1].innerText = this.lyricsArr[
      this.lyricIndex + 1
    ]
      ? this.lyricsArr[this.lyricIndex + 1][1]
      : "";
    this.$(".panel-lyrics .container").innerHTML = "";
    this.$(".panel-lyrics .container").appendChild(fragment);
  }

  setLyricToCenter(node) {
    let offset = node.offsetTop - this.$(".panel-lyrics").offsetHeight / 2;
    this.$(
      ".panel-lyrics .container"
    ).style.transform = `translateY(${-offset}px)`;
    this.$$(".panel-lyrics p").forEach((node) => {
      node.classList.remove("current");
    });
    node.classList.add("current");
  }

  setProgerssBar() {
    let percent = (this.audio.currentTime * 100) / this.audio.duration + "%";
    this.$(".bar .progress").style.width = percent;
    this.$(".time-start").innerText = this.formateTime(this.audio.currentTime);
  }

  formateTime(secondsTotal) {
    let minutes = parseInt(secondsTotal / 60);
    minutes = minutes >= 10 ? "" + minutes : "0" + minutes;
    let seconds = parseInt(secondsTotal % 60);
    seconds = seconds >= 10 ? "" + seconds : "0" + seconds;
    return minutes + ":" + seconds;
  }
}

window.p = new Player("#player");
