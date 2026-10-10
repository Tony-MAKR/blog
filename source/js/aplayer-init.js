/* =========================================================
 * 背景音乐播放器初始化（APlayer）
 *
 * 曲目来源：incompetech.com
 * 作者：Kevin MacLeod
 * 许可：Creative Commons BY 3.0
 *      https://creativecommons.org/licenses/by/3.0/
 *
 * 修改曲目：把 mp3 放进 source/audio/ 后，改下面的 playlist 数组。
 * 注意：所有地址都要带 /blog/ 前缀（网站地址里有这一层）。
 * ========================================================= */
(function () {
  'use strict';

  var SCRIPT_URL = '/blog/lib/aplayer/APlayer.min.js';
  var AUDIO_BASE = '/blog/audio/';
  var COVER = '/blog/img/music-cover.svg';
  var INDEX_KEY = 'blog-aplayer-index'; // 记住听到第几首

  /* ---------- 加载 APlayer ----------
   * 说明：页面上若存在 AMD 加载器（代码编辑器组件会引入），
   * APlayer 会把自己注册给加载器而不导出到 window.APlayer，
   * 导致播放器无法初始化。所以加载期间先把 define 临时藏起来。
   */
  function restoreDefine(saved) {
    if (saved) {
      try { window.define = saved; } catch (e) { /* 忽略 */ }
    }
  }

  function loadScript(done) {
    var saved = null;
    try {
      if (window.define && window.define.amd) {
        saved = window.define;
        window.define = undefined;
      }
    } catch (e) { /* 忽略 */ }

    var s = document.createElement('script');
    s.src = SCRIPT_URL;
    s.onload = function () {
      restoreDefine(saved);
      done();
    };
    s.onerror = function () {
      restoreDefine(saved);
    };
    document.body.appendChild(s);
  }

  /* ---------- 创建播放器 ---------- */
  function initPlayer() {
    if (typeof window.APlayer === 'undefined') {
      return; // 加载失败就安静退出，不影响页面其他功能
    }

    // 播放器需要一个专属容器。
    // 注意：不能直接挂到 document.body 上——那样播放器会被排进页面正文流，
    // 跑到所有文章的最末尾，看不到。
    var container = document.createElement('div');
    container.id = 'aplayer-container';
    document.body.appendChild(container);

    // 歌单：作者名会显示在播放器里，同时也是版权署名
    var playlist = [
      {
        name: 'Gymnopedie No. 1',
        artist: 'Kevin MacLeod',
        url: AUDIO_BASE + 'calm-01.mp3',
        cover: COVER
      },
      {
        name: 'Peaceful Desolation',
        artist: 'Kevin MacLeod',
        url: AUDIO_BASE + 'calm-02.mp3',
        cover: COVER
      },
      {
        name: 'Impromptu in Blue',
        artist: 'Kevin MacLeod',
        url: AUDIO_BASE + 'calm-03.mp3',
        cover: COVER
      }
    ];

    var ap = new APlayer({
      container: container, // 专属容器，播放器才能固定在左下角
      fixed: true, // 固定在页面左下角
      mini: true, // 初始收起成小方块，点击展开
      listFolded: true, // 歌单默认折叠
      autoplay: false, // 不自动播放，访客点了才出声
      loop: 'all', // 列表循环
      order: 'list', // 按顺序播放
      preload: 'none', // 点击播放前不下载音乐，省访客流量
      volume: 0.7,
      theme: '#18d1ff', // 与网站主题的青色一致
      lrcType: 0, // 没有歌词文件
      audio: playlist
    });

    // 恢复上次听到第几首（只恢复曲目，不自动播放）
    try {
      var saved = parseInt(window.localStorage.getItem(INDEX_KEY), 10);
      if (!isNaN(saved) && saved >= 0 && saved < ap.list.audios.length) {
        ap.list.switch(saved);
      }
    } catch (e) {
      /* 浏览器禁用了本地存储时忽略 */
    }

    // 切换曲目（含自动播下一首）时记住序号
    ap.on('listswitch', function (data) {
      try {
        window.localStorage.setItem(INDEX_KEY, String(data.index));
      } catch (e) {
        /* 忽略 */
      }
    });
  }

  /* ---------- 启动 ---------- */
  if (typeof window.APlayer !== 'undefined') {
    initPlayer(); // 已经加载过就直接用
  } else {
    loadScript(initPlayer);
  }
})();
