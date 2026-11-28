/* ══════════════════════════════════════════════════════════════
   图廊 · 照片分享卡片
   ──────────────────────────────────────────────────────────────
   · 图片来源：当前照片详情页「获取高清原图」所用的同一链接（photo.raw）
   · 预览与导出共用同一套 Canvas 绘制函数 paintCard()，所见即所得
   · 画布固定 16:9，内部所有尺寸以 1080 高为设计基准按比例缩放
   ══════════════════════════════════════════════════════════════ */

const DESIGN_HEIGHT = 1080;
const CARD_RATIO = 16 / 9;
/* 宽高比低于该值则走竖版（方案 B）布局 */
const PORTRAIT_RATIO = 0.95;

/* 卡片配色：暖白象牙色系，与图廊主题呼应 */
const IVORY = '#f4ece2';
const IVORY_SOFT = 'rgba(244, 236, 226, 0.62)';
const IVORY_FAINT = 'rgba(244, 236, 226, 0.48)';

const FONT_SERIF = '"Cormorant Garamond", Georgia, "Times New Roman", serif';
const FONT_SANS = '"Outfit", "Helvetica Neue", Arial, sans-serif';

const EXPORT_SIZES = [
  { w: 1920, h: 1080, label: '1920 × 1080' },
  { w: 2560, h: 1440, label: '2560 × 1440' },
  { w: 3840, h: 2160, label: '3840 × 2160（4K）' },
];

/**
 * 可调项定义。
 * def 是滑块上的默认值，factor 把滑块值换算成绘制用的系数：
 *   百分比项 100 → 1，圆角 16 → 16（设计像素，1080 高画布基准）
 */
const ADJUSTS = [
  { key: 'blur',       label: '背景模糊', min: 0,   max: 200, step: 5, def: 100, unit: '%', factor: 100 },
  { key: 'brightness', label: '背景亮度', min: 50,  max: 140, step: 5, def: 100, unit: '%', factor: 100 },
  { key: 'radius',     label: '照片圆角', min: 0,   max: 40,  step: 1, def: 16,  unit: '',  factor: 1 },
  { key: 'photo',      label: '照片大小', min: 80,  max: 116, step: 1, def: 100, unit: '%', factor: 100 },
  { key: 'text',       label: '文字大小', min: 85,  max: 135, step: 1, def: 100, unit: '%', factor: 100 },
  { key: 'tracking',   label: '文字间距', min: 0,   max: 200, step: 5, def: 100, unit: '%', factor: 100 },
  { key: 'spacing',    label: '元素间距', min: 60,  max: 180, step: 5, def: 100, unit: '%', factor: 100 },
];

const DEFAULT_ADJUST = ADJUSTS.reduce((acc, a) => {
  acc[a.key] = a.def / a.factor;
  return acc;
}, {});

/* 可在面板中编辑的摄影信息字段 */
const INFO_FIELDS = ['camera', 'lens', 'focal', 'aperture', 'shutter', 'iso'];

/* 支持的相机品牌（顺序即匹配优先级） */
const BRANDS = [
  { id: 'nikon', name: 'Nikon', re: /nikon|尼康/i },
  { id: 'canon', name: 'Canon', re: /canon|佳能/i },
  { id: 'sony', name: 'Sony', re: /sony|索尼|\bilce\b/i },
  { id: 'fujifilm', name: 'Fujifilm', re: /fuji\s?film|fuji|富士/i },
];

/* LOGO：同源静态资源，不依赖任何外部图片链接 */
const LOGO_FILES = {
  nikon: './logos/nikon.svg',
  canon: './logos/canon.svg',
  sony: './logos/sony.svg',
  fujifilm: './logos/fujifilm.svg',
};

/* canvas filter 支持性（Safari 旧版没有，降级为纯缩放模糊） */
const SUPPORTS_CANVAS_FILTER = (() => {
  try {
    const c = document.createElement('canvas').getContext('2d');
    if (!c) return false;
    c.filter = 'blur(2px)';
    return c.filter === 'blur(2px)';
  } catch (e) {
    return false;
  }
})();

class ShareError extends Error {}

/* ── 解析：品牌 / 相机型号 / 拍摄参数 ────────────────────── */

function detectBrand(camera) {
  if (!camera) return null;
  return BRANDS.find((b) => b.re.test(camera)) || null;
}

/** 从 "105mm · 1/40s · f/5.6 · ISO 100" 这类字符串里拆出各项参数 */
function parseSettings(raw) {
  const out = { focal: '', aperture: '', shutter: '', iso: '', lens: '' };
  if (!raw) return out;

  /* 只按分隔符切分：不能切 "/"，否则 1/40s、f/5.6 会被拆坏 */
  const tokens = String(raw)
    .split(/[·•|,]+|\s{2,}/)
    .map((t) => t.trim())
    .filter(Boolean);

  for (const token of tokens) {
    if (/^iso/i.test(token)) {
      const m = token.match(/(\d+)/);
      if (m) { out.iso = `ISO ${m[1]}`; continue; }
    }
    const ap = token.match(/^[fF]\s*\/?\s*(\d+(?:\.\d+)?)$/);
    if (ap) { out.aperture = `f/${ap[1]}`; continue; }
    const sh = token.match(/^(\d+(?:\.\d+)?)(?:\s*\/\s*(\d+(?:\.\d+)?))?\s*s(?:ec)?$/i);
    if (sh) { out.shutter = sh[2] ? `${sh[1]}/${sh[2]}s` : `${sh[1]}s`; continue; }
    const fl = token.match(/^(\d+(?:\.\d+)?)\s*mm$/i);
    if (fl) { out.focal = `${fl[1]}mm`; continue; }
    if (/[a-z]{2,}/i.test(token)) out.lens = out.lens || token;
  }
  return out;
}

function normalizeFocal(v) {
  if (v == null || v === '') return '';
  const s = String(v).trim();
  return /mm$/i.test(s) ? s : `${s}mm`;
}

/**
 * 把照片对象上的数据整理成「可编辑字段」。
 * 优先用照片对象上可能存在的独立字段，缺失时退回 settings 字符串解析结果，
 * 全部缺失就留空——不臆造任何参数。
 */
function readPhotoInfo(photo) {
  const parsed = parseSettings(photo.settings);
  return {
    camera: String(photo.camera || '').trim(),
    lens: String(photo.lens || parsed.lens || '').trim(),
    focal: normalizeFocal(photo.focal || parsed.focal),
    aperture: String(photo.aperture || parsed.aperture || '').trim(),
    shutter: String(photo.shutter || parsed.shutter || '').trim(),
    iso: String(photo.iso || parsed.iso || '').trim(),
  };
}

/**
 * 用户输入做温和归一：只在「纯数字」时补上单位，
 * 其它写法（如 T1.8、1/2 sec、F2.8）原样保留，不擅自改写。
 */
