<template>
  <!--https://github.com/videojs/video.js/blob/master/docs/guides/faq.md#q-how-can-i-play-rtmp-video-in-videojs-->
  <div class="live-video-box">
    <video
      id="liveVideo"
      class="video-js"
      preload="auto"
    >
      <!-- <source src="rtmp://live.hkstv.hk.lxdns.com/live/hks" type="rtmp/flv"></source> -->
      <!--<source src="rtmp://zb.kangfuxigu.com/xigulive/5_1520483715" type="rtmp/flv"></source>-->
      <source :src="streamUrl" type="rtmp/flv">
      <!--<source src="http://vjs.zencdn.net/v/oceans.mp4" type="video/mp4">-->
      <p class="vjs-no-js">
        To view this video please enable JavaScript, and consider upgrading to a
        web browser that
        <a href="http://videojs.com/html5-video-support/" target="_blank">
          supports HTML5 video
        </a>
      </p>
    </video>
    <div v-show="!isLive" id="noLive" class="live-video-empty">
      <img :src="noLivePic"/>
    </div>

  </div>
</template>

<script>
  // require('video-js.css');
  import {mapState, mapActions, mapMutations} from 'vuex';
  import 'video.js/dist/video-js.min.css';
  import videojs from 'video.js';
  import 'src/utils/videoTitleBar';
  import Flash from 'videojs-flash';
  import Event from 'src/utils/Event';
  // import 'video.js/dist/ie8/videojs-ie8.min.js';
  import tip from 'src/mixins/tip'


  export default {
    data() {
      return {
        streamUrl: "",
        player: {},
        isLive: true,
        noLivePic: './web/dist/video/video_poster.png'
      }
    },
    props: {},
    mixins: [tip],
    created() {
      this.$bus.on(Event.VIDEO_EVENT, (msgObject) => {
        const msgmethod = msgObject._method_;
        switch (msgmethod) {
          case 'playLiveVideo':
            this.player && this.player.play && this.player.play();
            break;
          case 'pauseLiveVideo':
            this.player && this.player.pause && this.player.pause();
            break;
          case 'CloseVideo':
            this.warn("直播结束");
            this.player && this.player.reset(); //清理
            break;
          case 'StartEndLive':
            if (msgObject.action == 15) { //直播开始
              refreshSliderLive();
              setTimeout(() => {
                location.href = location.href + '&init=1&source=' +encodeURIComponent(sourceUrl);
              }, 100);
            } else if (msgObject.action == 18) { //直播开始
              //此处不做逻辑，逻辑在CloseVideo中处理
            }
            break;

        }
      });

      //开关播
      this.$bus.on(Event.CLOSE_VIDEO, (msgObject) => {
        // const msgmethod = msgObject.action;
        // if(msgmethod == 18) {
        this.warn("直播结束");
        this.player.reset(); //清理
      });


    },
    beforeDestroy() {
      this.$bus.off(Event.VIDEO_EVENT);
    },
    mounted() {

      this.streamUrl = this.room.streamUrl;
      // this.streamUrl = "rtmp://zb.kangfuxigu.com/xigulive/5_1520483715";
      // this.streamUrl = "rtmp://live.hkstv.hk.lxdns.com/live/hks";


      this.$nextTick(function () {
        this.setVideoHeight();
        window.addEventListener('resize', (e) => {
       
          this.setVideoHeight();
        });

         if(this.live && this.live.islive) { //有直播
          setTimeout(() => {
            this.playVideo();
          }, 0);
         } else {
           this.warn(this.config.sidebar_unlive_notice || this.anchor.user_nicename + '主播未开播，请稍后...')
           this.isLive = false;
         }


      })
    },
    computed: {
       ...mapState([
        'config',
        'room',
        'anchor',
        'live'
      ]),
    },
    methods: {
      setVideoHeight() {
        let liveVideoElement = document.getElementById("liveVideo");
        var pageWidth =  window.innerWidth || document.body.clientWidth;
        if(parseInt(pageWidth)> 600) {
          pageWidth = getComputedStyle(liveVideoElement).width;
        }


        liveVideoElement.style.width = parseInt(pageWidth) + 'px';
        liveVideoElement.style.height = (parseInt(pageWidth) * 9 / 16) + 'px';

        if(!this.isLive) {
          document.getElementById("noLive").style.height = liveVideoElement.style.height;
        }
      },

      solveChromeVideoBug() {
        /*此处是为了解决一个很奇葩的bug。chrome浏览器无法自动播放视频*/
        var liveVideoElement = document.getElementById("liveVideo");
        // var videoWidth = getComputedStyle(liveVideoElement).width;
        var pageWidth =  window.innerWidth || document.body.clientWidth;
        if(parseInt(pageWidth)> 600) {
          pageWidth = getComputedStyle(liveVideoElement).width;
        }


        liveVideoElement.style.width = (parseInt(pageWidth) + 1) + 'px';
        setTimeout(() => {
          liveVideoElement.style.width = (parseInt(pageWidth)) + 'px';
        }, 2000)
      },

      playVideo() {
        // 参考： http://www.cnblogs.com/afrog/p/6689179.html
        const _this = this;

        var options = {
          techOrder: ['flash', 'html5'],
          controls: true,
          autoplay: true,
          // muted: true,
          // preload: 'metadata',
          preload: 'true',
          // preload: 'none',
          // flash: {
          //   swf: './video-js.swf'
          // },
          poster: this.live.thumb || this.noLivePic,
          errorImage: this.noLivePic,
          language: 'pt',

          bigPlayButton: false, //大的播放按钮（很丑，把它隐藏）
          textTrackDisplay: false,
          // posterImage: false,
          // errorDisplay : false,
          controlBar: {
            // captionsButton : false,
            // chaptersButton: false,
            // subtitlesButton:false,
            // liveDisplay:false,
            // playbackRateMenuButton:false,
            progressControl: false,
            // TimeDivider: false,
            // volumeControl: false,
            fullscreenToggle: false,
            remainingTimeDisplay: false
          }
          // sources: [{
          //   src: "",
          //   type: this.room.streamUrl
          // }]
        };


        // if(process.env.NODE_ENV == 'production'){
        // options.flash = {swf: './web/dist/video-js.swf'};
        // options.flash = {swf: sourceUrl + '/web/dist/video-js.swf'};
        // }

        videojs.addLanguage('pt', {
          'Play': '播放',
          'Pause': '暂停',
          'Current Time': '当前时间',
          'Duration Time': '时间',
          'Remaining Time': '剩余时间',
          'Mute': '静音',
          'Unmute': '取消静音'
        })

        this.player = videojs('liveVideo', options, function onPlayerReady() {
          _this.solveChromeVideoBug();
          setTimeout(function() {
            _this.solveChromeVideoBug();
            setTimeout(function() {
              _this.setVideoHeight();
            },100)
          },3000)

          // this.dispose(); //清理
          // window.player = this;

          // How about an event listener?
          this.on('ended', function () {
            // this.pause();
            // this.hide()
          });
        });

        this.player.addChild('TitleBar', {text: this.anchor.user_nicename});

      },
    },
  }


</script>
<style lang="scss" scoped>
  /*注意：原视频宽度为 600 * 337.5, 比例为：16/9*/
  .video-js {
    margin: 0 auto;
    width: 100%;
    min-width: 263px;
    min-height: 148px;
  }

  .live-video-box {
    position: relative;

    .live-video-empty {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  /*@media (min-width: 300px) {
    .video-js {
      !*height: 300px;*!
    }
  }
  @media (max-width: 300px) {
    .video-js {
      !*height: 148px;*!
    }
  }*/
</style>

