---
layout: false
---
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GaewdFyy's Gallery</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Outfit:wght@200;300;400&display=swap" rel="stylesheet" />
  <script src="https://cdn.jsdelivr.net/npm/colorthief@2/dist/color-thief.umd.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/masonry-layout@4/dist/masonry.pkgd.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/imagesloaded@5/imagesloaded.pkgd.min.js"></script>

  <style>
    /* ── CSS Variables（默认暖色，JS 加载后覆盖） ──── */
    :root {
      --primary:           #ffb68a;
      --on-primary:        #4a1f00;
      --primary-container: #6b3000;
      --secondary:         #e8c4a8;
      --surface:           #1a1310;
      --surface-variant:   #2b1f18;
      --on-surface:        #f0e8e0;
      --background:        #130f0c;
      --outline:           #5c4030;
      --t: 0.6s;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--background);
      color: var(--on-surface);
      font-family: 'Outfit', sans-serif;
      font-weight: 300;
      min-height: 100vh;
      transition: background var(--t) ease, color var(--t) ease;
    }

    /* ── Header ───────────────────────────────────── */
    header {
      position: sticky; top: 0; z-index: 200;
      display: flex; align-items: center; gap: 1.5rem;
      padding: 1.1rem 3.5rem;
      background: rgba(19,15,12,0.75);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255,255,255,0.06);
      transition: background var(--t) ease;
      flex-wrap: wrap;
    }
    header h1 {
      font-family: 'Cormorant Garamond', serif;
      font-weight: 300; font-size: 1.8rem;
      color: var(--primary); white-space: nowrap;
    }
    header .sep { width: 1px; height: 1.2rem; background: var(--outline); opacity: 0.5; flex-shrink: 0; }

    /* ── Tag Filter Bar ───────────────────────────── */
    .tag-bar {
      display: flex; align-items: center; gap: 0.5rem;
      flex-wrap: wrap; flex: 1;
    }
    .tag-btn {
      padding: 0.28rem 0.85rem; border-radius: 99px;
      border: 1px solid var(--outline);
      background: transparent; color: var(--on-surface);
      font-family: 'Outfit', sans-serif; font-size: 0.72rem;
      letter-spacing: 0.08em; cursor: pointer;
      transition: all 0.2s ease; opacity: 0.55;
    }
    .tag-btn:hover { opacity: 0.85; border-color: var(--primary); }
    .tag-btn.active {
      background: var(--primary-container);
      border-color: var(--primary);
      color: var(--primary); opacity: 1;
    }

    /* ── Layout: timeline sidebar + gallery ───────── */
    .page-body {
      display: flex;
      align-items: flex-start;
    }

    /* ── Timeline Sidebar ─────────────────────────── */
    .timeline-sidebar {
      position: sticky; top: 70px;
      width: 88px; flex-shrink: 0;
      padding: 2.5rem 0 2.5rem 2rem;
      display: flex; flex-direction: column; gap: 0;
      max-height: calc(100vh - 70px);
      overflow-y: auto; overflow-x: hidden;
    }
    .timeline-sidebar::-webkit-scrollbar { display: none; }

    .tl-group { display: flex; flex-direction: column; align-items: flex-start; }
    .tl-year {
      font-size: 0.62rem; letter-spacing: 0.18em;
      text-transform: uppercase; color: var(--primary);
      opacity: 0.7; margin-top: 1.2rem; margin-bottom: 0.3rem;
      cursor: pointer; transition: opacity 0.2s;
    }
    .tl-year:first-child { margin-top: 0; }
    .tl-year:hover { opacity: 1; }

    .tl-month-item {
      display: flex; align-items: center; gap: 0.45rem;
      cursor: pointer; padding: 0.18rem 0;
    }
    .tl-dot {
      width: 5px; height: 5px; border-radius: 50%;
      background: var(--outline); flex-shrink: 0;
      transition: background 0.2s, transform 0.2s;
    }
    .tl-month-item:hover .tl-dot,
    .tl-month-item.active .tl-dot {
      background: var(--primary); transform: scale(1.5);
    }
    .tl-month-label {
      font-size: 0.62rem; opacity: 0.4;
      transition: opacity 0.2s; white-space: nowrap;
    }
    .tl-month-item:hover .tl-month-label,
    .tl-month-item.active .tl-month-label { opacity: 0.9; }

    /* vertical line connecting dots */
    .tl-line {
      width: 1px; height: 14px; background: var(--outline);
      margin-left: 2px; opacity: 0.25;
    }

    /* ── Gallery ──────────────────────────────────── */
    .gallery-wrap { flex: 1; padding: 2.5rem 3rem 5rem 1rem; min-width: 0; }

    /* Month group header */
    .month-group { margin-bottom: 0.5rem; }
    .month-heading {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.25rem; font-weight: 300; font-style: italic;
      color: var(--secondary); opacity: 0.6;
      margin-bottom: 0.8rem; padding-left: 2px;
      letter-spacing: 0.04em;
    }

    .grid { margin-top: 0; }
    .grid-sizer, .gallery-item { width: calc(25% - 12px); }
    .gutter-sizer { width: 16px; }

    .gallery-item {
      margin-bottom: 16px; cursor: pointer; position: relative; overflow: hidden;
      border-radius: 10px; opacity: 0; animation: rise 0.55s ease forwards;
    }
    @keyframes rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }

    .gallery-item img { width: 100%; display: block; border-radius: 10px; transition: transform 0.55s ease; }
    .gallery-item:hover img { transform: scale(1.05); }

    /* tag chips on thumbnail */
    .item-tags {
      position: absolute; top: 0.6rem; left: 0.6rem;
      display: flex; flex-wrap: wrap; gap: 0.3rem;
      opacity: 0; transition: opacity 0.28s ease;
      pointer-events: none;
    }
    .gallery-item:hover .item-tags { opacity: 1; }
    .item-tag-chip {
      font-size: 0.55rem; letter-spacing: 0.1em;
      padding: 0.15rem 0.5rem; border-radius: 99px;
      background: rgba(0,0,0,0.55);
      backdrop-filter: blur(6px);
      color: var(--primary); border: 1px solid rgba(255,255,255,0.12);
    }

    /* ── Hover Title Overlay ──────────────────────── */
    .item-hover-caption {
      position: absolute; inset: 0; border-radius: 10px;
      display: flex; flex-direction: column; justify-content: flex-end;
      padding: 1.1rem 1rem 0.9rem;
      background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 55%, transparent 100%);
      opacity: 0; transition: opacity 0.32s ease; pointer-events: none;
    }
    .gallery-item:hover .item-hover-caption { opacity: 1; }
    .caption-en {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic; font-weight: 300;
      font-size: 1.05rem; color: #fff; line-height: 1.2;
      text-shadow: 0 1px 6px rgba(0,0,0,0.5);
    }
    .caption-zh {
      font-size: 0.65rem; letter-spacing: 0.2em;
      color: var(--secondary); opacity: 0.85; margin-top: 0.25rem;
      text-shadow: 0 1px 4px rgba(0,0,0,0.5);
    }

    /* hidden state for filter */
    .gallery-item.hidden { display: none; }
    .month-group.empty { display: none; }

    /* ── Detail Overlay ───────────────────────────── */
    .detail-overlay {
      position: fixed; inset: 0; z-index: 300;
      display: flex; align-items: stretch; opacity: 0; pointer-events: none;
      transition: opacity 0.35s ease;
    }
    .detail-overlay.open { opacity: 1; pointer-events: all; }
    .detail-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); }

    .detail-panel {
      position: relative; z-index: 1; display: flex; width: 100%; max-width: 1200px;
      margin: auto; height: 88vh; border-radius: 16px; overflow: hidden;
      background: var(--surface); border: 1px solid rgba(255,255,255,0.07);
      box-shadow: 0 32px 80px rgba(0,0,0,0.6);
      transform: translateY(22px) scale(0.975);
      transition: transform 0.38s cubic-bezier(0.22,1,0.36,1), background var(--t) ease;
    }
    .detail-overlay.open .detail-panel { transform: none; }

    .detail-img-wrap {
      flex: 1 1 60%; background: #000;
      display: flex; align-items: center; justify-content: center; overflow: hidden;
    }
    .detail-img-wrap img { max-width: 100%; max-height: 100%; object-fit: contain; }

    .detail-meta {
      flex: 0 0 340px; display: flex; flex-direction: column;
      padding: 2.5rem 2rem; border-left: 1px solid rgba(255,255,255,0.07);
      overflow-y: auto; background: var(--surface-variant);
      transition: background var(--t) ease;
    }
    .detail-title {
      font-family: 'Cormorant Garamond', serif; font-style: italic;
      font-size: 1.9rem; margin-bottom: 0.4rem; color: var(--on-surface);
    }
    .detail-loc {
      font-size: 0.72rem; letter-spacing: 0.22em; text-transform: uppercase;
      color: var(--secondary); margin-bottom: 0.6rem;
    }
    .detail-date {
      font-size: 0.68rem; opacity: 0.38; margin-bottom: 1.6rem; letter-spacing: 0.05em;
    }
    .detail-tag-row { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 1.8rem; }
    .detail-tag-chip {
      font-size: 0.62rem; letter-spacing: 0.08em; padding: 0.2rem 0.65rem;
      border-radius: 99px; border: 1px solid var(--outline);
      color: var(--primary); background: var(--primary-container); opacity: 0.85;
    }
    .detail-params { display: grid; grid-template-columns: auto 1fr; gap: 0.6rem 1.2rem; margin-bottom: 2rem; }
    .param-key { font-size: 0.65rem; text-transform: uppercase; opacity: 0.4; }
    .param-val { font-size: 0.82rem; color: var(--on-surface); }
    .detail-comment {
      font-size: 0.85rem; line-height: 1.75; opacity: 0.75;
      border-left: 2px solid var(--primary); padding-left: 0.9rem; margin-bottom: 2.5rem;
    }
    .btn-raw {
      margin-top: auto; display: flex; align-items: center; justify-content: center;
      padding: 0.8rem; border-radius: 8px;
      background: var(--primary-container); color: var(--secondary);
      text-decoration: none; font-size: 0.75rem; letter-spacing: 0.1em;
      text-transform: uppercase; border: 1px solid var(--outline);
      transition: all 0.2s ease;
    }
    .btn-raw:hover { background: var(--primary); color: var(--on-primary); transform: translateY(-2px); }
    .detail-close {
      position: absolute; top: 1rem; right: 1rem; z-index: 10;
      width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.08);
      border: none; color: var(--on-surface); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.85rem;
    }

    /* ── Empty state ──────────────────────────────── */
    .empty-state {
      display: none; flex-direction: column; align-items: center;
      padding: 5rem 2rem; opacity: 0.35; gap: 0.8rem;
    }
    .empty-state.show { display: flex; }
    .empty-state svg { width: 48px; opacity: 0.5; }
    .empty-state p { font-size: 0.85rem; letter-spacing: 0.1em; }

    /* ── Responsive ───────────────────────────────── */
    @media (max-width: 1100px) {
      .grid-sizer, .gallery-item { width: calc(33.333% - 11px); }
    }
    @media (max-width: 900px) {
      .timeline-sidebar { display: none; }
      .gallery-wrap { padding: 2rem 1.5rem 4rem; }
      header { padding: 1rem 1.5rem; }
    }
    @media (max-width: 768px) {
      .grid-sizer, .gallery-item { width: calc(50% - 8px); }
    }
    @media (max-width: 600px) {
      header h1 { font-size: 1.4rem; }
      .gallery-wrap { padding: 1.5rem 1rem; }
      .grid-sizer, .gallery-item { width: 100%; margin-bottom: 12px; }
      .detail-panel { flex-direction: column; height: 92vh; }
      .detail-meta { flex: 0 0 auto; border-left: none; border-top: 1px solid rgba(255,255,255,0.07); }
    }
  </style>