function normalizeInfoField(key, value) {
  const v = String(value == null ? '' : value).trim();
  if (!v) return '';

  if (key === 'focal') {
    if (/^\d+(?:\.\d+)?$/.test(v)) return `${v}mm`;
    if (/^\d+(?:\.\d+)?\s*mm$/i.test(v)) return `${v.replace(/\s*mm$/i, '')}mm`;
    return v;
  }
  if (key === 'aperture') {
    const m = v.match(/^[fF]\s*\/?\s*(\d+(?:\.\d+)?)$/);
    if (m) return `f/${m[1]}`;
    if (/^\d+(?:\.\d+)?$/.test(v)) return `f/${v}`;
    return v;
  }
  if (key === 'shutter') {
    if (/^\d+(?:\.\d+)?(?:\/\d+(?:\.\d+)?)?$/.test(v)) return `${v}s`;
    return v;
  }
  if (key === 'iso') {
    const m = v.match(/^iso\s*(\d+)$/i);
    if (m) return `ISO ${m[1]}`;
    if (/^\d+$/.test(v)) return `ISO ${v}`;
    return v;
  }
  return v;
}

/** 由字段组装卡片真正要用的 meta（品牌 / 型号 / 参数行） */
function composeMeta(info) {
  const camera = String(info.camera || '').trim();
  const brand = detectBrand(camera);

  let model = '';
  if (camera) {
    if (brand) {
      const stripped = camera.replace(brand.re, '').replace(/^[\s\-–—/]+/, '').trim();
      model = stripped || camera;   // 只写了品牌名时保留完整名称
    } else {
      model = camera;
    }
  }

  return {
    brandId: brand ? brand.id : '',
    brandName: brand ? brand.name : '',
    model,
    lens: String(info.lens || '').trim(),
    /* 展示前统一补单位：用户没来得及失焦也能得到「35mm / f/1.4 / ISO 64」 */
    params: [
      normalizeInfoField('focal', info.focal),
      normalizeInfoField('aperture', info.aperture),
      normalizeInfoField('shutter', info.shutter),
      normalizeInfoField('iso', info.iso),
    ].filter(Boolean),
  };
}

/* ── Canvas 基础绘制工具 ──────────────────────────────────── */

function roundRectPath(ctx, x, y, w, h, r) {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, rr);
    return;
  }
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}

/* 逐字绘制以模拟 letter-spacing（Canvas 的 letterSpacing 兼容性不足） */
function trackedWidth(ctx, text, track) {
  let w = 0;
  for (const ch of text) w += ctx.measureText(ch).width + track;
  return Math.max(0, w - track);
}

function fillTracked(ctx, text, x, y, track) {
  let cx = x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + track;
  }
}

/** 字号过大时等比缩小，保证一行放得下 */
function fitFontSize(ctx, text, maxW, family, weight, start, trackRatio = 0, measureFn) {
  let size = start;
  for (let i = 0; i < 24 && size > 8; i += 1) {
    ctx.font = `${weight} ${size}px ${family}`;
    const w = measureFn ? measureFn(ctx, text, size * trackRatio) : ctx.measureText(text).width;
    if (w <= maxW) break;
    size *= 0.94;
  }
  return size;
}

/* ── 背景：由照片生成的模糊色场 ───────────────────────────── */

/**
 * 原图预缩放：导出最大 4K 时照片区约 2400px 宽，长边 2600 足够，
 * 但比 6000px 原图省掉大量降采样开销（拖动滑块时才跟得上）。
 */
function downscaleImage(img, maxSide) {
  const nw = img.naturalWidth || img.width;
  const nh = img.naturalHeight || img.height;
  const k = Math.min(1, maxSide / Math.max(nw, nh));
  if (k >= 1) return img;

  const w = Math.max(1, Math.round(nw * k));
  const h = Math.max(1, Math.round(nh * k));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, w, h);
  return canvas;
}

/** 生成 16:9 的极小缩略图，绘制时放大即得到柔和的模糊底 */
function buildBackdrop(img, nw, nh) {
  const w = 320;
  const h = Math.round(w / CARD_RATIO);
  const sRatio = nw / nh;

  let sw, sh, sx, sy;
  if (sRatio > CARD_RATIO) {
    sh = nh; sw = sh * CARD_RATIO;
    sx = (nw - sw) / 2; sy = 0;
  } else {
    sw = nw; sh = sw / CARD_RATIO;
    sx = 0; sy = (nh - sh) * 0.42;   // 偏上取样，避免把主体裁掉太多
  }

  // 两段降采样，减少直接大比例缩放的锯齿
  const midW = Math.min(sw, 900);
  const midH = Math.max(1, Math.round(midW / CARD_RATIO));
  const mid = document.createElement('canvas');
  mid.width = midW; mid.height = midH;
  const mg = mid.getContext('2d');
  mg.imageSmoothingEnabled = true;
  mg.imageSmoothingQuality = 'high';
  mg.drawImage(img, sx, sy, sw, sh, 0, 0, midW, midH);

  const out = document.createElement('canvas');
  out.width = w; out.height = h;
  const og = out.getContext('2d');
  og.imageSmoothingEnabled = true;
  og.imageSmoothingQuality = 'high';
  og.drawImage(mid, 0, 0, midW, midH, 0, 0, w, h);
  return out;
}

/* 背景图层缓存：拖动滑块时只重画一次模糊，避免每帧重复做整屏高斯 */
let backdropLayer = null;

/* 背景层按半分辨率构建再放大：它本身就是模糊色场，肉眼看不出差别，
   但高斯模糊的开销降到 1/4，拖「背景模糊」滑块才跟得上手。 */
const BACKDROP_SCALE = 0.5;

