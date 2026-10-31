/* /music —— 搜索优先 + 封面 + 卡拉OK + 大屏模式
 *
 * 数据全部走 Worker（workers/netease-api）：
 *   /api/search?q=     搜索
 *   /api/lyric?id=     歌词
 *   /api/url?id=       302 到网易云直链，直接给 <audio src> 用
 *
 * 逐字歌词（klyric）大部分歌没有，所以卡拉OK用「整行扫光」实现：
 * 按当前行到下一行的时间比例填充渐变，视觉上就是歌词跟着唱。
 */
(function () {
  'use strict';

  var API = String(window.MUSIC_API || '').replace(/\/+$/, '');
  var TOKEN = String(window.MUSIC_TOKEN || '');

  function tk() {
    return TOKEN ? '&k=' + encodeURIComponent(TOKEN) : '';
  }

  var $ = function (id) { return document.getElementById(id); };

  var app = $('app');
  var input = $('q');
  var goBtn = $('q-go');
  var clearBtn = $('q-clear');
  var hint = $('hint');
  var results = $('results');
  var meta = $('meta');
  var skeleton = $('skeleton');
  var list = $('list');
  var empty = $('empty');

  var audio = $('audio');
  var player = $('player');
  var pCover = $('p-cover');
  var pTitle = $('p-title');
  var pArtist = $('p-artist');
  var seek = $('seek');
  var vol = $('vol');
  var tCur = $('t-cur');
  var tDur = $('t-dur');

  var stage = $('stage');
  var stageBg = $('stage-bg');
  var lyricsBox = $('lyrics');
  var sCover = $('s-cover');
  var sTitle = $('s-title');
  var sArtist = $('s-artist');
  var sSeek = $('s-seek');
  var sCur = $('s-cur');
  var sDur = $('s-dur');

  var songs = [];
  var current = -1;
  var currentId = null; // 当前音频对应的歌曲 id：列表换了也不会指错
  var rows = [];
  var lines = [];        // [{ t, text }]
  var activeLine = -1;
  var lyricToken = 0;
  var seeking = false;

  /* ------------------------------------------------------------------ 基础 */
  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function fmt(sec) {
    if (!isFinite(sec) || sec < 0) return '00:00';
    return pad(Math.floor(sec / 60)) + ':' + pad(Math.floor(sec % 60));
  }

  function fill(el, ratio) {
    el.style.setProperty('--fill', (Math.max(0, Math.min(1, ratio)) * 100).toFixed(2) + '%');
  }

  var toastEl = null;
  var toastTimer = null;

  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    void toastEl.offsetWidth;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 3200);
  }

  function fail(msg) {
    hint.textContent = msg;
    hint.classList.add('is-error');
  }

  // 地址写错是最常见的问题，开局就拦下来，别等到请求失败
  if (API && !/^https?:\/\//i.test(API)) {
    fail('window.MUSIC_API 必须以 https:// 开头，现在是「' + API + '」');
  }

  /* ------------------------------------------------------------------ 搜索 */
  function setSearching(on) {
    app.classList.toggle('is-searching', on);
    results.hidden = !on;
    if (!on) {
      list.innerHTML = '';
      rows = [];
      songs = [];
    }
  }

  function renderSongs(data) {
    songs = data.songs || [];
    rows = [];
    list.innerHTML = '';
    skeleton.hidden = true;

    meta.textContent = songs.length
      ? '找到 ' + (data.total || songs.length) + ' 首，显示前 ' + songs.length + ' 首' +
        (data.abroad ? '（网易云降级结果）' : '')
      : '';

    empty.hidden = songs.length !== 0;
    // Worker 会带上 reason/hint：区分「网易云降级」和「被限流」，
    // 不要一律显示「没搜到」，那样根本没法排查
    empty.textContent = data.hint || '没搜到，换个关键词试试';

    songs.forEach(function (song, i) {
      var li = document.createElement('li');

      var btn = document.createElement('button');
      btn.className = 'row';
      btn.type = 'button';
      btn.setAttribute('data-i', i);

      var idx = document.createElement('span');
      idx.className = 'row-i';
      idx.textContent = pad(i + 1);

      var cover = document.createElement('img');
      cover.className = 'row-cover';
      cover.alt = '';
      cover.loading = 'lazy';
      if (song.cover) cover.src = song.cover;

      var main = document.createElement('span');
      main.className = 'row-main';
      var title = document.createElement('span');
      title.className = 'row-title';
      title.textContent = song.name || '未知曲目';
      var artist = document.createElement('span');
      artist.className = 'row-artist';
      artist.textContent = song.artists || '未知艺人';
      main.appendChild(title);
      main.appendChild(artist);

      var album = document.createElement('span');
      album.className = 'row-album';
      album.textContent = song.album || '';

      var dur = document.createElement('span');
      dur.className = 'row-dur';
      dur.textContent = song.duration ? fmt(song.duration / 1000) : '—';

      btn.appendChild(idx);
      btn.appendChild(cover);
      btn.appendChild(main);
      btn.appendChild(album);
      btn.appendChild(dur);

      li.appendChild(btn);
      list.appendChild(li);
      rows.push(btn);
    });

    // 列表换了一批，按 id 重新对齐「当前播放」的下标和高亮
    current = indexOfCurrent();
    rows.forEach(function (r, i) {
      r.classList.toggle('is-playing', Boolean(songs[i]) && songs[i].id === currentId);
    });
  }

  function search(kw) {
    if (!API) {
      fail('还没配置 Worker 地址（source/music/index.html 里的 window.MUSIC_API）');
      return;
    }

    kw = (kw || '').trim();
    if (!kw) {
      setSearching(false);
      return;
    }

    hint.classList.remove('is-error');
    hint.textContent = '搜索中…';
    setSearching(true);
    goBtn.disabled = true;
    skeleton.hidden = false;
    empty.hidden = true;
    list.innerHTML = '';
    meta.textContent = '';

    var url = API + '/api/search?q=' + encodeURIComponent(kw) + '&limit=20' + tk();

    fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        goBtn.disabled = false;
        if (data.error) throw new Error(data.error);
        hint.textContent = '回车或点「搜索」';
        renderSongs(data);
      })
      .catch(function (e) {
        goBtn.disabled = false;
        skeleton.hidden = true;
        // 把实际请求的地址也打出来，404 时一眼能看出是哪个域名/路径不对
        fail('搜索失败：' + e.message + ' → ' + url);
        empty.hidden = false;
        empty.textContent = '搜索失败，看上面那行地址对不对';
      });
  }

  /* ------------------------------------------------------------------ 歌词 */
  function parseLrc(text) {
    var out = [];
    var re = /\[(\d{1,2}):(\d{1,2})(?:[.:](\d{1,3}))?\]/g;

    text.split(/\r?\n/).forEach(function (raw) {
      var content = raw.replace(re, '').trim();
      if (!content) return;

      var m;
      re.lastIndex = 0;
      while ((m = re.exec(raw))) {
        var frac = m[3] ? parseInt(m[3].padEnd(2, '0').slice(0, 2), 10) / 100 : 0;
        out.push({ t: parseInt(m[1], 10) * 60 + parseInt(m[2], 10) + frac, text: content });
      }
    });

    out.sort(function (a, b) { return a.t - b.t; });
    return out;
  }

  function renderLyrics(list2) {
    lyricsBox.innerHTML = '';

    if (!list2.length) {
      var p = document.createElement('p');
      p.className = 'lyrics-hint';
      p.textContent = '这首歌没有歌词';
      lyricsBox.appendChild(p);
      lines = [];
      activeLine = -1;
      return;
    }

    list2.forEach(function (line) {
      var el = document.createElement('p');
      el.className = 'line';
      el.textContent = line.text;
      lyricsBox.appendChild(el);
    });

    lines = list2;
    activeLine = -1;
  }

  function loadLyric(id) {
    var token = ++lyricToken;
    lyricsBox.innerHTML = '<p class="lyrics-hint">歌词加载中…</p>';
    lines = [];
    activeLine = -1;

    fetch(API + '/api/lyric?id=' + encodeURIComponent(id) + tk())
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (token !== lyricToken) return;
        if (data.error) throw new Error(data.error);
        renderLyrics(parseLrc(data.lrc || ''));
      })
      .catch(function () {
        if (token !== lyricToken) return;
        lyricsBox.innerHTML = '<p class="lyrics-hint">歌词获取失败</p>';
      });
  }

  /* 歌词跟唱：只切「当前行」，不做逐字填充（网易云给不了逐字时间轴） */
  function syncLyrics() {
    if (!lines.length) return;

    var now = audio.currentTime;
    var idx = -1;

    for (var i = 0; i < lines.length; i += 1) {
      if (lines[i].t <= now + 0.12) idx = i;
      else break;
    }

    if (idx === activeLine) return;

    var nodes = lyricsBox.querySelectorAll('.line');
    for (var j = 0; j < nodes.length; j += 1) {
      nodes[j].classList.toggle('is-active', j === idx);
    }

    if (idx >= 0 && nodes[idx]) {
      var box = lyricsBox;
      box.scrollTo({
        top: nodes[idx].offsetTop - box.clientHeight / 2 + nodes[idx].offsetHeight / 2,
        behavior: 'smooth'
      });
    }

    activeLine = idx;
  }

  /* ------------------------------------------------------------------ 播放 */
  /* ------------------------------------------------------- 随封面动态取色 */
  // 把封面画到小 canvas 上，取主色的色相/彩度（OKLCH），再按 MD3 的
  // tonal palette 生成 primary 系列。和 Material You 一个思路。
  var themeHue = null;
  var themeToken = 0;

  function srgbToLinear(c) {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }

  function linearToSrgb(c) {
    return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  }

  function rgbToOklab(r, g, b) {
    var R = srgbToLinear(r);
    var G = srgbToLinear(g);
    var B = srgbToLinear(b);
    var l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
    var m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
    var s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
    return [
      0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
      1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
      0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
    ];
  }

  function oklabToRgb(L, a, b) {
    var l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    var m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    var s_ = L - 0.0894841775 * a - 1.291485548 * b;
    var l = l_ * l_ * l_;
    var m = m_ * m_ * m_;
    var s = s_ * s_ * s_;
    return [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
    ].map(linearToSrgb);
  }

  function inGamut(rgb) {
    return rgb.every(function (v) { return v >= -0.002 && v <= 1.002; });
  }

  function oklchToHex(L, C, H) {
    var rad = (H * Math.PI) / 180;
    var rgb = oklabToRgb(L, C * Math.cos(rad), C * Math.sin(rad));

    // 超出 sRGB 就二分降彩度，别让颜色被直接裁切
    if (!inGamut(rgb)) {
      var lo = 0;
      var hi = C;
      for (var i = 0; i < 18; i += 1) {
        var mid = (lo + hi) / 2;
        if (inGamut(oklabToRgb(L, mid * Math.cos(rad), mid * Math.sin(rad)))) lo = mid;
        else hi = mid;
      }
      rgb = oklabToRgb(L, lo * Math.cos(rad), lo * Math.sin(rad));
    }

    return (
      '#' +
      rgb
        .map(function (v) {
          var n = Math.round(Math.max(0, Math.min(1, v)) * 255);
          return (n < 16 ? '0' : '') + n.toString(16);
        })
        .join('')
    );
  }

  // CIE L* 的 0-100 档 → OKLab L
  function toneL(t) {
    return Math.pow(t / 100, 0.7385);
  }

  /** 从图片里取一个「有代表性」的色相 */
  function pickHue(img) {
    var S = 32;
    var canvas = document.createElement('canvas');
    canvas.width = S;
    canvas.height = S;

    var ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, S, S);

    var data = ctx.getImageData(0, 0, S, S).data;
    var sx = 0;
    var sy = 0;
    var wsum = 0;
    var csum = 0;

    for (var i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 128) continue;

      var lab = rgbToOklab(data[i] / 255, data[i + 1] / 255, data[i + 2] / 255);
      var C = Math.hypot(lab[1], lab[2]);

      // 太黑、太白、接近灰的像素不参与取色
      if (lab[0] < 0.15 || lab[0] > 0.94) continue;
      if (C < 0.02) continue;

      var H = Math.atan2(lab[2], lab[1]);
      var w = Math.min(C, 0.22); // 彩度越高的像素越主导
      sx += Math.sin(H) * w;
      sy += Math.cos(H) * w;
      wsum += w;
      csum += C * w;
    }

    if (!wsum) return null;

    return {
      h: ((Math.atan2(sx, sy) * 180) / Math.PI + 360) % 360,
      // 封面往往偏灰，提一档彩度并夹在合理区间；下限别太低，
      // 否则暗色主题下算出来的 primary 会接近白色，看着像「没生效」
      c: Math.max(0.065, Math.min(0.16, (csum / wsum) * 1.45))
    };
  }

  // 这些变量会被写到 <html> 上；重置时按同一份清单清掉
  var PALETTE_KEYS = [
    '--primary',
    '--on-primary',
    '--primary-container',
    '--on-primary-container',
    '--surface',
    '--surface-1',
    '--surface-2',
    '--surface-3',
    '--on-surface',
    '--on-surface-2',
    '--outline'
  ];

  function coverPalette(hue, dark) {
    var H = hue.h;
    var C = hue.c;

    // 中性色只带一点点封面色相，这样整页会「偏向」封面但不会变得花
    var N = Math.min(0.02, Math.max(0.005, C * 0.14));

    var accent = function (tone, scale) {
      return oklchToHex(toneL(tone), C * scale, H);
    };
    var neutral = function (tone) {
      return oklchToHex(toneL(tone), N, H);
    };

    if (dark) {
      return {
        '--primary': accent(78, 1),
        '--on-primary': accent(20, 0.7),
        '--primary-container': accent(32, 1),
        '--on-primary-container': accent(92, 1),

        '--surface': neutral(6),
        '--surface-1': neutral(10),
        '--surface-2': neutral(14),
        '--surface-3': neutral(18),
        '--on-surface': neutral(93),
        '--on-surface-2': neutral(76),
        '--outline': neutral(38)
      };
    }

    return {
      '--primary': accent(40, 1),
      '--on-primary': '#FFFFFF',
      '--primary-container': accent(90, 1),
      '--on-primary-container': accent(10, 1),

      '--surface': neutral(97),
      '--surface-1': neutral(95),
      '--surface-2': neutral(92),
      '--surface-3': neutral(89),
      '--on-surface': neutral(13),
      '--on-surface-2': neutral(42),
      '--outline': neutral(80)
    };
  }

  function themeTargets() {
    // 挂在根元素上，整页所有用到 --primary 的地方都跟着封面变
    return [document.documentElement];
  }

  function resetCoverTheme() {
    themeHue = null;
    themeTargets().forEach(function (el) {
      PALETTE_KEYS.forEach(function (k) {
        el.style.removeProperty(k);
      });
    });
  }

  function setCoverTheme() {
    if (!themeHue) return;
    var dark = document.documentElement.getAttribute('data-scheme') === 'dark';
    var vars = coverPalette(themeHue, dark);

    themeTargets().forEach(function (el) {
      Object.keys(vars).forEach(function (k) {
        el.style.setProperty(k, vars[k]);
      });
    });
  }

  function applyCoverTheme(song) {
    var token = ++themeToken;

    if (!song || !song.cover) {
      resetCoverTheme();
      return;
    }

    var img = new Image();
    img.crossOrigin = 'anonymous'; // 封面 CDN 返回 ACAO: *，canvas 才读得到像素

    img.onload = function () {
      if (token !== themeToken) return;
      try {
        var hue = pickHue(img);
        if (!hue) {
          resetCoverTheme();
          return;
        }
        themeHue = hue;
        setCoverTheme();
      } catch (e) {
        // canvas 被污染或图片异常，退回默认配色
        resetCoverTheme();
      }
    };

    img.onerror = function () {
      if (token === themeToken) resetCoverTheme();
    };

    img.src = song.cover;
  }

  function paint(song) {
    pTitle.textContent = song.name || '未知曲目';
    pArtist.textContent = (song.artists || '') + (song.album ? ' · ' + song.album : '');

    pCover.src = song.cover || '';
    pCover.style.visibility = song.cover ? 'visible' : 'hidden';

    sCover.src = song.cover || '';
    sTitle.textContent = song.name || '未知曲目';
    sArtist.textContent = song.artists || '';

    // 大屏背景：拿封面做个高斯模糊铺底
    if (stageBg) {
      if (song.cover) {
        stageBg.style.backgroundImage = 'url("' + song.cover + '")';
        stageBg.classList.add('is-on');
      } else {
        stageBg.style.backgroundImage = '';
        stageBg.classList.remove('is-on');
      }
    }

    player.hidden = false;

    // 按当前封面重算主题色
    applyCoverTheme(song);

    rows.forEach(function (r, i) {
      r.classList.toggle('is-playing', i === current);
    });
  }

  function play(i) {
    var song = songs[i];
    if (!song) return;

    current = i;
    currentId = song.id;
    paint(song);

    audio.src = API + '/api/url?id=' + encodeURIComponent(song.id) + tk();
    audio.load();
    audio.play().catch(function () {});

    seek.value = '0';
    sSeek.value = '0';
    fill(seek, 0);
    fill(sSeek, 0);
    tCur.textContent = '00:00';
    sCur.textContent = '00:00';
    tDur.textContent = song.duration ? fmt(song.duration / 1000) : '00:00';
    sDur.textContent = tDur.textContent;

    // 大屏底部小播放条的存在感：确保角色类跟着走
    document.body.classList.add('is-audio-playing');

    loadLyric(song.id);
  }

  function toggle() {
    // 判断「有没有在放」必须看 id，不能看下标：
    // 换一次搜索结果，同一个下标就指向另一首歌了
    if (currentId == null) {
      if (songs.length) play(0);
      return;
    }
    if (audio.paused) audio.play().catch(function () {});
    else audio.pause();
  }

  function indexOfCurrent() {
    if (currentId == null) return -1;
    for (var i = 0; i < songs.length; i += 1) {
      if (songs[i].id === currentId) return i;
    }
    return -1;
  }

  function step(dir) {
    if (!songs.length) return;
    var idx = indexOfCurrent();
    var next = idx < 0 ? 0 : (idx + dir + songs.length) % songs.length;
    play(next);
  }

  /* ------------------------------------------------------------------ 大屏 */
  function openStage() {
    if (current < 0) {
      toast('先选一首歌');
      return;
    }
    stage.hidden = false;
    requestAnimationFrame(function () { stage.classList.add('is-open'); });
    app.classList.add('is-stage');
    syncLyrics();
  }

  function closeStage() {
    stage.classList.remove('is-open');
    app.classList.remove('is-stage');
    setTimeout(function () {
      if (!stage.classList.contains('is-open')) stage.hidden = true;
    }, 260);
  }

  /* ------------------------------------------------------------------ 事件 */
  // 不自动搜索：打字过程中不发请求，只有回车或点「搜索」按钮才发。
  // 每次搜索都要打网易云接口，随打随搜很容易把这台出口 IP 打上限流。
  function runSearch() {
    if (goBtn.disabled) return;
    input.blur();
    search(input.value);
  }

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      runSearch();
    }
  });

  goBtn.addEventListener('click', runSearch);

  input.addEventListener('input', function () {
    clearBtn.hidden = !input.value;
    // 清空输入框只退回初始状态，不发请求
    if (!input.value.trim()) setSearching(false);
  });

  clearBtn.addEventListener('click', function () {
    input.value = '';
    clearBtn.hidden = true;
    setSearching(false);
    input.focus();
  });

  list.addEventListener('click', function (e) {
    var btn = e.target.closest('.row');
    if (!btn) return;
    var i = Number(btn.getAttribute('data-i'));
    var song = songs[i];
    if (!song) return;
    if (song.id === currentId) toggle();
    else play(i);
  });

  $('play').addEventListener('click', toggle);
  $('prev').addEventListener('click', function () { step(-1); });
  $('next').addEventListener('click', function () { step(1); });
  $('s-play').addEventListener('click', toggle);
  $('s-prev').addEventListener('click', function () { step(-1); });
  $('s-next').addEventListener('click', function () { step(1); });

  $('open-stage').addEventListener('click', openStage);
  $('stage-close').addEventListener('click', closeStage);

  audio.addEventListener('play', function () {
    document.body.classList.add('is-audio-playing');
  });

  audio.addEventListener('pause', function () {
    document.body.classList.remove('is-audio-playing');
  });

  audio.addEventListener('loadedmetadata', function () {
    if (!isFinite(audio.duration)) return;
    var d = fmt(audio.duration);
    tDur.textContent = d;
    sDur.textContent = d;
  });

  audio.addEventListener('timeupdate', function () {
    if (seeking) return;

    var cur = fmt(audio.currentTime);
    tCur.textContent = cur;
    sCur.textContent = cur;

    if (audio.duration) {
      var ratio = audio.currentTime / audio.duration;
      seek.value = String(Math.round(ratio * 1000));
      sSeek.value = seek.value;
      fill(seek, ratio);
      fill(sSeek, ratio);
    }

    syncLyrics();
  });

  audio.addEventListener('ended', function () {
    if (mode === 'one') {
      audio.currentTime = 0;
      audio.play().catch(function () {});
      return;
    }
    // 顺序播放：放到最后一首就停，不绕回开头
    var idx = indexOfCurrent();
    if (idx < 0 || idx >= songs.length - 1) return;
    step(1);
  });

  audio.addEventListener('error', function () {
    if (currentId == null) return;
    toast('这首放不了：可能是 VIP、版权受限或已下架');
  });

  function bindSeek(el) {
    el.addEventListener('input', function () {
      seeking = true;
      if (audio.duration) {
        var r = Number(el.value) / 1000;
        tCur.textContent = fmt(r * audio.duration);
        sCur.textContent = tCur.textContent;
        fill(seek, r);
        fill(sSeek, r);
      }
    });
    el.addEventListener('change', function () {
      if (audio.duration) audio.currentTime = (Number(el.value) / 1000) * audio.duration;
      seeking = false;
    });
  }

  bindSeek(seek);
  bindSeek(sSeek);

  vol.addEventListener('input', function () {
    audio.volume = Number(vol.value) / 100;
    fill(vol, Number(vol.value) / 100);
  });

  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    if (e.key === 'Escape') closeStage();
    else if (e.code === 'Space') { e.preventDefault(); toggle(); }
    else if (e.key === 'ArrowRight' && e.altKey) step(1);
    else if (e.key === 'ArrowLeft' && e.altKey) step(-1);
  });

  /* ---------------------------------------------------------------- 下载 */
  // 音频 CDN 带 ACAO: *，所以可以直接在浏览器里 fetch 成 Blob 再触发下载，
  // 不用让 Worker 转发字节（那样会白白吃流量）。
  var downloading = false;

  function safeName(s) {
    return String(s || '')
      .replace(/[\\/:*?"<>|\r\n]+/g, '_')
      .trim()
      .slice(0, 80);
  }

  function downloadCurrent() {
    var song = songs[indexOfCurrent()];
    if (!song) {
      toast('先选一首歌再下载');
      return;
    }
    if (downloading) {
      toast('正在下载中，稍等');
      return;
    }

    downloading = true;
    toast('正在准备下载…');

    fetch(API + '/api/url?id=' + encodeURIComponent(song.id) + tk())
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        var ct = r.headers.get('content-type') || '';
        if (ct.indexOf('audio') === -1) throw new Error('拿到的不是音频（可能无版权）');
        return r.blob();
      })
      .then(function (blob) {
        var name = safeName((song.artists ? song.artists + ' - ' : '') + (song.name || '未命名')) + '.mp3';
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 10000);
        toast('已开始下载：' + name);
      })
      .catch(function (e) {
        toast('下载失败：' + e.message);
      })
      .then(function () { downloading = false; });
  }

  [$('dl'), $('s-dl')].forEach(function (b) {
    if (b) b.addEventListener('click', downloadCurrent);
  });

  /* 播放模式：order（顺序播放）/ one（单曲循环） */
  var mode = 'order';
  try {
    mode = localStorage.getItem('music-mode') === 'one' ? 'one' : 'order';
  } catch (e) { /* 隐私模式 */ }

  var modeBtns = [$('mode'), $('s-mode')].filter(Boolean);

  function applyMode() {
    modeBtns.forEach(function (b) {
      b.setAttribute('data-mode', mode);
      var label = mode === 'one' ? '单曲循环' : '顺序播放';
      b.setAttribute('aria-label', label);
      b.setAttribute('title', label);
    });
  }

  function toggleMode() {
    mode = mode === 'one' ? 'order' : 'one';
    try { localStorage.setItem('music-mode', mode); } catch (e) {}
    applyMode();
    toast(mode === 'one' ? '单曲循环' : '顺序播放');
  }

  modeBtns.forEach(function (b) {
    b.addEventListener('click', toggleMode);
  });

  /* 主题 */
  $('theme').addEventListener('click', function () {
    var next = document.documentElement.getAttribute('data-scheme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-scheme', next);
    try { localStorage.setItem('music-scheme', next); } catch (e) {}
    // 深浅切换后同样的色相要重新生成对应的色阶
    setCoverTheme();
  });

  /* ------------------------------------------------------------------ 启动 */
  audio.volume = Number(vol.value) / 100;
  fill(vol, 0.8);
  fill(seek, 0);
  fill(sSeek, 0);
  applyMode();

  if (!API) {
    fail('先部署 Worker，再在 source/music/index.html 里填 window.MUSIC_API');
  }
})();
