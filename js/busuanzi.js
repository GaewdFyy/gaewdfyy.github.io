// 等不蒜子加载完再执行
window.onload = function () {
  setTimeout(function () {
    var pv = document.getElementById('busuanzi_value_site_pv');
    var uv = document.getElementById('busuanzi_value_site_uv');

    // 把这里换成你旧域名的历史数据
    var OLD_PV = 4414;
    var OLD_UV = 2890;

    if (pv) pv.innerText = parseInt(pv.innerText || 0) + OLD_PV;
    if (uv) uv.innerText = parseInt(uv.innerText || 0) + OLD_UV;
  }, 1500); // 等不蒜子异步加载完
};