function buildBackdropLayer(W, H, backdrop, u, adj) {
  const lw = Math.max(2, Math.round(W * BACKDROP_SCALE));
  const lh = Math.max(2, Math.round(H * BACKDROP_SCALE));
  const canvas = document.createElement('canvas');
  canvas.width = lw;
  canvas.height = lh;
  const ctx = canvas.getContext('2d');
  const over = 0.06;

  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  if (SUPPORTS_CANVAS_FILTER) {
    /* 低饱和 + 压暗：背景只负责烘托，不与照片争夺注意力 */
    const blurPx = 26 * u * adj.blur * BACKDROP_SCALE;
    const bright = 0.62 * adj.brightness;
    ctx.filter = `blur(${blurPx.toFixed(2)}px) saturate(0.5) brightness(${bright.toFixed(3)})`;
  }
  ctx.drawImage(
    backdrop,
    -lw * over, -lh * over,
    lw * (1 + over * 2), lh * (1 + over * 2)
  );
  ctx.restore();

  /* 再压一层暖黑，让整块背景统一 */
  ctx.fillStyle = 'rgba(14, 10, 8, 0.46)';
  ctx.fillRect(0, 0, lw, lh);

  /* 暗角 */
  const g = ctx.createRadialGradient(
    lw * 0.5, lh * 0.45, Math.min(lw, lh) * 0.08,
    lw * 0.5, lh * 0.45, Math.max(lw, lh) * 0.76
  );
  g.addColorStop(0, 'rgba(0, 0, 0, 0)');
  g.addColorStop(0.55, 'rgba(0, 0, 0, 0.18)');
  g.addColorStop(1, 'rgba(0, 0, 0, 0.58)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, lw, lh);

  return canvas;
}

function getBackdropLayer(W, H, backdrop, u, adj) {
  const key = `${W}x${H}|${adj.blur.toFixed(3)}|${adj.brightness.toFixed(3)}`;
  if (backdropLayer && backdropLayer.key === key && backdropLayer.src === backdrop) {
    return backdropLayer.canvas;
  }
  const canvas = buildBackdropLayer(W, H, backdrop, u, adj);
  backdropLayer = { key, src: backdrop, canvas };
  return canvas;
}

/* ── 照片本体：圆角 + 柔和阴影 ───────────────────────────── */

/**
 * 照片块（阴影 + 圆角裁剪 + 亮边）离屏缓存。
 * 拖动滑块时若照片几何没变，直接贴图，避免每帧重做阴影与大幅降采样。
 */
let photoLayer = null;

function buildPhotoLayer(img, w, h, r, u) {
  const blur = 52 * u;
  const dy = 22 * u;
  const pad = Math.ceil(blur * 1.7 + dy);

  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(w + pad * 2);
  canvas.height = Math.ceil(h + pad * 2);
  const ctx = canvas.getContext('2d');
  const x = pad;
  const y = pad;

  /* 两层阴影：大范围环境光 + 贴身的接触阴影 */
  const casts = [
    { blur, dy, alpha: 0.5 },
    { blur: 14 * u, dy: 6 * u, alpha: 0.4 },
  ];
  for (const c of casts) {
    ctx.save();
    ctx.shadowColor = `rgba(0, 0, 0, ${c.alpha})`;
    ctx.shadowBlur = c.blur;
    ctx.shadowOffsetY = c.dy;
    ctx.fillStyle = '#000';
    roundRectPath(ctx, x, y, w, h, r);
    ctx.fill();
    ctx.restore();
  }

  ctx.save();
  roundRectPath(ctx, x, y, w, h, r);
  ctx.clip();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, x, y, w, h);
  ctx.restore();

  /* 极细的亮边，用于把照片从背景中"托"出来 */
  ctx.save();
  roundRectPath(ctx, x + 0.5, y + 0.5, w - 1, h - 1, r);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.10)';
  ctx.lineWidth = Math.max(1, 1.1 * u);
  ctx.stroke();
  ctx.restore();

  return { canvas, pad };
}

function drawPhoto(ctx, img, x, y, w, h, r, u) {
  const key = `${Math.round(w)}x${Math.round(h)}|${r.toFixed(1)}|${u.toFixed(3)}`;
  if (!photoLayer || photoLayer.key !== key || photoLayer.src !== img) {
    photoLayer = { key, src: img, ...buildPhotoLayer(img, w, h, r, u) };
  }
  ctx.drawImage(photoLayer.canvas, x - photoLayer.pad, y - photoLayer.pad);
}

function drawLogo(ctx, logo, left, centerY, inkH) {
  const scale = inkH / logo.ink.h;
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(
    logo.canvas,
    left - logo.ink.x * scale,
    centerY - inkH / 2 - logo.ink.y * scale,
    logo.canvas.width * scale,
    logo.canvas.height * scale
  );
  ctx.restore();
}

/* ── 布局 A：横向照片（照片在上，信息在下） ───────────────── */

function paintLandscape(ctx, W, H, u, scene, hasInfo) {
  const { img, meta } = scene;
  const adj = scene.adjust;
  const ratio = scene.imgW / scene.imgH;
  const textK = adj.text;
  const spaceK = adj.spacing;

  const modelSize = Math.round(44 * u * textK);
  const lensSize = Math.round(19 * u * textK);
  const paramSize = Math.round(24 * u * textK);
  const logoInk = 30 * u * textK;
  const logoGap = 18 * u * spaceK;
  const gapPhotoInfo = 56 * u * spaceK;
  const paramTrack = 0.13 * paramSize * adj.tracking;
  const lensTrack = 0.14 * lensSize * adj.tracking;

  /* — 测量 — */
  let logoW = 0;
  if (scene.logo) logoW = logoInk * (scene.logo.ink.w / scene.logo.ink.h);

  let modelW = 0;
  if (hasInfo && meta.model) {
    ctx.font = `400 ${modelSize}px ${FONT_SERIF}`;
    modelW = ctx.measureText(meta.model).width;
  }
  const rowW = logoW + (logoW && modelW ? logoGap : 0) + modelW;
  const rowH = Math.max(logoInk, modelSize * 0.98);

  const lensText = meta.lens ? meta.lens.toUpperCase() : '';
  const paramText = meta.params.join(' · ');
  let lenW = 0;
  if (lensText) {
    ctx.font = `400 ${lensSize}px ${FONT_SANS}`;
    lenW = trackedWidth(ctx, lensText, lensTrack);
  }
  let paramW = 0;
  if (paramText) {
    ctx.font = `300 ${paramSize}px ${FONT_SANS}`;
    paramW = trackedWidth(ctx, paramText, paramTrack);
  }

  /* 信息区总高度（与后面逐段绘制保持一致） */
  const hLensBlock = lensText ? 13 * u * spaceK + lensSize * 1.15 : 0;
  const hParamBlock = paramText ? 16 * u * spaceK + paramSize * 1.1 : 0;
  const infoH = (rowW ? rowH : 0) + hLensBlock + hParamBlock;

  /* — 照片尺寸：等比缩放，完整收录 — */
  const boxW = W * 0.63 * adj.photo;
  const boxH = H * (hasInfo ? 0.65 : 0.78) * adj.photo;
  let pw = boxW;
  let ph = pw / ratio;
  if (ph > boxH) { ph = boxH; pw = ph * ratio; }

  /* 放大到极限时按安全区回缩，保证信息区始终完整可见 */
  const safeH = H * 0.94;
  let totalH = ph + (hasInfo ? gapPhotoInfo + infoH : 0);
  if (totalH > safeH) {
    ph = Math.max(H * 0.2, ph - (totalH - safeH));
    pw = ph * ratio;
    totalH = ph + (hasInfo ? gapPhotoInfo + infoH : 0);
  }

  const top = (H - totalH) / 2;
  const px = (W - pw) / 2;
  const radius = Math.max(0, adj.radius * u);

  drawPhoto(ctx, img, px, top, pw, ph, radius, u);
  if (!hasInfo) return;

  /* — 信息区：整体与照片同宽居中 —— */
  const cx = W / 2;
  let cy = top + ph + gapPhotoInfo;

  if (rowW) {
    const rowCY = cy + rowH / 2;
    if (logoW) drawLogo(ctx, scene.logo, cx - rowW / 2, rowCY, logoInk);
    if (modelW) {
      ctx.font = `400 ${modelSize}px ${FONT_SERIF}`;
      ctx.fillStyle = IVORY;
      ctx.textBaseline = 'alphabetic';
      ctx.textAlign = 'left';
      ctx.fillText(meta.model, cx - rowW / 2 + logoW + (logoW ? logoGap : 0), rowCY + modelSize * 0.35);
    }
    cy += rowH;
  }

  ctx.textAlign = 'left';
  if (lensText) {
    cy += 13 * u * spaceK;
    ctx.font = `400 ${lensSize}px ${FONT_SANS}`;
    ctx.fillStyle = IVORY_FAINT;
    ctx.textBaseline = 'alphabetic';
    fillTracked(ctx, lensText, cx - lenW / 2, cy + lensSize * 0.82, lensTrack);
    cy += lensSize * 1.15;
  }

  if (paramText) {
    cy += 16 * u * spaceK;
    ctx.font = `300 ${paramSize}px ${FONT_SANS}`;
    ctx.fillStyle = IVORY_SOFT;
    ctx.textBaseline = 'middle';
    fillTracked(ctx, paramText, cx - paramW / 2, cy + paramSize * 0.55, paramTrack);
  }
}