</head>
<body>

<header>
  <h1>GaewdFyy's Gallery</h1>
  <div class="sep"></div>
  <div class="tag-bar" id="tagBar"><!-- 由 JS 生成 --></div>
</header>

<div class="page-body">
  <nav class="timeline-sidebar" id="timelineSidebar"><!-- 由 JS 生成 --></nav>

  <section class="gallery-wrap">
    <div class="gallery-wrap-inner" id="galleryWrapInner"><!-- 由 JS 生成 --></div>
    <div class="empty-state" id="emptyState">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <p>当前标签下暂无作品</p>
    </div>
  </section>
</div>

<div class="detail-overlay" id="detailOverlay">
  <div class="detail-backdrop" id="detailBackdrop"></div>
  <div class="detail-panel">
    <button class="detail-close" id="detailClose">✕</button>
    <div class="detail-img-wrap">
      <img id="detailImg" src="" alt="" />
    </div>
    <div class="detail-meta">
      <h2 class="detail-title" id="detailTitle"></h2>
      <div class="detail-loc" id="detailLoc"></div>
      <div class="detail-date" id="detailDate"></div>
      <div class="detail-tag-row" id="detailTagRow"></div>
      <div class="detail-params" id="detailParams"></div>
      <p class="detail-comment" id="detailComment"></p>
      <a href="#" id="btnRaw" target="_blank" class="btn-raw">获取高清原图 ↗</a>
    </div>
  </div>
