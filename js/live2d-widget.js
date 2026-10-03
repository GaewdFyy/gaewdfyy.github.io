(function () {
  var CANVAS_ID = 'live2d';
  var STORAGE_KEY_POS = 'live2d-widget-pos';
  var STORAGE_KEY_OUTFIT = 'live2d-widget-outfit';
  var MODEL_BASE = 'https://cdn.jsdelivr.net/gh/gaewdfyy/live2d/model/22/';

  var OUTFITS = [
    { file: 'model.default.json', label: '默认装' },
    { file: 'model.2016.xmas.1.json', label: '2016 圣诞装 1' },
    { file: 'model.2016.xmas.2.json', label: '2016 圣诞装 2' },
    { file: 'model.2017.newyear.json', label: '2017 新年装' },
    { file: 'model.2017.school.json', label: '2017 校服' },
    { file: 'model.2017.cba-normal.json', label: '2017 CBA 篮球服（普通）' },
    { file: 'model.2017.cba-super.json', label: '2017 CBA 篮球服（高级）' },
    { file: 'model.2017.summer.normal.1.json', label: '2017 夏装（普通）1' },
    { file: 'model.2017.summer.normal.2.json', label: '2017 夏装（普通）2' },
    { file: 'model.2017.summer.super.1.json', label: '2017 夏装（高级）1' },
    { file: 'model.2017.summer.super.2.json', label: '2017 夏装（高级）2' },
    { file: 'model.2017.tomo-bukatsu.high.json', label: '2017 社团服（高中）' },
    { file: 'model.2017.tomo-bukatsu.low.json', label: '2017 社团服（初中）' },
    { file: 'model.2017.valley.json', label: '2017 valley' },
    { file: 'model.2017.vdays.json', label: '2017 情人节装' },
    { file: 'model.2018.bls-summer.json', label: '2018 bls 夏装' },
    { file: 'model.2018.bls-winter.json', label: '2018 bls 冬装' },
    { file: 'model.2018.lover.json', label: '2018 情侣装' },
    { file: 'model.2018.spring.json', label: '2018 春装' }
  ];

  var state = {
    outfitIndex: 0,
    dragging: false,
    moved: false,
    root: null,
    canvas: null,
    bubble: null,
    outfitPanel: null,
    bubbleTimer: null
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
    if (state.outfitPanel) state.outfitPanel.hidden = true;
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
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY_POS) || 'null');
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
        try {
          localStorage.setItem(STORAGE_KEY_POS, JSON.stringify({
            left: parseFloat(root.style.left),
            top: parseFloat(root.style.top)
          }));
        } catch (e) {}
      } else {
        root.classList.toggle('nc-live2d-controls-open');
      }
    }
    root.addEventListener('pointerup', endDrag);
    root.addEventListener('pointercancel', endDrag);
    window.addEventListener('resize', clamp);
  }

  // ---------------- 衣柜面板 ----------------
  function buildOutfitPanel() {
    var panel = el('div', 'nc-live2d-panel');
    panel.hidden = true;
    OUTFITS.forEach(function (outfit, index) {
      var item = el('button', 'nc-live2d-panel-item', outfit.label);
      item.type = 'button';
      item.addEventListener('click', function () {
        switchOutfit(index);
        panel.hidden = true;
      });
      panel.appendChild(item);
    });
    state.root.appendChild(panel);
    state.outfitPanel = panel;
  }

  function switchOutfit(index) {
    state.outfitIndex = index;
    var outfit = OUTFITS[index];
    window.loadlive2d(CANVAS_ID, MODEL_BASE + outfit.file);
    showBubble('已切换：' + outfit.label + '（可能会有延迟）');
    try { localStorage.setItem(STORAGE_KEY_OUTFIT, String(index)); } catch (e) {}
  }

  // ---------------- 工具栏 ----------------
  function buildControls() {
    var controls = el(
      'div',
      'nc-live2d-controls',
      '<button class="nc-live2d-icon" type="button" data-action="motion" title="随机动作">' +
        '<svg viewBox="0 0 24 24" class="nc-live2d-icon-svg"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>' +
      '</button>' +

      '<button class="nc-live2d-icon" type="button" data-action="outfit" title="换装">' +
        '<svg viewBox="0 0 24 24" class="nc-live2d-icon-svg"><path d="M20.14 7.27a2.15 2.15 0 0 0-2.31-.69l-4.14 1.34a2.91 2.91 0 0 1-1.74 0l-4.14-1.34a2.15 2.15 0 0 0-2.31.69L2 11.5l1.83 2 1.17-1.1v7.1h14v-7.1l1.17 1.1 1.83-2-1.86-4.23zM13 18h-2v-3h2v3z"/></svg>' +
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
      var groups = motions ? Object.keys(motions) : [];
      if (!groups.length) return;
      var group = groups[Math.floor(Math.random() * groups.length)];
      model.startRandomMotion(group, 3);
    });

    controls.querySelector('[data-action="outfit"]').addEventListener('click', function () {
      state.outfitPanel.hidden = !state.outfitPanel.hidden;
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
    if (state.root.contains(e.target)) return;
    closePanels();
    state.root.classList.remove('nc-live2d-controls-open');
  });

  // ---------------- 启动 ----------------
  function boot() {
    var root = el('div', 'nc-live2d nc-live2d-left');
    var canvas = el('canvas', 'nc-live2d-canvas');
    canvas.id = CANVAS_ID;
    canvas.width = 280;
    canvas.height = 360;
    var bubble = el('div', 'nc-live2d-bubble');
    bubble.hidden = true;

    root.appendChild(canvas);
    root.appendChild(bubble);
    document.body.appendChild(root);

    state.root = root;
    state.canvas = canvas;
    state.bubble = bubble;

    var startIndex = 0;
    try {
      var savedIndex = parseInt(localStorage.getItem(STORAGE_KEY_OUTFIT), 10);
      if (!isNaN(savedIndex) && OUTFITS[savedIndex]) startIndex = savedIndex;
    } catch (e) {}
    state.outfitIndex = startIndex;
    window.loadlive2d(CANVAS_ID, MODEL_BASE + OUTFITS[startIndex].file);

    buildControls();
    buildOutfitPanel();
    initDrag();
    initTheme();
    initReopenButton();

    if (window.matchMedia('(max-width: 640px)').matches) {
        state.root.hidden = true;
        document.getElementById('live2d-reopen').style.display = 'block';
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    boot();
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }

})();