/* ── 布局 B：纵向照片（信息在左，照片在右） ───────────────── */

function paintPortrait(ctx, W, H, u, scene) {
  const { img, meta } = scene;
  const adj = scene.adjust;
  const ratio = scene.imgW / scene.imgH;
  const textK = adj.text;
  const spaceK = adj.spacing;

  const modelMax = Math.round(50 * u * textK);
  const lensSize = Math.round(20 * u * textK);
  const paramSize = Math.round(25 * u * textK);
  const logoInk = 29 * u * textK;
  const gapX = 84 * u * spaceK;
  const paramTrack = 0.12 * paramSize * adj.tracking;
  const lensTrack = 0.14 * lensSize * adj.tracking;

  /* — 照片尺寸 — */
  const boxW = W * 0.46 * adj.photo;
  const boxH = Math.min(H * 0.87 * adj.photo, H * 0.93);
  let ph = boxH;
  let pw = ph * ratio;
  if (pw > boxW) { pw = boxW; ph = pw / ratio; }

  /* — 信息列可用宽度（同时用来限制字号） — */
  const infoMaxW = W * 0.28;

  let logoW = 0;
  if (scene.logo) logoW = logoInk * (scene.logo.ink.w / scene.logo.ink.h);

  const modelSize = meta.model
    ? fitFontSize(ctx, meta.model, infoMaxW, FONT_SERIF, 400, modelMax)
    : 0;

  let modelW = 0;
  if (meta.model) {
    ctx.font = `400 ${modelSize}px ${FONT_SERIF}`;
    modelW = ctx.measureText(meta.model).width;
  }

  const lensText = meta.lens ? meta.lens.toUpperCase() : '';
  let lensW = 0;
  if (lensText) {
    ctx.font = `400 ${lensSize}px ${FONT_SANS}`;
    lensW = Math.min(infoMaxW, trackedWidth(ctx, lensText, lensTrack));
  }

  const lines = meta.params;
  let paramW = 0;
  if (lines.length) {
    ctx.font = `300 ${paramSize}px ${FONT_SANS}`;
    for (const line of lines) paramW = Math.max(paramW, trackedWidth(ctx, line, paramTrack));
  }

  const infoW = Math.max(logoW, modelW, lensW, paramW);

  /* 参数行之间的行距同时受「文字大小」和「元素间距」影响 */
  const lineH = paramSize * 1.83 * spaceK;

  /* 放大到极限时按安全区回缩 */
  const safeW = W * 0.95;
  let totalW = infoW + (infoW ? gapX : 0) + pw;
  if (totalW > safeW) {
    pw = Math.max(W * 0.12, safeW - infoW - gapX);
    ph = pw / ratio;
    totalW = infoW + (infoW ? gapX : 0) + pw;
  }

  const left = (W - totalW) / 2;
  const photoX = left + infoW + (infoW ? gapX : 0);
  const photoY = (H - ph) / 2;
  const radius = Math.max(0, adj.radius * u);

  drawPhoto(ctx, img, photoX, photoY, pw, ph, radius, u);

  /* — 左侧信息块：垂直居中于照片 — */
  const hasLogo = Boolean(scene.logo);
  const hasModel = Boolean(meta.model);
  const hasLens = Boolean(lensText);
  const hasParams = lines.length > 0;

  const hGap1 = hasLogo && (hasModel || hasLens) ? 22 * u * spaceK : 0;
  const hModelBlock = hasModel ? modelSize * 1.02 : 0;
  const hGap2 = (hasLogo || hasModel) && hasLens ? 15 * u * spaceK : 0;
  const hLensBlock = hasLens ? lensSize * 1.2 : 0;
  const ruleGap = 30 * u * spaceK;
  const hRuleBlock = hasParams ? ruleGap + Math.max(1, u) + ruleGap : 0;
  const hParamsBlock = hasParams ? (lines.length - 1) * lineH + paramSize * 1.2 : 0;

  const blockH = (hasLogo ? logoInk : 0) + hGap1 + hModelBlock + hGap2
    + hLensBlock + hRuleBlock + hParamsBlock;

  let y = photoY + ph / 2 - blockH / 2;

  if (hasLogo) {
    drawLogo(ctx, scene.logo, left, y + logoInk / 2, logoInk);
    y += logoInk;
  }
  y += hGap1;

  if (hasModel) {
    ctx.font = `400 ${modelSize}px ${FONT_SERIF}`;
    ctx.fillStyle = IVORY;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(meta.model, left, y + modelSize * 0.78);
    y += hModelBlock;
  }
  y += hGap2;

  if (hasLens) {
    ctx.font = `400 ${lensSize}px ${FONT_SANS}`;
    ctx.fillStyle = IVORY_FAINT;
    ctx.textBaseline = 'alphabetic';
    fillTracked(ctx, lensText, left, y + lensSize * 0.85, lensTrack);
    y += hLensBlock;
  }

  if (hasParams) {
    y += ruleGap;
    const ruleW = 72 * u;
    ctx.fillStyle = 'rgba(244, 236, 226, 0.34)';
    ctx.fillRect(left, y, ruleW, Math.max(1, u));
    y += Math.max(1, u) + ruleGap;

    ctx.font = `300 ${paramSize}px ${FONT_SANS}`;
    ctx.fillStyle = IVORY_SOFT;
    ctx.textBaseline = 'alphabetic';
    lines.forEach((line) => {
      fillTracked(ctx, line, left, y + paramSize * 0.8, paramTrack);
      y += lineH;
    });
  }
}

/* ── 主绘制入口 ───────────────────────────────────────────── */