</div>

<script type="module">
  import { argbFromRgb, themeFromSourceColor, hexFromArgb } from 'https://esm.sh/@material/material-color-utilities@0.3.0';

  /* ══════════════════════════════════════════════════
     📸 作品数据表 — 以后添加新作品只需在这里加一条记录
     字段说明：
       src      本地路径（相对于站点根目录）
       raw      GitHub 原图直链
       title    英文标题
       loc      中文副标题 / 拍摄地
       date     拍摄日期 "YYYY-MM-DD"
       tags     标签数组，可自由定义
       camera   相机型号
       settings 拍摄参数
       comment  作者感言
  ══════════════════════════════════════════════════ */
  const PHOTOS = [
    {
      src:      '/gallery/photo/photo04.jpg',
      raw:      'https://raw.githubusercontent.com/gaewdfyy/gallery/main/photo04.jpg',
      title:    'Tapestry of Spring',
      loc:      '春意织锦',
      date:     '2026-04-01',
      tags:     ['春天'],
      camera:   'Nikon D3300',
      settings: '105mm · 1/40s · f/5.6 · ISO 100',
      comment:  '那些粉色的花簇，在 105mm 的镜头下变得格外温柔。',
    },
    {
      src:      '/gallery/photo/photo01.jpg',
      raw:      'https://raw.githubusercontent.com/gaewdfyy/gallery/main/photo01.jpg',
      title:    'Through the Willow Veil',
      loc:      '柳帘窥岸',
      date:     '2026-04-01',
      tags:     ['风景'],
      camera:   'Nikon D3300',
      settings: '105mm · 1/160s · F9 · ISO100',
      comment:  '当你把眼睛凑近取景器时，世界忽然从一种无序的喧嚣，缩减成了一个 3:2 的矩形方框。',
    },
    {
      src:      '/gallery/photo/photo02.jpg',
      raw:      'https://raw.githubusercontent.com/gaewdfyy/gallery/main/photo02.jpg',
      title:    'Serenity by the Stream',
      loc:      '河畔静谧',
      date:     '2026-04-01',
      tags:     ['风景'],
      camera:   'Nikon D3300',
      settings: '105mm · 1/50s · F5.6 · ISO100',
      comment:  '"犹抱琵琶半遮面"',
    },
    {
      src:      '/gallery/photo/photo03.jpg',
      raw:      'https://raw.githubusercontent.com/gaewdfyy/gallery/main/photo03.jpg',
      title:    'Glow of the Bloom',
      loc:      '浮光春蕊',
      date:     '2026-04-01',
      tags:     ['春天'],
      camera:   'Nikon D3300',
      settings: '105mm · 1/60s · F5.6 · ISO200',
      comment:  '就像我们在修图软件里小心翼翼地调整阴影和高光，本质上是在用色彩，去缝补记忆里的某些缺憾。',
    },
  ];

  /* ── Material You ───────────────────────────────── */
  const root = document.documentElement;
  const colorThief = new ColorThief();
  const colorCache = new Map();

  function applyTheme(r, g, b) {
    const s = themeFromSourceColor(argbFromRgb(r, g, b)).schemes.dark;
    const vars = {
      '--primary':           hexFromArgb(s.primary),
      '--on-primary':        hexFromArgb(s.onPrimary),
      '--primary-container': hexFromArgb(s.primaryContainer),
      '--secondary':         hexFromArgb(s.secondary),
      '--surface':           hexFromArgb(s.surface),
      '--surface-variant':   hexFromArgb(s.surfaceVariant),
      '--on-surface':        hexFromArgb(s.onSurface),
      '--outline':           hexFromArgb(s.outline),
      '--background':        hexFromArgb(s.background),
    };
    for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);
  }

  // 默认暖色种子 (#FFE3C7 × #F2B6A0 中值)
  applyTheme(249, 202, 163);

  async function getFastColor(img) {
    return new Promise(resolve => {
      const c = document.createElement('canvas');
      c.width = c.height = 100;
      c.getContext('2d').drawImage(img, 0, 0, 100, 100);
      try { resolve(colorThief.getColor(c)); } catch { resolve(null); }
    });
  }

  /* ── Date helpers ───────────────────────────────── */
  const MONTHS_ZH = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];

  function parseDate(s) {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  function groupKey(d)   { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`; }
  function groupLabel(k) {
    const [y, m] = k.split('-');
    return `${y} · ${MONTHS_ZH[+m - 1]}`;
  }
  function groupAnchor(k) { return `grp-${k}`; }

  /* ── Sort PHOTOS newest-first ───────────────────── */
  PHOTOS.sort((a, b) => parseDate(b.date) - parseDate(a.date));

  /* ── Collect all tags ───────────────────────────── */
  const allTags = ['全部', ...new Set(PHOTOS.flatMap(p => p.tags))];
  let activeTag = '全部';

  /* ── Build Tag Bar ──────────────────────────────── */
  const tagBar = document.getElementById('tagBar');
  allTags.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'tag-btn' + (tag === '全部' ? ' active' : '');
    btn.textContent = tag;
    btn.addEventListener('click', () => {
      activeTag = tag;
      document.querySelectorAll('.tag-btn').forEach(b => b.classList.toggle('active', b.textContent === tag));
      filterGallery();
    });
    tagBar.appendChild(btn);
  });

  /* ── Group photos by month ──────────────────────── */
  const groups = new Map(); // key → photo[]
  PHOTOS.forEach(p => {
    const k = groupKey(parseDate(p.date));
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(p);
  });

  /* ── Build Gallery HTML ─────────────────────────── */
  const galleryWrap = document.getElementById('galleryWrapInner');
  let masonryInstance = null;

  function buildGallery() {
    galleryWrap.innerHTML = '';

    groups.forEach((photos, key) => {
      const section = document.createElement('div');
      section.className = 'month-group';
      section.id = groupAnchor(key);

      const heading = document.createElement('div');
      heading.className = 'month-heading';
      heading.textContent = groupLabel(key);
      section.appendChild(heading);

      const grid = document.createElement('div');
      grid.className = 'grid';
      grid.innerHTML = '<div class="grid-sizer"></div><div class="gutter-sizer"></div>';

      photos.forEach(p => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.tags  = JSON.stringify(p.tags);
        item.dataset.photo = JSON.stringify(p);

        // tag chips (top-left, shown on hover)
        const chipRow = document.createElement('div');
        chipRow.className = 'item-tags';
        p.tags.forEach(t => {
          const chip = document.createElement('span');
          chip.className = 'item-tag-chip';
          chip.textContent = t;
          chipRow.appendChild(chip);
        });

        // hover title caption (bottom)
        const cap = document.createElement('div');
        cap.className = 'item-hover-caption';
        cap.innerHTML = `
          <span class="caption-en">${p.title}</span>
          <span class="caption-zh">${p.loc}</span>
        `;

        const img = document.createElement('img');
        img.src = p.src;
        img.alt = p.title;
        img.crossOrigin = 'anonymous';

        item.appendChild(img);
        item.appendChild(chipRow);
        item.appendChild(cap);
        item.addEventListener('click', () => openDetail(p, img));
        grid.appendChild(item);
      });

      section.appendChild(grid);
      galleryWrap.appendChild(section);
    });

    // init Masonry for each grid after images load
    imagesLoaded(galleryWrap, () => {
      document.querySelectorAll('.grid').forEach(grid => {
        new Masonry(grid, {
          itemSelector: '.gallery-item',
          columnWidth: '.grid-sizer',
          gutter: '.gutter-sizer',
          percentPosition: true,
        });
      });
      buildTimeline();
    });
  }

  /* ── Filter gallery by tag ──────────────────────── */
  function filterGallery() {
    let anyVisible = false;
    document.querySelectorAll('.month-group').forEach(section => {
      let groupVisible = false;
      section.querySelectorAll('.gallery-item').forEach(item => {
        const tags = JSON.parse(item.dataset.tags);
        const show = activeTag === '全部' || tags.includes(activeTag);
        item.classList.toggle('hidden', !show);
        if (show) groupVisible = true;
      });
      section.classList.toggle('empty', !groupVisible);
      if (groupVisible) anyVisible = true;

      // re-layout each grid
      section.querySelectorAll('.gallery-item:not(.hidden)').forEach(el => {
        el.style.display = '';
      });
    });

    document.getElementById('emptyState').classList.toggle('show', !anyVisible);

    // Refresh Masonry layout
    document.querySelectorAll('.grid').forEach(grid => {
      const m = Masonry.data(grid);
      if (m) m.layout();
    });

    updateTimelineActive();
  }

  /* ── Build Timeline Sidebar ─────────────────────── */
  function buildTimeline() {
    const sidebar = document.getElementById('timelineSidebar');
    sidebar.innerHTML = '';

    // group keys by year
    const byYear = new Map();
    groups.forEach((_, key) => {
      const [y] = key.split('-');
      if (!byYear.has(y)) byYear.set(y, []);
      byYear.get(y).push(key);
    });

    byYear.forEach((keys, year) => {
      const yearLabel = document.createElement('div');
      yearLabel.className = 'tl-year';
      yearLabel.textContent = year;
      yearLabel.addEventListener('click', () => scrollToGroup(keys[0]));
      sidebar.appendChild(yearLabel);

      keys.forEach((key, i) => {
        if (i > 0) {
          const line = document.createElement('div');
          line.className = 'tl-line';
          sidebar.appendChild(line);
        }
        const [, m] = key.split('-');
        const item = document.createElement('div');
        item.className = 'tl-month-item';
        item.dataset.key = key;
        item.innerHTML = `<div class="tl-dot"></div><span class="tl-month-label">${MONTHS_ZH[+m-1]}</span>`;
        item.addEventListener('click', () => scrollToGroup(key));
        sidebar.appendChild(item);

        if (i < keys.length - 1) {
          const line2 = document.createElement('div');
          line2.className = 'tl-line';
          sidebar.appendChild(line2);
        }
      });
    });

    updateTimelineActive();
  }

  function scrollToGroup(key) {
    const el = document.getElementById(groupAnchor(key));
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function updateTimelineActive() {
    const sections = [...document.querySelectorAll('.month-group:not(.empty)')];
    if (!sections.length) return;

    const scrollY = window.scrollY + 120;
    let activeKey = sections[0].id.replace('grp-', '');
    sections.forEach(s => {
      if (s.offsetTop <= scrollY) activeKey = s.id.replace('grp-', '');
    });

    document.querySelectorAll('.tl-month-item').forEach(el => {
      el.classList.toggle('active', el.dataset.key === activeKey);
    });
  }

  window.addEventListener('scroll', updateTimelineActive, { passive: true });

  /* ── Detail Overlay ─────────────────────────────── */
  const overlay   = document.getElementById('detailOverlay');
  const detailImg = document.getElementById('detailImg');
  const btnRaw    = document.getElementById('btnRaw');
  let pendingLoad = null;

  function openDetail(p, thumbImg) {
    document.getElementById('detailTitle').textContent   = p.title || '无题';
    document.getElementById('detailLoc').textContent     = p.loc || '';
    document.getElementById('detailDate').textContent    = p.date || '';
    document.getElementById('detailComment').textContent = p.comment || '';
    document.getElementById('detailParams').innerHTML = `
      <span class="param-key">相机</span><span class="param-val">${p.camera || '-'}</span>
      <span class="param-key">参数</span><span class="param-val">${p.settings || '-'}</span>
    `;
    const tagRow = document.getElementById('detailTagRow');
    tagRow.innerHTML = (p.tags || []).map(t => `<span class="detail-tag-chip">${t}</span>`).join('');
    btnRaw.href = p.raw || '#';

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    detailImg.src = thumbImg.src;
    pendingLoad = thumbImg.src;

    if (colorCache.has(thumbImg.src)) {
      applyTheme(...colorCache.get(thumbImg.src));
    } else {
      const tmp = new Image();
      tmp.crossOrigin = 'anonymous';
      tmp.src = thumbImg.src;
      tmp.onload = async () => {
        const color = await getFastColor(tmp);
        if (color) {
          colorCache.set(thumbImg.src, color);
          if (pendingLoad === thumbImg.src) applyTheme(...color);
        }
      };
    }
  }

  const closeDetail = () => { overlay.classList.remove('open'); document.body.style.overflow = ''; };
  document.getElementById('detailClose').onclick = closeDetail;
  document.getElementById('detailBackdrop').onclick = closeDetail;
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDetail(); });

  /* ── Init ───────────────────────────────────────── */
  buildGallery();
</script>
</body>
</html>
