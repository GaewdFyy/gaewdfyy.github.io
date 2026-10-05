/* ══════════════════════════════════════════════════════════════════
   MD3 取色 Worker

   把「图片像素 → 种子色」这段重活挪出主线程。

   官方 sourceColorFromImage 内部做的就两步：
     QuantizerCelebi.quantize(pixels, 128)  →  Score.score(...)  →  取第一名
   但这两步对一张 1920×1080 的照片是几百毫秒级（唯一颜色可达几十万个，
   k-means 要在它们上面迭代），压在渲染线程上界面就会僵住。
   这里在 Worker 里用 OffscreenCanvas 读像素，算法与官方完全一致。

   主线程用法（见 /md3-palette/ 的 extractSeedHex）：
     worker.postMessage({ id, bitmap, m3Url }, [bitmap])
     worker.onmessage → { id, argb } 或 { id, error }

   任何一步不可用（老浏览器没有 OffscreenCanvas、CDN 挂了、导出名变了）
   都只回 error，主线程会自动退回主线程方案，不会把页面搞死。
   ══════════════════════════════════════════════════════════════════ */

// 按地址缓存引擎模块：同一个地址只 import 一次，换地址也不会拿到旧的那个
const engines = new Map();

function loadEngine(url) {
  if (!engines.has(url)) engines.set(url, import(url));
  return engines.get(url);
}

function argbFromRgb(r, g, b) {
  return (0xff000000 | (r << 16) | (g << 8) | b) >>> 0;
}

self.addEventListener('message', async (event) => {
  const data = event.data || {};
  const id = data.id;
  const bitmap = data.bitmap;

  try {
    if (!bitmap) throw new Error('缺少位图');

    const M3 = await loadEngine(data.m3Url);
    // 官方是 class（QuantizerCelebi / Score 都是），别的版本也可能是普通对象，
    // 所以只要求「有 quantize / score 方法」，不卡具体形态
    const quantizer = M3 && M3.QuantizerCelebi;
    const scorer = M3 && M3.Score;
    if (!quantizer || typeof quantizer.quantize !== 'function' ||
        !scorer || typeof scorer.score !== 'function') {
      throw new Error('这个版本的库没导出 QuantizerCelebi.quantize / Score.score');
    }

    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('拿不到 OffscreenCanvas 上下文');

    ctx.drawImage(bitmap, 0, 0);
    if (typeof bitmap.close === 'function') bitmap.close();

    const bytes = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    // ImageData → ARGB 像素数组（半透明像素按白底合成，和官方实现一致）
    const pixels = new Array(bytes.length / 4);
    for (let i = 0, p = 0; i < bytes.length; i += 4, p += 1) {
      let r = bytes[i];
      let g = bytes[i + 1];
      let b = bytes[i + 2];
      const a = bytes[i + 3];
      if (a < 255) {
        const alpha = a / 255;
        r = (1 - alpha) * 255 + alpha * r;
        g = (1 - alpha) * 255 + alpha * g;
        b = (1 - alpha) * 255 + alpha * b;
      }
      pixels[p] = argbFromRgb(Math.round(r), Math.round(g), Math.round(b));
    }

    const quantized = quantizer.quantize(pixels, 128);
    const population = quantized && quantized.colorToCount ? quantized.colorToCount : quantized;
    const ranked = scorer.score(population);
    const argb = ranked && ranked.length ? ranked[0] : null;
    if (typeof argb !== 'number') throw new Error('量化后没得到可用颜色');

    self.postMessage({ id, argb });
  } catch (err) {
    self.postMessage({ id, error: String((err && err.message) || err) });
  }
});