function paintCard(ctx, W, H, scene, options) {
  const opts = options || {};
  const u = H / DESIGN_HEIGHT;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, W, H);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  /* 背景层（模糊 + 压暗 + 暗角）可缓存，导出时按目标尺寸现算 */
  const layer = opts.noCache
    ? buildBackdropLayer(W, H, scene.backdrop, u, scene.adjust)
    : getBackdropLayer(W, H, scene.backdrop, u, scene.adjust);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(layer, 0, 0, W, H);

  const ratio = scene.imgW / scene.imgH;
  const hasInfo = Boolean(scene.logo || scene.meta.model || scene.meta.params.length || scene.meta.lens);

  if (ratio < PORTRAIT_RATIO) {
    if (hasInfo) paintPortrait(ctx, W, H, u, scene);
    else paintLandscape(ctx, W, H, u, scene, false);
  } else {
    paintLandscape(ctx, W, H, u, scene, hasInfo);
  }
  ctx.restore();
}

/* ── LOGO：加载 → 裁剪墨迹 → 统一着色 ─────────────────────── */

const logoCache = new Map();

function rasterizeLogo(svgText) {
  /* 注入明确的宽高，避免部分浏览器对 <img> 里 SVG 的固有尺寸判定为 0 */
  let svg = svgText
    .replace(/<\?xml[^>]*\?>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\swidth="[^"]*"/i, '')
    .replace(/\sheight="[^"]*"/i, '');

  const vb = svg.match(/viewBox="([\d.\-\s]+)"/i);
  const num = vb ? vb[1].trim().split(/[\s,]+/).map(Number) : [0, 0, 400, 100];
  const vbW = num[2] || 400;
  const vbH = num[3] || 100;
  const targetH = 200;
  const targetW = Math.round((targetH * vbW) / vbH);

  svg = svg.replace(/<svg/i, `<svg width="${targetW}" height="${targetH}"`);
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new ShareError('LOGO 解析失败'));
    img.src = url;
  });
}

/** 用 alpha 通道重新着色为统一的象牙白，并返回墨迹包围盒 */
function tintLogo(img, color) {
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  if (!w || !h) throw new ShareError('LOGO 尺寸异常');

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const g = canvas.getContext('2d');
  g.drawImage(img, 0, 0, w, h);

  let ink = { x: 0, y: 0, w, h };
  try {
    const data = g.getImageData(0, 0, w, h).data;
    let x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        if (data[(y * w + x) * 4 + 3] > 20) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
      }
    }
    if (x1 >= x0 && y1 >= y0) ink = { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
  } catch (e) {
    /* 读像素失败就退回整块画布范围 */
  }

  g.globalCompositeOperation = 'source-in';
  g.fillStyle = color;
  g.fillRect(0, 0, w, h);

  return { canvas, ink };
}

function loadLogo(brandId) {
  if (!brandId || !LOGO_FILES[brandId]) return Promise.resolve(null);
  if (logoCache.has(brandId)) return logoCache.get(brandId);

  const task = (async () => {
    const res = await fetch(LOGO_FILES[brandId], { cache: 'force-cache' });
    if (!res.ok) throw new ShareError('LOGO 加载失败');
    const svg = await res.text();
    const img = await rasterizeLogo(svg);
    return tintLogo(img, IVORY);
  })().catch(() => null);

  logoCache.set(brandId, task);
  return task;
}

/* ── 网络：带进度的高清原图获取 ──────────────────────────── */

async function fetchBlobWithProgress(url, signal, onProgress) {
  const res = await fetch(url, {
    signal,
    mode: 'cors',
    credentials: 'omit',
    cache: 'force-cache',
    referrerPolicy: 'no-referrer',
  });
  if (!res.ok) {
    const err = new ShareError(`高清原图请求失败（HTTP ${res.status}）。`);
    err.status = res.status;
    throw err;
  }

  const total = Number(res.headers.get('content-length')) || 0;
  const type = res.headers.get('content-type') || 'image/jpeg';

  if (!res.body || typeof res.body.getReader !== 'function') {
    const blob = await res.blob();
    onProgress(blob.size, blob.size || total);
    return blob;
  }

  const reader = res.body.getReader();
  const chunks = [];
  let loaded = 0;
  let last = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.length;
    const now = Date.now();
    if (now - last > 90) {
      last = now;
      onProgress(loaded, total);
    }
  }
  onProgress(loaded, total || loaded);
  return new Blob(chunks, { type });
}

/**
 * 等待图片可用。
 * 以 load 事件为准 —— img.decode() 在部分环境（大图 / 无头浏览器）可能长时间不 resolve，
 * 不能作为唯一的完成信号；decode() 仅作为加速的旁路。
 */
function waitForImage(img, timeout = 20000) {
  return new Promise((resolve, reject) => {
    let settled = false;
    let timer = 0;

    const finish = (fn, arg) => {
      if (settled) return;
      settled = true;
      if (timer) window.clearTimeout(timer);
      fn(arg);
    };

    if (img.complete && img.naturalWidth) { finish(resolve); return; }

    timer = window.setTimeout(
      () => finish(reject, new ShareError('高清原图加载超时，请重试。')),
      timeout
    );
    img.addEventListener('load', () => finish(resolve), { once: true });
    img.addEventListener('error', () => finish(reject, new ShareError('高清原图加载失败，文件可能已损坏。')), { once: true });
    if (typeof img.decode === 'function') img.decode().catch(() => {});
  });
}

/* ── 弹窗模板 ─────────────────────────────────────────────── */
const TEMPLATE = `
<div class="share-card__scrim" data-close></div>
<div class="share-card__dialog" role="dialog" aria-modal="true" aria-labelledby="shareCardTitle" tabindex="-1">
  <header class="share-card__head">
    <h2 class="share-card__title" id="shareCardTitle">生成分享卡片</h2>
    <button class="share-card__adjust" type="button" aria-expanded="false" aria-controls="shareCardPanel">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/>
        <circle cx="9" cy="7" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="8" cy="17" r="2"/>
      </svg>
      <span>调整</span>
    </button>
    <button class="share-card__close" type="button" data-close aria-label="关闭分享窗口">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
        <line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>
      </svg>
    </button>
  </header>
  <div class="share-card__body">
    <div class="share-card__stage">
      <div class="share-card__frame">
        <canvas class="share-card__canvas" width="1920" height="1080" role="img" aria-label="分享卡片预览"></canvas>
        <div class="share-card__overlay" data-state="loading">
          <div class="share-card__loader">
            <span class="share-card__spinner" aria-hidden="true"></span>
            <p class="share-card__status" role="status" aria-live="polite">正在获取高清原图…</p>
            <div class="share-card__progress" hidden><span></span></div>
          </div>
          <div class="share-card__error" hidden>
            <p class="share-card__error-title">无法生成分享卡片</p>
            <p class="share-card__error-msg"></p>
            <p class="share-card__error-url"></p>
            <button class="share-card__retry" type="button">重新获取</button>
          </div>
        </div>
      </div>
    </div>
    <aside class="share-card__panel" id="shareCardPanel" aria-label="卡片调整" hidden>
      <div class="share-card__group">
        <h3 class="share-card__group-title">照片信息</h3>
        <label class="share-card__field">
          <span>相机</span>
          <input type="text" data-info="camera" placeholder="如 Nikon D3300" autocomplete="off" spellcheck="false" />
        </label>
        <label class="share-card__field">
          <span>镜头</span>
          <input type="text" data-info="lens" placeholder="可留空" autocomplete="off" spellcheck="false" />
        </label>
        <div class="share-card__field-grid">
          <label class="share-card__field">
            <span>焦距</span>
            <input type="text" data-info="focal" placeholder="105mm" autocomplete="off" spellcheck="false" />
          </label>
          <label class="share-card__field">
            <span>光圈</span>
            <input type="text" data-info="aperture" placeholder="f/5.6" autocomplete="off" spellcheck="false" />
          </label>
          <label class="share-card__field">
            <span>快门</span>
            <input type="text" data-info="shutter" placeholder="1/40s" autocomplete="off" spellcheck="false" />
          </label>
          <label class="share-card__field">
            <span>ISO</span>
            <input type="text" data-info="iso" placeholder="ISO 100" autocomplete="off" spellcheck="false" />
          </label>
        </div>
        <p class="share-card__hint">留空的项目不会出现在卡片上；相机名会自动匹配品牌 LOGO。</p>
      </div>
      <div class="share-card__group">
        <h3 class="share-card__group-title">画面</h3>
        <div class="share-card__ranges"></div>
      </div>
      <div class="share-card__panel-foot">
        <button class="share-card__reset" type="button">恢复默认</button>
      </div>
    </aside>
  </div>
  <footer class="share-card__foot">
    <label class="share-card__size">
      <span>导出尺寸</span>
      <span class="share-card__select">
        <select aria-label="导出尺寸"></select>
        <svg class="share-card__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </span>
    </label>
    <button class="share-card__download" type="button">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M4 20h16"/>
      </svg>
      <span class="share-card__download-label">下载图片</span>
    </button>
  </footer>
</div>`;

