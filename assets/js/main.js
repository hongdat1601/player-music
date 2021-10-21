const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const dashboard = $('.dashboard');

const app = {
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    currentIndex: 0,
    oldIndex: 0,
    songs: [
        {
            name: 'Phai Dấu Cuộc Tình',
            singer: 'Tăng Phúc',
            path: './assets/audio/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Chúng Ta Dừng Lại Ở Đây Thôi',
            singer: 'Nguyễn Đình Vũ',
            path: './assets/audio/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'What Are Words',
            singer: 'Chris Medina',
            path: './assets/audio/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Suy Nghĩ Trong Anh',
            singer: 'Nam Cường,Khắc Việt',
            path: './assets/audio/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'Walk Thru Fire',
            singer: 'Vicetone, Meron Ryan',
            path: './assets/audio/song5.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: 'Can\'t Help Falling In Love',
            singer: 'Harrison Craig',
            path: './assets/audio/song6.mp3',
            image: './assets/img/song6.jpg'
        },
        {
            name: 'Let Her Go',
            singer: 'Passenger',
            path: './assets/audio/song7.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            name: 'Thinking Out Loud',
            singer: 'Ed Sheeran',
            path: './assets/audio/song8.mp3',
            image: './assets/img/song8.jpg'
        },
        {
            name: 'My Love (Acoustic)',
            singer: 'Westlife',
            path: './assets/audio/song9.mp3',
            image: './assets/img/song9.jpg'
        },
        {
            name: 'You Raise Me Up',
            singer: 'Westlife',
            path: './assets/audio/song10.mp3',
            image: './assets/img/song10.jpg'
        }
    ],
    render: function () {
        const htmls = this.songs.map(song => {
            return `
                <div class="song">
                    <div class="thumb" style="background-image: url('${song.image}')">
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
        $('.playlist').innerHTML = htmls.join('');
        songList = $$('.song');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        const cdThumbAnimation = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations:Infinity
        });
        cdThumbAnimation.pause();

        // Xử lý trượt màn hình
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop
            
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        // Xử lý khi click play
        playBtn.onclick = function () {
            if(!_this.isPlaying) {
                audio.play();
            } else {
                audio.pause();
            }
        };

        audio.onplay = function () {
            cdThumbAnimation.play();
            player.classList.add('playing');
            _this.isPlaying = true;
        };

        audio.onpause = function () {
            cdThumbAnimation.pause();
            player.classList.remove('playing');
            _this.isPlaying = false;
        };

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        };

        // Khi audio ended
        audio.onended = function() {
            if(!_this.isRepeat) _this.nextSong()
                else {
                    audio.currentTime = 0;
                    audio.play();
                }
        };

        // Xử lý khi tua bài hát
        progress.onchange = function() {
            const seekTime = progress.value / 100 * audio.duration;
            audio.currentTime = seekTime;
        };

        // Xử lý next
        nextBtn.onclick = function() {
            _this.nextSong();
        };

        // Xử lý prev
        prevBtn.onclick = function() {
            _this.prevSong();
        };

        // Random Song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle("active", _this.isRandom);
        };

        // Repeat song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle("active", _this.isRepeat);
        };

        // Khi click song
        let songList = $$('.song');
        songList.forEach(function(song, index) {
            song.onclick = function() {
                if(!song.classList.contains('active')) {
                    _this.oldIndex = _this.currentIndex;
                    _this.currentIndex = index;
                    _this.loadCurrentSong();
                    audio.play();
                }
            }
        })

    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;

        this.activeSong();
    },
    nextSong: function () {
        this.oldIndex = this.currentIndex;

        if (this.isRandom) {
            this.randomSong();
        } else {
            this.currentIndex++;
        }

        if(this.currentIndex >= this.songs.length) this.currentIndex = 0;
        this.loadCurrentSong()
        audio.play();
    },
    prevSong: function () {
        this.oldIndex = this.currentIndex;

        if (this.isRandom) {
            this.randomSong();
        } else {
            this.currentIndex--;
        }

        if(this.currentIndex < 0) this.currentIndex = this.songs.length-1;
        this.loadCurrentSong()
        audio.play();
    },
    randomSong: function () {
        let currentIndex = this.currentIndex;
        do {
            this.currentIndex = Math.floor(Math.random() * this.songs.length);
        } while(this.currentIndex === currentIndex);
    },
    activeSong: function () {
        let songList = $$('.song')
        songList[this.oldIndex].classList.remove('active');

        let song = songList[this.currentIndex]
        song.classList.add('active');
    },
    start: function () {
        this.render();
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
    }
};

app.start();