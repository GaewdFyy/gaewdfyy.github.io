(function () {
  const BANNER_KEY = 'domain_announcement_dismissed';
  
  // 如果已经关闭过，就不显示
  if (localStorage.getItem(BANNER_KEY)) return;

  const banner = document.createElement('div');
  banner.innerHTML = `
    🔔 本站域名即将更换！新域名：<strong>gaewdfyy.top</strong>
    <button id="dismiss-banner"
      style="margin-left:12px; cursor:pointer; background:none; border:1px solid #fff; 
             color:#fff; padding:2px 8px; border-radius:4px;">✕ 不再提示</button>
  `;
  Object.assign(banner.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    background: '#f0a500',
    color: '#fff',
    textAlign: 'center',
    padding: '10px',
    zIndex: '9999',
    fontSize: '14px',
    boxSizing: 'border-box',
  });

  document.body.prepend(banner);

  document.getElementById('dismiss-banner').addEventListener('click', function () {
    localStorage.setItem(BANNER_KEY, 'true');
    banner.remove();
  });
})();