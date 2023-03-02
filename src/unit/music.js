import store from '../store';

// 使用 Web Audio API
const AudioContext = (
  window.AudioContext ||
  window.webkitAudioContext ||
  window.mozAudioContext ||
  window.oAudioContext ||
  window.msAudioContext
);

const hasWebAudioAPI = {
  data: !!AudioContext && location.protocol.indexOf('http') !== -1,
};


const music = {};

(() => {
  if (!hasWebAudioAPI.data) {
    return;
  }
  const url = './music.mp3';
  const context = new AudioContext();
  const req = new XMLHttpRequest();
  req.open('GET', url, true); // 初始化一个请求。
  req.responseType = 'arraybuffer'; // 一个用于定义响应类型的枚举值（enumerated value）。

  req.onload = () => {
    // 异步解码音频文件中的 ArrayBuffer
    context.decodeAudioData(req.response, (buf) => { // 将拿到的audio解码转为buffer
      const getSource = () => { // 创建source源。
        // 创建一个新的AudioBufferSourceNode接口，该接口可以通过AudioBuffer 对象来播放音频数据
        const source = context.createBufferSource();
        source.buffer = buf;
        // connect the AudioBufferSourceNode to the destination so we can hear the sound
        source.connect(context.destination);
        return source;
      };

      music.killStart = () => { // 游戏开始的音乐只播放一次
        music.start = () => {};
      };

      music.start = () => { // 游戏开始
        music.killStart(); // start里的内容只能执行一次
        if (!store.getState().get('music')) {
          return;
        }
        getSource().start(0, 3.7202, 3.6224);
      };

      music.clear = () => { // 消除方块
        if (!store.getState().get('music')) {
          return;
        }
        getSource().start(0, 0, 0.7675);
      };

      music.fall = () => { // 立即下落
        if (!store.getState().get('music')) {
          return;
        }
        getSource().start(0, 1.2558, 0.3546);
      };

      music.gameover = () => { // 游戏结束
        if (!store.getState().get('music')) {
          return;
        }
        getSource().start(0, 8.1276, 1.1437);
      };

      music.rotate = () => { // 旋转
        if (!store.getState().get('music')) {
          return;
        }
        getSource().start(0, 2.2471, 0.0807);
      };

      music.move = () => { // 移动
        if (!store.getState().get('music')) {
          return;
        }
        getSource().start(0, 2.9088, 0.1437);
      };
    },
    (error) => {
      if (window.console && window.console.error) {
        window.console.error(`音频: ${url} 读取错误`, error);
        hasWebAudioAPI.data = false;
      }
    });
  };

  req.send();
})();

module.exports = {
  hasWebAudioAPI,
  music,
};

