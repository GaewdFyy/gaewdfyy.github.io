(function () {
  var CANVAS_ID = 'live2d';
  var STORAGE_KEY_POS = 'live2d-widget-pos';
  var STORAGE_KEY_CHARACTER = 'live2d-widget-character';
  var STORAGE_KEY_OUTFIT = 'live2d-widget-outfit';
  // 模型仓库按运行时版本分目录：v2/ 走 2.x 运行时（loadlive2d），
  // v3/ 是 Cubism 3 模型，由仓库自带的示例页在 iframe 里渲染。
  var MODEL_BASE_V2 = 'https://cdn.jsdelivr.net/gh/gaewdfyy/live2d/v2/model/';
  /** v3 模型本体所在目录（查看器页内部按相对路径取它，这里只用于排障输出） */
  var V3_MODEL_BASE = 'https://cdn.jsdelivr.net/gh/gaewdfyy/live2d/v3/model/';
  /**
   * v3 查看器的候选地址，按顺序尝试，取不到会自动换下一个源。
   * 说明：
   *   1) /v3-index.html 是本博客自带的宿主页（source/v3-index.html），它只做两件事：
   *      iframe 页面本身由本站同域提供（能正常渲染），运行时脚本从 jsDelivr 取
   *      （那里响应类型正确）。这条最稳，推荐优先用；
   *   2) 若你把仓库的 v3 目录整个拷到了 source/v3/ 下，/v3/index.html 也可用；
   *   3) jsDelivr 直接挂 iframe 有坑：它对未缓存文件会 302 跳到
   *      raw.githubusercontent.com，而 raw 给 HTML 发 text/plain + nosniff，
   *      结果浏览器把网页源码当纯文本显示（就是"选迪莫显示 HTML 内容"的现象）。
   *      代码里已按 Content-Type 过滤掉这类响应，但仍不建议把它当首选。
   * 查看器内部用相对路径取 js/css/model，所以整页放在哪里，资源就跟着从哪里取。
   * 注意不要给地址加查询串，否则相对路径的基准会变。
   */
  var V3_VIEWER_CANDIDATES = [
    '/v3-index.html',
    '/v3/index.html',
    'https://cdn.jsdelivr.net/gh/gaewdfyy/live2d@master/v3/index.html'
  ];

  // 可选角色（人物）。
  // runtime: 'v2'（默认）| 'v3'，决定用哪个运行时渲染。
  // file 为该角色的默认模型描述文件（相对对应版本的 MODEL_BASE）。
  // outfits 为该角色可换的装扮；切换角色时会套用所选装扮的模型文件。
  var CHARACTERS = [
    {
      label: '22',
      runtime: 'v2',
      file: '22/model.default.json',
      outfits: [
        { file: '22/model.default.json', label: '默认装' },
        { file: '22/model.2016.xmas.1.json', label: '2016 圣诞装 1' },
        { file: '22/model.2016.xmas.2.json', label: '2016 圣诞装 2' },
        { file: '22/model.2017.newyear.json', label: '2017 新年装' },
        { file: '22/model.2017.school.json', label: '2017 校服' },
        { file: '22/model.2017.cba-normal.json', label: '2017 CBA 篮球服（普通）' },
        { file: '22/model.2017.cba-super.json', label: '2017 CBA 篮球服（高级）' },
        { file: '22/model.2017.summer.normal.1.json', label: '2017 夏装（普通）1' },
        { file: '22/model.2017.summer.normal.2.json', label: '2017 夏装（普通）2' },
        { file: '22/model.2017.summer.super.1.json', label: '2017 夏装（高级）1' },
        { file: '22/model.2017.summer.super.2.json', label: '2017 夏装（高级）2' },
        { file: '22/model.2017.tomo-bukatsu.high.json', label: '2017 社团服（高中）' },
        { file: '22/model.2017.tomo-bukatsu.low.json', label: '2017 社团服（初中）' },
        { file: '22/model.2017.valley.json', label: '2017 valley' },
        { file: '22/model.2017.vdays.json', label: '2017 情人节装' },
        { file: '22/model.2018.bls-summer.json', label: '2018 bls 夏装' },
        { file: '22/model.2018.bls-winter.json', label: '2018 bls 冬装' },
        { file: '22/model.2018.lover.json', label: '2018 情侣装' },
        { file: '22/model.2018.spring.json', label: '2018 春装' }
      ]
    },
    { label: '八重樱·鸣狐', runtime: 'v2', file: 'fox/model.json' },
    { label: '初音未来', runtime: 'v2', file: 'miku/miku.model.json' },
    { label: '雫', runtime: 'v2', file: 'shizuku/shizuku.model.json' }
  ];
  CHARACTERS.forEach(function (character) {
    if (!character.runtime) character.runtime = 'v2';
    if (!character.outfits || !character.outfits.length) {
      character.outfits = [{ file: character.file, label: '默认装' }];
    }
  });

  var state = {
    characterIndex: 0,
    outfitIndex: 0,
    /** 面板视图：'character' 角色列表 | 'outfit' 当前角色的装扮列表 */
    panelMode: 'character',
    initializing: false,
    dragging: false,
    moved: false,
    root: null,
    canvas: null,
    bubble: null,
    panel: null,
    panelTitle: null,
    panelList: null,
    panelBack: null,
    frame: null,
    frameFile: null,
    /** v3（iframe 查看器）当前是否激活；切回 v2 角色时置 false 并停掉整条探测链 */
    v3Active: false,
    /** 当前使用的 v3 查看器候选下标 */
    viewerIndex: 0,
    /** 已经尝试过的 v3 查看器地址，防止同一个页面被反复重载 */
    viewerTried: {},
    /** 当前候选的 iframe 是否已加载完成 */
    viewerReady: false,
    /** 加载失败并被移出列表的角色下标（本次会话内不再显示，避免每次刷新都白等一轮） */
    blockedCharacters: [],
    probeTimer: null,
    /** v3 探测用的 fetch 控制器，切走时 abort 掉，避免留下挂起的请求 */
    probeAbort: null,
    bubbleTimer: null,
    loadTimer: null,
    /** 每次加载模型自增，用于丢弃已被取代的加载看门狗 */
    loadGeneration: 0
  };

  // ---------------- 工具函数 ----------------
  function getManager() {
    return typeof window.live2dGetManager === 'function' ? window.live2dGetManager() : null;
  }
  function getModel() {
    var m = getManager();
    return m ? m.getModel(0) : null;
  }
  function el(tag, className, html) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function currentCharacter() {
    return CHARACTERS[state.characterIndex] || CHARACTERS[0];
  }
  function safeStorageGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  /**
   * 排障日志。默认关闭：在控制台执行 localStorage.setItem('nc-live2d-debug','1')
   * 后刷新页面，或直接在控制台调用 live2dDebug() 查看当前状态与最近日志。
   */
  function log() {
    var args = Array.prototype.slice.call(arguments);
    if (safeStorageGet('nc-live2d-debug') === '1') {
      try { console.log.apply(console, ['[live2d]'].concat(args)); } catch (e) {}
    }
    log.records.push(args);
    if (log.records.length > 50) log.records.shift();
  }
  log.records = [];
  function debugSnapshot() {
    var character = currentCharacter();
    var v3 = null;
    for (var i = 0; i < CHARACTERS.length; i++) {
      if (CHARACTERS[i].runtime === 'v3') {
        v3 = CHARACTERS[i];
        break;
      }
    }
    return {
      characterIndex: state.characterIndex,
      character: character.label,
      runtime: character.runtime,
      outfitIndex: state.outfitIndex,
      outfitCount: character.outfits.length,
      panelMode: state.panelMode,
      panelHidden: state.panel ? state.panel.hidden : null,
      viewerIndex: state.viewerIndex,
      viewerReady: state.viewerReady,
      frameSrc: state.frame ? state.frame.getAttribute('src') : null,
      v3ModelUrl: v3 ? V3_MODEL_BASE + v3.outfits[0].file : null,
      candidates: V3_VIEWER_CANDIDATES,
      recent: log.records.slice(-12)
    };
  }
  function safeStorageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }
  function showBubble(text, duration) {
    if (!state.bubble) return;
    state.bubble.textContent = text;
    state.bubble.hidden = false;
    clearTimeout(state.bubbleTimer);
    state.bubbleTimer = setTimeout(function () {
      state.bubble.hidden = true;
    }, duration || 2200);
  }
  function closePanels() {
    if (state.panel) state.panel.hidden = true;
  }

  /**
   * 给面板选边：默认贴在模型右侧，但要避开右侧那列圆形按钮，
   * 并且在窗口变窄时翻到模型左侧，绝不让面板压住按钮或跑出屏幕。
   */
  function repositionPanel() {
    var panel = state.panel;
    var root = state.root;
    if (!panel || !root) return;

    var GAP = 42;    // 与按钮列的间距（按钮位于容器外约 26px 处）
    var EDGE = 12;   // 距离视口边缘的最小留白
    var measure = !panel.hidden;
    var wasHidden = panel.hidden;
    // 面板隐藏时量不到宽度，临时显形一帧（同步完成，不会闪屏）。
    if (wasHidden) panel.hidden = false;

    var prevWidth = panel.style.maxWidth;
    var rect = root.getBoundingClientRect();
    var roomRight = window.innerWidth - rect.right;
    var roomLeft = rect.left;

    panel.classList.remove('nc-live2d-panel-left', 'nc-live2d-panel-right');
    panel.style.maxWidth = Math.max(110, Math.min(220, Math.round(roomRight - GAP - EDGE))) + 'px';
    panel.style.width = '';

    var width = panel.offsetWidth || 0;
    var availLeft = roomLeft - GAP - EDGE;

    if (roomRight - GAP - EDGE >= 110 || width <= roomRight - GAP - EDGE) {
      panel.classList.add('nc-live2d-panel-right');
    } else if (availLeft >= 110) {
      panel.classList.add('nc-live2d-panel-left');
      if (width > availLeft) panel.style.maxWidth = Math.round(availLeft) + 'px';
    } else {
      // 两侧都放不宽：贴着较宽的一侧，宁可变窄也不压住按钮列。
      panel.classList.add(roomRight >= roomLeft ? 'nc-live2d-panel-right' : 'nc-live2d-panel-left');
      panel.style.maxWidth = Math.max(72, Math.round(Math.max(availLeft, roomRight - GAP - EDGE))) + 'px';
    }

    // 垂直方向从容器上沿向下展开，高度受视口底部限制。
    var height = Math.round(window.innerHeight - rect.top - 16);
    panel.style.maxHeight = Math.max(120, Math.min(340, height)) + 'px';

    if (wasHidden) panel.hidden = true;
    if (!measure) panel.style.maxWidth = prevWidth;
  }

  // ---------------- 暗色主题联动 ----------------
  function syncTheme() {
    var isDark = document.documentElement.getAttribute('data-user-color-scheme') === 'dark';
    state.root.classList.toggle('nc-live2d-theme-dark', isDark);
  }
  function initTheme() {
    syncTheme();
    var observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-user-color-scheme'] });
  }

  // ---------------- 拖拽 ----------------
  function initDrag() {
    var root = state.root;
    var startX, startY, originLeft, originTop;

    function clamp() {
      var rect = root.getBoundingClientRect();
      var maxLeft = Math.max(0, window.innerWidth - rect.width);
      var maxTop = Math.max(0, window.innerHeight - rect.height);
      var left = Math.min(Math.max(0, parseFloat(root.style.left) || 0), maxLeft);
      var top = Math.min(Math.max(0, parseFloat(root.style.top) || 0), maxTop);
      root.style.left = left + 'px';
      root.style.top = top + 'px';
    }

    function toTopLeft() {
      var rect = root.getBoundingClientRect();
      root.style.left = rect.left + 'px';
      root.style.top = rect.top + 'px';
      root.style.right = 'auto';
      root.style.bottom = 'auto';
    }
    toTopLeft();

    try {
      var saved = JSON.parse(safeStorageGet(STORAGE_KEY_POS) || 'null');
      if (saved && typeof saved.left === 'number' && typeof saved.top === 'number') {
        root.style.left = saved.left + 'px';
        root.style.top = saved.top + 'px';
        clamp();
      }
    } catch (e) {}

    root.addEventListener('pointerdown', function (e) {
      if (e.target.closest && e.target.closest('.nc-live2d-controls, .nc-live2d-panel')) return;
      state.dragging = true;
      state.moved = false;
      startX = e.clientX;
      startY = e.clientY;
      originLeft = parseFloat(root.style.left) || 0;
      originTop = parseFloat(root.style.top) || 0;
      try { root.setPointerCapture(e.pointerId); } catch (err) {}
    });

    root.addEventListener('pointermove', function (e) {
      if (!state.dragging) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      if (!state.moved && Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
      state.moved = true;
      root.classList.add('nc-live2d-dragging');
      document.body.classList.add('nc-live2d-page-dragging');
      root.style.left = originLeft + dx + 'px';
      root.style.top = originTop + dy + 'px';
    });

    function endDrag() {
      if (!state.dragging) return;
      state.dragging = false;
      root.classList.remove('nc-live2d-dragging');
      document.body.classList.remove('nc-live2d-page-dragging');
      if (state.moved) {
        root.classList.add('nc-live2d-returning');
        clamp();
        setTimeout(function () { root.classList.remove('nc-live2d-returning'); }, 260);
        safeStorageSet(STORAGE_KEY_POS, JSON.stringify({
          left: parseFloat(root.style.left),
          top: parseFloat(root.style.top)
        }));
      } else {
        root.classList.toggle('nc-live2d-controls-open');
      }
    }
    root.addEventListener('pointerup', endDrag);
    root.addEventListener('pointercancel', endDrag);
    window.addEventListener('resize', clamp);
  }

  // ---------------- 模型加载 ----------------
  /**
   * 加载模型。
   * v2 走 loadlive2d（同页热切换）；v3 由仓库自带的 Cubism 3 示例页在 iframe 内渲染。
   * revertFile 不为空时启动看门狗：8 秒后若没有出现新模型，
   * 说明该模型加载失败，自动回滚到 revertFile 对应的角色/装扮。
   */
  function loadModel(file, runtime, revertFile) {
    if (runtime === 'v3') {
      loadV3Model(file);
      return;
    }
    if (typeof window.loadlive2d !== 'function') return;

    showCanvas();
    var previousModel = getModel();

    clearTimeout(state.loadTimer);
    state.loadGeneration++;

    // 释放上一个角色的贴图，避免反复切换角色时显存持续增长。
    if (previousModel && !state.initializing) {
      try {
        var old = previousModel.live2DModel;
        if (old && typeof old.releaseTextures === 'function') old.releaseTextures();
      } catch (e) {}
    }

    window.loadlive2d(CANVAS_ID, MODEL_BASE_V2 + file);

    if (revertFile && revertFile !== file) {
      var generation = state.loadGeneration;
      state.loadTimer = setTimeout(function () {
        // 期间又切换过模型，说明这次加载已经被取代，不再判定失败。
        if (generation !== state.loadGeneration) return;
        if (getModel() === previousModel) revertSelection(revertFile);
      }, 8000);
    }
  }

  /**
   * v3 模型：由仓库里的 v3 查看器页在 iframe 内渲染（该页固定演示 v3/model/Dimo），
   * 所以这里只负责把查看器挂到 iframe 上；file 仅用于记录当前选择。
   * 页内脚本用相对路径取 js/css/model，查看器放在哪里，资源就从哪里取。
   */
  function loadV3Model(file) {
    clearTimeout(state.loadTimer);
    state.loadGeneration++;
    // 标记 v3 链条已激活；poll 循环与探测请求都以这个开关为前提
    state.v3Active = true;
    showFrame();

    if (state.frameFile !== file) {
      state.frameFile = file;
      state.viewerIndex = 0;
      state.viewerTried = {};
      probeViewer(0);
    } else if (state.viewerReady) {
      // 已经是同一个 v3 模型且加载成功，无需重新加载。
      return;
    } else {
      probeViewer(state.viewerIndex);
    }
  }

  /**
   * 把当前角色标记为不可用：从列表里移除、切回第一个角色。
   * 只在本次会话内生效，刷新页面后会重新出现（源修好后无需改代码即可恢复）。
   */
  function blockCurrentCharacter(message) {
    var index = state.characterIndex;
    if (state.blockedCharacters.indexOf(index) === -1) state.blockedCharacters.push(index);
    log('角色加载失败，已移出列表', index, currentCharacter().label);

    // 让位置继续指向同一个角色，但清掉存储，避免下次刷新又选中它。
    safeStorageSet(STORAGE_KEY_CHARACTER, '0');
    safeStorageSet(STORAGE_KEY_OUTFIT, '0');
    state.frameFile = null;

    var fallback = CHARACTERS[0];
    var fallbackIndex = 0;
    for (var i = 0; i < CHARACTERS.length; i++) {
      if (state.blockedCharacters.indexOf(i) === -1) { fallback = CHARACTERS[i]; fallbackIndex = i; break; }
    }
    state.characterIndex = fallbackIndex;
    state.outfitIndex = 0;
    loadModel(fallback.outfits[0].file, fallback.runtime, null);
    showBubble(message || '这个角色暂时加载不了', 3000);
    renderCharacters();
  }

  /**
   * 停止整条 v3 探测链：清掉定时器、中断挂起的 fetch、把 iframe 复位。
   * 切回 v2 角色、或把加载失败的 v3 角色移出列表时必须调用，
   * 否则后台会继续反复请求已经不需要的查看器地址。
   */
  function stopV3() {
    state.v3Active = false;
    state.frameFile = null;
    state.viewerReady = false;
    clearTimeout(state.probeTimer);
    state.probeTimer = null;
    if (state.probeAbort) {
      try { state.probeAbort.abort(); } catch (e) {}
      state.probeAbort = null;
    }
  }

  /** 载入当前候选的 v3 查看器页。 */
  function loadViewerCandidate() {
    if (!state.v3Active) return;
    var src = V3_VIEWER_CANDIDATES[state.viewerIndex];
    if (!src) {
      // 所有源都取不到 v3 查看器：把该角色移出列表，避免每次刷新都空等一轮。
      // 排查办法：控制台执行 live2dTest()，看哪条地址能返回 text/html。
      log('所有 v3 查看器候选都不可用', JSON.stringify(V3_VIEWER_CANDIDATES));
      stopV3();
      blockCurrentCharacter('这个模型暂时加载不了，已从角色列表中移除');
      return;
    }
    clearTimeout(state.probeTimer);
    state.viewerReady = false;
    state.frame.setAttribute('src', src);
    // 记录已尝试过的地址：同一地址只试一次，避免"同源但画不出 canvas"导致同一个页面被反复重载
    state.viewerTried[src] = true;
    log('挂载 v3 查看器页', src);

    var generation = state.loadGeneration;
    // 载入后若迟迟没有真正渲染，就换下一个源。
    state.probeTimer = setTimeout(function () {
      if (!state.v3Active) return;
      if (generation !== state.loadGeneration) return;
      if (state.viewerReady) return;
      if (state.frame.getAttribute('src') !== src) return;
      log('v3 查看器页超时未渲染，换下一个源', src);
      nextViewerCandidate();
    }, 20000);
  }

  /** 前进到下一个尚未尝试过的候选地址。 */
  function nextViewerCandidate() {
    if (!state.v3Active) return;
    var next = state.viewerIndex + 1;
    while (next < V3_VIEWER_CANDIDATES.length && state.viewerTried[V3_VIEWER_CANDIDATES[next]]) next++;
    state.viewerIndex = next;
    loadViewerCandidate();
  }

  /**
   * 决定用哪个候选地址挂 iframe。
   * 探测结果分三种：
   *   'ok'      明确取到了内容；
   *   'absent'  明确 404（例如 jsDelivr 索引未更新返回 404）；
   *   'unknown' 探不出来（跨域/CORS/超时）——这种情况一律当作可用，
   *             否则可达的源会被误判掉（CDN 对未缓存文件会 302 到 raw，
   *             raw 给 HTML 发 text/plain + nosniff，任何探活都会失败）。
   * 只跳过 'absent'，取第一个非 absent 的源。
   */
  function probeViewer(index) {
    if (!state.v3Active) return;
    var src = V3_VIEWER_CANDIDATES[index];
    if (!src) {
      // 没有更多候选了：把该角色移出列表，避免每次刷新都空等一轮。
      log('没有可用的 v3 查看器候选', JSON.stringify(V3_VIEWER_CANDIDATES));
      stopV3();
      blockCurrentCharacter('这个模型暂时加载不了，已从角色列表中移除');
      return;
    }

    var settled = false;
    function next(state_) {
      if (settled) return;
      settled = true;
      if (!state.v3Active) return;
      log('probe', src, state_);
      if (state_ === 'absent') {
        // 该地址明确不存在，前进到下一个未尝试过的候选
        var nextIndex = index + 1;
        while (nextIndex < V3_VIEWER_CANDIDATES.length && state.viewerTried[V3_VIEWER_CANDIDATES[nextIndex]]) nextIndex++;
        probeViewer(nextIndex);
      } else {
        state.viewerIndex = index;
        loadViewerCandidate();
      }
    }

    var timer = setTimeout(function () { next('unknown'); }, 6000);
    function done(state_) {
      clearTimeout(timer);
      state.probeAbort = null; // 请求已落地，不再需要中断
      next(state_);
    }

    // 记下控制器：切回 v2 角色时 stopV3() 会 abort 掉这个还没回来的请求
    try { state.probeAbort = new AbortController(); } catch (e) { state.probeAbort = null; }

    try {
      fetch(src, { method: 'GET', cache: 'no-store', signal: state.probeAbort ? state.probeAbort.signal : undefined })
        .then(function (res) {
          if (res.status === 404 || res.status === 403) {
            done('absent');
            return;
          }
          if (!res.ok) {
            done('unknown'); // 例如 5xx，不代表文件不存在
            return;
          }
          return res.text().then(function (text) {
            // 有的 CDN 会用 200 返回"找不到文件"的提示页，按内容再确认一次。
            if (/couldn't find the requested file|cannot find module/i.test(text.slice(0, 400))) {
              done('absent');
              return;
            }
            /*
             * 关键检查：CDN 有时会把 HTML 当纯文本下发（例如 jsDelivr 302 跳到
             * raw.githubusercontent.com，后者给 HTML 发 text/plain + nosniff），
             * 这种响应塞进 iframe 只会把网页源码当文字显示出来。
             * 所以这里要求确实是 HTML 类型，否则跳过该源。
             */
            var type = (res.headers.get('content-type') || '').toLowerCase();
            done(type.indexOf('html') > -1 ? 'ok' : 'absent');
          });
        })
        .catch(function (err) {
          // abort 是我们主动取消的，不算探测结果
          if (err && err.name === 'AbortError') return;
          // 跨域拿不到响应，说明不了文件是否存在 —— 交给 iframe 自己去取。
          done('unknown');
        });
    } catch (e) {
      done('unknown');
    }
  }

  /**
   * 判断 iframe 里是不是"明确的失败页"：同源却没有 canvas。
   * 仅用于同源场景（例如用户把仓库也部署在同域），跨域时返回 false。
   */
  function catastrophicFailure() {
    var doc;
    try {
      doc = state.frame.contentDocument;
    } catch (e) {
      return false;
    }
    if (!doc) return false;
    return !doc.querySelector('canvas');
  }

  /** 示例页 load 之后轮询，确认它真的渲染出了 canvas。 */
  function detectViewer() {
    var generation = state.loadGeneration;
    var src = state.frame.getAttribute('src');

    (function poll(attempt) {
      // 已经切回 v2 角色（或该角色被移出列表）时立刻停止轮询
      if (!state.v3Active) return;
      if (generation !== state.loadGeneration) return;
      if (state.frame.getAttribute('src') !== src) return;

      var doc = null;
      try { doc = state.frame.contentDocument; } catch (e) { doc = null; }
      if (!doc) {
        // 跨域没法进一步确认，视为已经正常渲染。
        state.viewerReady = true;
        log('v3 示例页已加载（跨域，无法进一步确认渲染）', src);
        return;
      }
      if (doc.querySelector('canvas')) {
        state.viewerReady = true;
        log('v3 示例页渲染出 canvas', src);
        return;
      }
      if (catastrophicFailure() && attempt >= 3) {
        // 同源、等了一会儿仍然没有 canvas：判定这个源不行，换下一个。
        // 用 nextViewerCandidate() 而不是直接 +1，避免把同一个地址又挂一次。
        log('同源但没有 canvas，判定该源失败', src);
        nextViewerCandidate();
        return;
      }
      // 示例页要先下载几百 KB 脚本才会生成 canvas，继续等。
      if (attempt < 12) setTimeout(function () { poll(attempt + 1); }, 1500);
    })(0);
  }

  function showCanvas() {
    // 切回 2.x 画布时，把 v3 那条探测链彻底停掉，避免它在后台继续请求；
    // 仅在 iframe 真的挂过页面时才复位 src，免得初次启动多出一条 about:blank 记录。
    if (state.v3Active) {
      var hadSrc = state.frame && state.frame.getAttribute('src');
      stopV3();
      if (hadSrc) state.frame.setAttribute('src', 'about:blank');
    }
    if (state.canvas) state.canvas.style.display = '';
    if (state.frame) state.frame.style.display = 'none';
    if (state.root) state.root.classList.remove('nc-live2d-mode-v3');
  }

  function showFrame() {
    if (state.canvas) state.canvas.style.display = 'none';
    if (state.frame) state.frame.style.display = 'block';
    // v3（Cubism 3）模型由示例页自己排版，加个类名方便单独调整尺寸。
    if (state.root) state.root.classList.add('nc-live2d-mode-v3');
  }

  /** 加载失败时回滚到指定模型文件对应的角色/装扮。 */
  function revertSelection(file) {
    var characterIndex = -1;
    var outfitIndex = 0;
    for (var i = 0; i < CHARACTERS.length && characterIndex === -1; i++) {
      for (var j = 0; j < CHARACTERS[i].outfits.length; j++) {
        if (CHARACTERS[i].outfits[j].file === file) {
          characterIndex = i;
          outfitIndex = j;
          break;
        }
      }
    }
    if (characterIndex === -1) return;

    var character = CHARACTERS[characterIndex];
    state.characterIndex = characterIndex;
    state.outfitIndex = outfitIndex;
    persistSelection();
    loadModel(file, character.runtime, null);
    showBubble('这个角色加载失败了，已切回上一个', 2600);
    refreshPanel();
  }

  function persistSelection() {
    safeStorageSet(STORAGE_KEY_CHARACTER, String(state.characterIndex));
    safeStorageSet(STORAGE_KEY_OUTFIT, String(state.outfitIndex));
  }

  // ---------------- 切换角色 / 装扮 ----------------
  /**
   * @param {number} index 角色下标
   * @param {number} outfitIndex 装扮下标
   * @param {boolean} silent 启动时静默加载，不弹气泡
   * @param {boolean} openOutfits 切换后是否直接展开该角色的装扮列表（换装已并入角色面板）
   */
  function switchCharacter(index, outfitIndex, silent, openOutfits) {
    var character = CHARACTERS[index];
    if (!character) return;

    var nextOutfit = (typeof outfitIndex === 'number' && character.outfits[outfitIndex]) ? outfitIndex : 0;
    var outfit = character.outfits[nextOutfit];
    var previousCharacter = currentCharacter();
    var previousOutfit = previousCharacter.outfits[state.outfitIndex];
    var previousFile = previousOutfit ? previousOutfit.file : null;
    var sameSelection = index === state.characterIndex && nextOutfit === state.outfitIndex;
    var isInitialLoad = state.initializing && sameSelection;

    state.characterIndex = index;
    state.outfitIndex = nextOutfit;
    persistSelection();

    // 上次保存的角色加载失败时，退回默认角色，避免看板娘一直空着。
    var revertFile = null;
    if (!silent && !sameSelection) revertFile = previousFile;
    else if (isInitialLoad && outfit.file !== CHARACTERS[0].outfits[0].file) revertFile = CHARACTERS[0].outfits[0].file;
    loadModel(outfit.file, character.runtime, revertFile);

    if (!silent) {
      var label = character.label === outfit.label ? character.label : character.label + ' · ' + outfit.label;
      showBubble('正在切换：' + label, 2600);
    }

    if (openOutfits && character.outfits.length > 1) {
      renderOutfits();
    } else {
      refreshPanel();
    }
  }

  function switchOutfit(index) {
    var character = currentCharacter();
    if (!character.outfits[index]) return;

    // 点击当前装扮时不做任何处理，避免重复加载模型。
    if (index === state.outfitIndex) return;

    state.outfitIndex = index;
    persistSelection();
    loadModel(character.outfits[index].file, character.runtime, character.outfits[0].file);
    showBubble('正在换装：' + character.outfits[index].label, 2600);
    refreshPanel();
  }

  // ---------------- 面板（角色列表 → 该角色的装扮列表） ----------------
  function buildPanel() {
    var panel = el('div', 'nc-live2d-panel');
    panel.hidden = true;

    var header = el('div', 'nc-live2d-panel-header');
    var back = el('button', 'nc-live2d-panel-back', '←');
    back.type = 'button';
    back.title = '返回角色列表';
    back.hidden = true;
    back.addEventListener('click', function () { renderCharacters(); });

    var title = el('div', 'nc-live2d-panel-title');
    header.appendChild(back);
    header.appendChild(title);

    var list = el('div', 'nc-live2d-panel-list');
    panel.appendChild(header);
    panel.appendChild(list);
    state.root.appendChild(panel);

    state.panel = panel;
    state.panelBack = back;
    state.panelTitle = title;
    state.panelList = list;

    // 窗口尺寸变化时重新选边，避免面板压住按钮列或跑出视口。
    window.addEventListener('resize', function () {
      if (!panel.hidden) repositionPanel();
    });
  }

  function panelItem(label, isActive, onClick) {
    var item = el('button', 'nc-live2d-panel-item', label);
    item.type = 'button';
    if (isActive) item.classList.add('nc-live2d-panel-item-active');
    item.addEventListener('click', onClick);
    return item;
  }

  function renderCharacters() {
    state.panelMode = 'character';
    state.panelBack.hidden = true;
    state.panelTitle.textContent = '选择角色';
    state.panelList.innerHTML = '';
    log('渲染角色列表', CHARACTERS.length, '个角色，已屏蔽', state.blockedCharacters.length, '个');
    CHARACTERS.forEach(function (character, index) {
      if (state.blockedCharacters.indexOf(index) > -1) return;
      var isActive = index === state.characterIndex;
      var suffix = character.outfits.length > 1 ? '（' + character.outfits.length + ' 套装扮）' : '';
      state.panelList.appendChild(panelItem(character.label + suffix, isActive, function () {
        log('点击角色', index, character.label, 'outfits=', character.outfits.length, 'current=', state.characterIndex);
        if (index === state.characterIndex && character.outfits.length > 1) {
          // 已经是该角色：直接展开它的装扮列表。
          renderOutfits();
          return;
        }
        // 换角色后，若该角色有装扮就顺势展开装扮列表（换装已并入这里）。
        switchCharacter(index, 0, false, character.outfits.length > 1);
      }));
    });
  }

  function renderOutfits() {
    var character = currentCharacter();
    state.panelMode = 'outfit';
    state.panelBack.hidden = false;
    state.panelTitle.textContent = character.label + ' 的装扮';
    state.panelList.innerHTML = '';
    log('渲染装扮列表', character.label, character.outfits.length, '套');
    character.outfits.forEach(function (outfit, index) {
      state.panelList.appendChild(panelItem(outfit.label, index === state.outfitIndex, function () {
        switchOutfit(index);
      }));
    });
  }

  function refreshPanel() {
    if (!state.panel || state.panel.hidden) return;
    if (state.panelMode === 'outfit') renderOutfits();
    else renderCharacters();
    repositionPanel();
  }

  function togglePanel() {
    var panel = state.panel;
    if (!panel) return;
    // 再次点击按钮时收起面板。
    if (!panel.hidden) {
      panel.hidden = true;
      return;
    }
    renderCharacters();
    panel.hidden = false;
    panel.scrollTop = 0;
    repositionPanel();
  }

  // ---------------- 工具栏 ----------------
  function buildControls() {
    var controls = el(
      'div',
      'nc-live2d-controls',
      '<button class="nc-live2d-icon" type="button" data-action="motion" title="随机动作">' +
        '<svg viewBox="0 0 24 24" class="nc-live2d-icon-svg"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>' +
      '</button>' +

      '<button class="nc-live2d-icon" type="button" data-action="character" title="角色 / 换装">' +
        '<svg viewBox="0 0 24 24" class="nc-live2d-icon-svg"><circle cx="9" cy="7" r="4"/><path d="M17 11v6M14 14h6"/><path d="M2.5 21a6.5 6.5 0 0 1 13 0"/></svg>' +
      '</button>' +

      '<button class="nc-live2d-icon" type="button" data-action="theme" title="切换主题">' +
        '<svg viewBox="0 0 24 24" class="nc-live2d-icon-svg nc-live2d-theme-icon-sun"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>' +
        '<svg viewBox="0 0 24 24" class="nc-live2d-icon-svg nc-live2d-theme-icon-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' +
      '</button>' +

      '<button class="nc-live2d-icon" type="button" data-action="close" title="关闭">' +
        '<svg viewBox="0 0 24 24" class="nc-live2d-icon-svg"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
      '</button>'
    );

    controls.addEventListener('pointerdown', function (e) { e.stopPropagation(); });

    controls.querySelector('[data-action="motion"]').addEventListener('click', function () {
      var model = getModel();
      if (!model) return;
      var motions = model.modelSetting && model.modelSetting.json && model.modelSetting.json.motions;
      // 过滤掉空字符串分组（部分模型用 "" 作为分组名，直接调用会报错）。
      var groups = motions ? Object.keys(motions).filter(function (name) {
        return name && motions[name] && motions[name].length;
      }) : [];
      if (!groups.length) return;
      var group = groups[Math.floor(Math.random() * groups.length)];
      model.startRandomMotion(group, 3);
    });

    controls.querySelector('[data-action="character"]').addEventListener('click', function () {
      togglePanel();
    });

    controls.querySelector('[data-action="theme"]').addEventListener('click', function () {
      var rootEl = document.documentElement;
      var isDark = rootEl.getAttribute('data-user-color-scheme') === 'dark';
      rootEl.setAttribute('data-user-color-scheme', isDark ? 'light' : 'dark');
    });

    controls.querySelector('[data-action="close"]').addEventListener('click', function () {
      state.root.hidden = true;
      document.getElementById('live2d-reopen').style.display = 'block';
    });

    state.root.appendChild(controls);
  }

  function initReopenButton() {
    var btn = el('button', null, '🥰');
    btn.id = 'live2d-reopen';
    btn.title = '召唤看板娘';
    btn.style.cssText =
      'position:fixed;left:12px;bottom:12px;z-index:9999;width:36px;height:36px;' +
      'border-radius:50%;border:none;background:rgba(255,255,255,.85);' +
      'box-shadow:0 1px 4px rgba(0,0,0,.2);cursor:pointer;font-size:18px;display:none;';
    document.body.appendChild(btn);
    btn.addEventListener('click', function () {
      btn.style.display = 'none';
      state.root.hidden = false;
    });
  }

  document.addEventListener('click', function (e) {
    if (!state.root) return;
    /*
     * 注意：面板项的点击处理器会重建列表（innerHTML = ''），被点击的那个按钮
     * 在事件冒泡到这里时已经从 DOM 上摘掉了，此时 root.contains(e.target) 会返回 false，
     * 于是被误判成"点击了外部"而收起面板 —— 二级列表就是这样刚渲染好又被关掉的。
     * 所以这里要排除"已经脱离文档的节点"。
     */
    if (e.target && !document.contains(e.target)) return;
    if (state.root.contains(e.target)) return;
    closePanels();
    state.root.classList.remove('nc-live2d-controls-open');
  });

  // ---------------- 启动 ----------------
  /** 读取上次选择的角色与装扮；同时兼容旧版本只存装扮下标的数据。 */
  function readSavedSelection() {
    var savedCharacter = parseInt(safeStorageGet(STORAGE_KEY_CHARACTER), 10);
    var savedOutfit = parseInt(safeStorageGet(STORAGE_KEY_OUTFIT), 10);

    if (!isNaN(savedCharacter) && CHARACTERS[savedCharacter]) {
      var outfitIndex = (!isNaN(savedOutfit) && CHARACTERS[savedCharacter].outfits[savedOutfit]) ? savedOutfit : 0;
      return { characterIndex: savedCharacter, outfitIndex: outfitIndex };
    }
    if (!isNaN(savedOutfit) && CHARACTERS[0].outfits[savedOutfit]) {
      return { characterIndex: 0, outfitIndex: savedOutfit };
    }
    return { characterIndex: 0, outfitIndex: 0 };
  }

  function boot() {
    var root = el('div', 'nc-live2d nc-live2d-left');
    var canvas = el('canvas', 'nc-live2d-canvas');
    canvas.id = CANVAS_ID;
    canvas.width = 280;
    canvas.height = 360;
    // Cubism 3 模型由 iframe 内的官方示例页渲染，2.x 模型仍用画布。
    var frame = el('iframe', 'nc-live2d-frame');
    frame.setAttribute('title', 'Live2D 角色');
    frame.setAttribute('scrolling', 'no');
    frame.setAttribute('allowtransparency', 'true');
    frame.style.display = 'none';
    frame.addEventListener('load', detectViewer);
    var bubble = el('div', 'nc-live2d-bubble');
    bubble.hidden = true;

    root.appendChild(canvas);
    root.appendChild(frame);
    root.appendChild(bubble);
    document.body.appendChild(root);

    state.root = root;
    state.canvas = canvas;
    state.frame = frame;
    state.bubble = bubble;

    var saved = readSavedSelection();
    state.characterIndex = saved.characterIndex;
    state.outfitIndex = saved.outfitIndex;
    state.initializing = true;

    buildControls();
    buildPanel();
    initDrag();
    initTheme();
    initReopenButton();

    switchCharacter(state.characterIndex, state.outfitIndex, true);
    state.initializing = false;
    log('boot 完成', JSON.stringify(debugSnapshot()));

    if (window.matchMedia('(max-width: 640px)').matches) {
      state.root.hidden = true;
      document.getElementById('live2d-reopen').style.display = 'block';
    }
  }

  // 排障入口：控制台执行 live2dDebug() 打印状态，live2dTest() 逐个测试 v3 候选源。
  window.live2dDebug = debugSnapshot;
  window.live2dTest = function () {
    var urls = V3_VIEWER_CANDIDATES.slice();
    // 顺带测一下 v3 模型本体：它是 iframe 里的示例页自己去取的。
    for (var i = 0; i < CHARACTERS.length; i++) {
      if (CHARACTERS[i].runtime === 'v3') {
        urls.push(V3_MODEL_BASE + CHARACTERS[i].outfits[0].file);
        urls.push(V3_MODEL_BASE + 'Dimo/' + encodeURIComponent('公皮（迪莫）.moc3'));
        break;
      }
    }
    urls.forEach(function (src) {
      fetch(src, { method: 'GET', cache: 'no-store' })
        .then(function (res) {
          // 重点看 Content-Type：只有 text/html 才能直接塞进 iframe 渲染，
          // text/plain 之类会把网页源码当文字显示出来。
          var type = res.headers.get('content-type') || '(无)';
          console.log('[live2d] HTTP ' + res.status + '  ' + type, src);
        })
        .catch(function (err) { console.log('[live2d] 请求失败（多为跨域）', src, String(err)); });
    });
    console.log('[live2d] 只采纳返回 200 且 Content-Type 含 html 的示例页地址，把它放到 V3_VIEWER_CANDIDATES 第一位。');
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    boot();
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }

})();