/* ── 分享卡片控制器 ───────────────────────────────────────── */

export function initShareCard(options = {}) {
  const getPhoto = typeof options.getPhoto === 'function' ? options.getPhoto : () => null;

  const root = document.createElement('div');
  root.className = 'share-card';
  root.hidden = true;
  root.innerHTML = TEMPLATE;
  document.body.appendChild(root);

  const $ = (sel) => root.querySelector(sel);
  const el = {
    scrim: $('.share-card__scrim'),
    dialog: $('.share-card__dialog'),
    stage: $('.share-card__stage'),
    frame: $('.share-card__frame'),
    canvas: $('.share-card__canvas'),
    overlay: $('.share-card__overlay'),
    loader: $('.share-card__loader'),
    status: $('.share-card__status'),
    progress: $('.share-card__progress'),
    progressBar: $('.share-card__progress span'),
    error: $('.share-card__error'),
    errorMsg: $('.share-card__error-msg'),
    errorUrl: $('.share-card__error-url'),
    retry: $('.share-card__retry'),
    size: $('.share-card__size select'),
    download: $('.share-card__download'),
    downloadLabel: $('.share-card__download-label'),
    adjustBtn: $('.share-card__adjust'),
    panel: $('.share-card__panel'),
    ranges: $('.share-card__ranges'),
    reset: $('.share-card__reset'),
    infoInputs: Array.from(root.querySelectorAll('[data-info]')),
  };

  const ctx = el.canvas.getContext('2d');

  EXPORT_SIZES.forEach((s, i) => {
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = s.label;
    el.size.appendChild(opt);
  });
  el.size.value = '0';

  /* 状态 */
  let scene = null;
  let objectUrl = null;
  let currentPhoto = null;
  let isOpen = false;
  let loadToken = 0;
  let abortCtrl = null;
  let lastFocused = null;
  let exporting = false;
  let labelTimer = 0;

  /* 可编辑的照片信息与画面参数（引用保持不变，绘制侧直接读取） */
  const info = { camera: '', lens: '', focal: '', aperture: '', shutter: '', iso: '' };
  const adjust = { ...DEFAULT_ADJUST };
  /* 本次会话内按原图地址记住用户的改动，重新打开同一张照片时沿用 */
  const savedSettings = new Map();

  let currentLogoId = '';
  let logoToken = 0;
  let renderRaf = 0;
  let panelOpen = false;

  const photoKey = (photo) => String((photo && (photo.raw || photo.src)) || '');

  /* ── 尺寸自适应：预览始终按 16:9 缩放，不改动导出比例 ── */
  let lastFrameW = 0;

  function fitStage() {
    const style = window.getComputedStyle(el.stage);
    const padX = (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0);
    const padY = (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0);

    const availW = el.stage.clientWidth - padX;
    if (availW <= 0) return;

    /* 窄屏竖排时舞台高度由内容撑开，只按宽度约束（与 CSS 断点保持一致） */
    const stacked = window.matchMedia('(max-width: 720px)').matches && window.innerHeight > 520;
    const innerH = el.stage.clientHeight - padY;
    const availH = stacked || innerH <= 0 ? Infinity : innerH;

    const w = Math.round(Math.min(availW, availH * CARD_RATIO));
    if (w === lastFrameW) return;
    lastFrameW = w;
    el.frame.style.width = `${w}px`;
    el.frame.style.height = `${Math.round(w / CARD_RATIO)}px`;
  }

  const resizeObserver = typeof ResizeObserver !== 'undefined'
    ? new ResizeObserver(() => { if (isOpen) fitStage(); })
    : null;
  if (resizeObserver) resizeObserver.observe(el.stage);

  /* ══ 调整面板 ═══════════════════════════════════════════════ */

  /* 控件由 ADJUSTS 生成，保证「定义一处、面板与绘制同源」 */
  ADJUSTS.forEach((a) => {
    const row = document.createElement('div');
    row.className = 'share-card__range';
    row.innerHTML = `
      <div class="share-card__range-head">
        <span>${a.label}</span>
        <output>${a.def}${a.unit}</output>
      </div>
      <input type="range" min="${a.min}" max="${a.max}" step="${a.step}" value="${a.def}"
             data-adj="${a.key}" aria-label="${a.label}" />`;
    el.ranges.appendChild(row);
  });

  /* 把当前 info / adjust 写回控件 */
  function syncPanelControls() {
    el.infoInputs.forEach((input) => {
      input.value = info[input.dataset.info] || '';
    });
    ADJUSTS.forEach((a) => {
      const input = el.ranges.querySelector(`[data-adj="${a.key}"]`);
      if (!input) return;
      const v = Math.round(adjust[a.key] * a.factor);
      input.value = String(v);
      const out = input.parentElement.querySelector('output');
      if (out) out.textContent = `${v}${a.unit}`;
    });
  }

  /* 预览重绘：合并同一帧内的多次改动 */
  function scheduleRender() {
    if (renderRaf) return;
    renderRaf = window.requestAnimationFrame(() => {
      renderRaf = 0;
      if (scene && isOpen) paintCard(ctx, el.canvas.width, el.canvas.height, scene);
    });
  }

  function persistSettings() {
    if (!currentPhoto) return;
    savedSettings.set(photoKey(currentPhoto), {
      info: { ...info },
      adjust: { ...adjust },
    });
  }

  /* 信息字段变化：先更新画面，再异步补上品牌 LOGO */
  async function applyInfoChanges() {
    if (!scene) return;
    const meta = composeMeta(info);
    scene.meta = meta;

    if (meta.brandId === currentLogoId) {
      scheduleRender();
      persistSettings();
      return;
    }

    /* 品牌变了：先撤掉旧 LOGO，等新的加载好再补，避免短暂显示错误品牌。
       只有品牌变更才会推进 token，普通输入不会打断正在进行的 LOGO 加载。 */
    currentLogoId = meta.brandId;
    const token = (logoToken += 1);
    scene.logo = null;
    scheduleRender();
    persistSettings();

    const logo = await loadLogo(meta.brandId);
    if (token !== logoToken || !scene) return;
    scene.logo = logo;
    scheduleRender();
  }

  function setPanel(open) {
    panelOpen = open;
    el.panel.hidden = !open;
    el.adjustBtn.setAttribute('aria-expanded', String(open));
    el.adjustBtn.classList.toggle('is-active', open);
    if (open) root.setAttribute('data-panel', 'open');
    else root.removeAttribute('data-panel');
    /* 面板占位后预览可用宽度变化，重新量一次 */
    fitStage();
    window.requestAnimationFrame(fitStage);
  }

  el.adjustBtn.addEventListener('click', () => setPanel(!panelOpen));

  el.infoInputs.forEach((input) => {
    input.addEventListener('input', () => {
      info[input.dataset.info] = input.value;
      applyInfoChanges();
    });
    /* 失焦时把「105」这类纯数字补成「105mm」，其它写法保持原样 */
    input.addEventListener('blur', () => {
      const key = input.dataset.info;
      if (key === 'camera' || key === 'lens') { persistSettings(); return; }
      const normalized = normalizeInfoField(key, input.value);
      if (normalized !== input.value) {
        input.value = normalized;
        info[key] = normalized;
        applyInfoChanges();
      }
    });
  });

  el.ranges.addEventListener('input', (e) => {
    const input = e.target;
    const key = input.dataset.adj;
    if (!key) return;
    const conf = ADJUSTS.find((a) => a.key === key);
    if (!conf) return;

    const value = Number(input.value);
    const out = input.parentElement.querySelector('output');
    if (out) out.textContent = `${value}${conf.unit}`;

    adjust[key] = value / conf.factor;
    if (scene) scene.adjust = adjust;
    scheduleRender();
    persistSettings();
  });

  el.reset.addEventListener('click', () => {
    if (!currentPhoto) return;
    Object.assign(info, readPhotoInfo(currentPhoto));
    Object.assign(adjust, DEFAULT_ADJUST);
    savedSettings.delete(photoKey(currentPhoto));
    if (scene) scene.adjust = adjust;
    syncPanelControls();
    applyInfoChanges();
  });

  /* ── 加载态 / 错误态 ── */
  function setStatus(text) {
    el.status.textContent = text;
  }

  function showLoading(text, percent) {
    el.overlay.dataset.state = 'loading';
    el.loader.hidden = false;
    el.error.hidden = true;
    setStatus(text);
    if (typeof percent === 'number' && percent > 0) {
      el.progress.hidden = false;
      el.progressBar.style.width = `${Math.min(100, Math.round(percent))}%`;
    } else {
      el.progress.hidden = true;
      el.progressBar.style.width = '0%';
    }
    el.download.disabled = true;
  }

  function showError(message, detail, url) {
    el.overlay.dataset.state = 'error';
    el.loader.hidden = true;
    el.error.hidden = false;
    el.errorMsg.textContent = message;
    el.errorUrl.textContent = url ? `${detail ? `${detail}\n` : ''}${url}` : (detail || '');
    el.errorUrl.style.whiteSpace = 'pre-wrap';
    el.download.disabled = true;
  }

  function hideOverlay() {
    el.overlay.dataset.state = 'ready';
  }

  /* ── 资源释放 ── */
  function releaseScene() {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }
    scene = null;
    /* 离屏缓存（背景层 / 照片块）也一起释放，避免长期占用内存 */
    photoLayer = null;
    backdropLayer = null;
  }

  /* ── 字体：导出前确保已加载，避免回退字体造成预览/导出不一致 ──
     字体 CDN 卡住时不能阻塞出图，超时后退回 CSS 声明的回退字体。 */
  function withTimeout(promise, ms) {
    return Promise.race([
      promise.catch(() => {}),
      new Promise((resolve) => { window.setTimeout(resolve, ms); }),
    ]);
  }

  async function ensureFonts() {
    if (!document.fonts || !document.fonts.load) return;
    const work = (async () => {
      await Promise.all([
        document.fonts.load('400 40px "Cormorant Garamond"'),
        document.fonts.load('300 24px "Outfit"'),
        document.fonts.load('400 24px "Outfit"'),
      ]);
      await document.fonts.ready;
    })();
    await withTimeout(work, 2500);
  }

  /* ── 主流程：取高清原图 → 解码 → 渲染 ── */
  async function load(photo) {
    const token = (loadToken += 1);
    if (abortCtrl) abortCtrl.abort();
    const ctrl = new AbortController();
    abortCtrl = ctrl;

    currentPhoto = photo;
    const url = String(photo.raw || photo.src || '').trim();

    showLoading('正在获取高清原图…');

    if (!url || url === '#') {
      showError('这张照片没有可用的高清原图链接。', '', '');
      return;
    }

    try {
      const blob = await fetchBlobWithProgress(url, ctrl.signal, (loaded, total) => {
        if (token !== loadToken) return;
        if (total > 0) {
          const pct = (loaded / total) * 100;
          setStatus(`正在获取高清原图… ${Math.min(99, Math.round(pct))}%`);
          el.progress.hidden = false;
          el.progressBar.style.width = `${Math.min(99, pct)}%`;
        } else {
          const mb = (loaded / 1048576).toFixed(1);
          setStatus(`正在获取高清原图… ${mb} MB`);
        }
      });

      if (token !== loadToken) return;

      setStatus('正在解码照片…');
      el.progress.hidden = true;

      const img = new Image();
      img.decoding = 'async';
      const nextUrl = URL.createObjectURL(blob);
      img.src = nextUrl;

      try {
        await waitForImage(img, 20000);
      } catch (e) {
        URL.revokeObjectURL(nextUrl);
        throw e instanceof ShareError ? e : new ShareError('高清原图解码失败，文件可能已损坏。');
      }
      if (token !== loadToken) {
        URL.revokeObjectURL(nextUrl);
        return;
      }
      if (!img.naturalWidth || !img.naturalHeight) {
        URL.revokeObjectURL(nextUrl);
        throw new ShareError('高清原图尺寸异常，无法生成卡片。');
      }

      /* 登记资源，保证任何后续失败都能在关闭时释放 */
      releaseScene();
      objectUrl = nextUrl;

      setStatus('正在生成卡片…');

      /* 有本次会话内的改动就沿用，否则从照片数据里取初始值 */
      const saved = savedSettings.get(photoKey(photo));
      Object.assign(info, saved ? saved.info : readPhotoInfo(photo));
      Object.assign(adjust, saved ? saved.adjust : DEFAULT_ADJUST);
      syncPanelControls();

      const meta = composeMeta(info);
      currentLogoId = meta.brandId;
      const assets = await withTimeout(Promise.all([loadLogo(meta.brandId), ensureFonts()]), 4000);
      const logo = (assets && assets[0]) || null;   // LOGO 失败/超时则不显示，不影响出图
      if (token !== loadToken) return;

      /* 预缩放一次，后续每帧绘制都便宜很多 */
      const working = downscaleImage(img, 2600);
      const imgW = working.naturalWidth || working.width;
      const imgH = working.naturalHeight || working.height;

      scene = {
        img: working,
        imgW,
        imgH,
        backdrop: buildBackdrop(working, imgW, imgH),
        meta,
        logo,
        adjust,
      };

      el.canvas.setAttribute('aria-label', `${photo.title || '照片'} 的分享卡片预览`);
      paintCard(ctx, el.canvas.width, el.canvas.height, scene);
      hideOverlay();
      el.download.disabled = false;
    } catch (err) {
      if (err && err.name === 'AbortError') return;
      if (token !== loadToken) return;
      const { message, detail } = describeError(err);
      showError(message, detail, url);
    }
  }

  function describeError(err) {
    if (err instanceof ShareError) {
      return { message: err.message, detail: '' };
    }
    if (err && err.name === 'TypeError') {
      return {
        message: '无法获取高清原图。',
        detail: '可能是跨域（CORS）限制、网络异常，或该 GitHub 资源暂时不可访问。',
      };
    }
    if (err && err.name === 'SecurityError') {
      return {
        message: '图片受跨域安全策略限制，无法写入画布。',
        detail: '该资源未返回允许跨域的响应头。',
      };
    }
    return { message: '生成分享卡片时出错，请稍后重试。', detail: (err && err.message) || '' };
  }

  /* ── 导出 ── */
  function selectedSize() {
    const idx = Number(el.size.value) || 0;
    return EXPORT_SIZES[idx] || EXPORT_SIZES[0];
  }

  function buildFileName(photo, size) {
    const base = String(photo.raw || photo.src || 'photo').split('?')[0].split('/').pop() || 'photo';
    const stem = base.replace(/\.[a-z0-9]+$/i, '') || 'photo';
    return `${stem}-share-${size.w}x${size.h}.png`;
  }

  function renderToBlob(size) {
    const canvas = document.createElement('canvas');
    canvas.width = size.w;
    canvas.height = size.h;
    const g = canvas.getContext('2d');
    /* 导出按目标尺寸现算背景，不复用预览缓存，避免张冠李戴 */
    paintCard(g, size.w, size.h, scene, { noCache: true });

    return new Promise((resolve, reject) => {
      try {
        canvas.toBlob((blob) => {
          if (!blob) reject(new ShareError('导出的图片为空，请重试。'));
          else resolve(blob);
        }, 'image/png');
      } catch (e) {
        reject(e);
      }
    });
  }

  function saveBlob(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.rel = 'noopener';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  function resetDownloadLabel(delay = 0) {
    window.clearTimeout(labelTimer);
    labelTimer = window.setTimeout(() => {
      if (exporting) return;
      el.downloadLabel.textContent = '下载图片';
      el.download.removeAttribute('data-busy');
    }, delay);
  }

  async function handleDownload() {
    if (exporting || !scene) return;
    exporting = true;
    window.clearTimeout(labelTimer);

    el.download.disabled = true;
    el.download.setAttribute('data-busy', 'true');
    el.download.setAttribute('aria-busy', 'true');
    el.downloadLabel.textContent = '正在生成…';

    try {
      const size = selectedSize();
      const blob = await renderToBlob(size);
      if (!blob || blob.size < 1024) throw new ShareError('导出的图片为空，请重试。');
      saveBlob(blob, buildFileName(currentPhoto || {}, size));
      el.downloadLabel.textContent = '已开始下载';
      exporting = false;
      el.download.disabled = false;
      el.download.removeAttribute('aria-busy');
      resetDownloadLabel(1500);
      return;
    } catch (err) {
      /* 导出失败不覆盖预览，保留卡片让用户可以直接重试 */
      const { message, detail } = describeError(err);
      console.error('[share-card] 导出失败：', message, detail, err);
      exporting = false;
      el.downloadLabel.textContent = '导出失败，点此重试';
      el.download.removeAttribute('data-busy');
      el.download.removeAttribute('aria-busy');
      el.download.disabled = false;
      resetDownloadLabel(2600);
    } finally {
      if (exporting) {
        exporting = false;
        el.download.disabled = false;
        el.download.removeAttribute('aria-busy');
        el.download.removeAttribute('data-busy');
        el.downloadLabel.textContent = '下载图片';
      }
    }
  }

  /* ── 打开 / 关闭 ── */
  function open(photo = getPhoto()) {
    if (!photo) return;
    if (isOpen) close(true);

    lastFocused = document.activeElement;
    isOpen = true;
    root.hidden = false;
    fitStage();

    window.requestAnimationFrame(() => {
      root.classList.add('is-open');
      el.dialog.focus({ preventScroll: true });
      fitStage();
    });

    load(photo);
  }

  function close(immediate = false) {
    if (!isOpen) return;
    isOpen = false;
    root.classList.remove('is-open');
    persistSettings();

    if (abortCtrl) { abortCtrl.abort(); abortCtrl = null; }
    loadToken += 1;

    window.setTimeout(() => {
      if (isOpen) return;
      root.hidden = true;
      releaseScene();
      el.canvas.getContext('2d').clearRect(0, 0, el.canvas.width, el.canvas.height);
      el.overlay.dataset.state = 'loading';
      el.download.disabled = true;
    }, immediate ? 0 : 340);

    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus({ preventScroll: true });
      lastFocused = null;
    }
  }

  /* ── 事件 ── */
  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) close();
  });

  el.retry.addEventListener('click', () => {
    if (currentPhoto) load(currentPhoto);
  });

  el.download.addEventListener('click', handleDownload);

  /* ESC 关闭 + 焦点循环；capture 阶段拦截，避免与详情页的 ESC 冲突 */
  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      close();
      return;
    }

    if (e.key !== 'Tab') return;
    const focusables = Array.from(
      el.dialog.querySelectorAll('button, select, [href], input, [tabindex]:not([tabindex="-1"])')
    ).filter((n) => !n.disabled && n.offsetParent !== null);
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, true);

  /* 窗口尺寸变化时重算预览尺寸（ResizeObserver 兜底之外的场景） */
  window.addEventListener('resize', () => { if (isOpen) fitStage(); }, { passive: true });

  return {
    open,
    close,
    isOpen: () => isOpen,
    refresh: () => { if (isOpen && currentPhoto) load(currentPhoto); },
  };
}
