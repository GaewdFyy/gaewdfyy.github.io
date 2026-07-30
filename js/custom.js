// 等待页面加载完成
document.addEventListener('DOMContentLoaded', function() {
  const banner = document.getElementById('banner');
  const bannerBg = banner ? banner.querySelector('.full-bg-img') : null;
  const navbar = document.getElementById('navbar');
  const main = document.querySelector('main');
  
  // 强制移除任何可能导致缩放的样式
  if (bannerBg) {
    bannerBg.style.transform = 'none';
    bannerBg.style.webkitTransform = 'none';
    
    // 使用MutationObserver监控并阻止任何transform变化
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'style') {
          const transform = bannerBg.style.transform;
          if (transform && transform !== 'none') {
            bannerBg.style.transform = 'none';
          }
        }
      });
    });
    
    observer.observe(bannerBg, { attributes: true });
  }
  
  // 确保banner和navbar存在
  if (!banner) {
    console.warn('Banner element not found');
    return;
  }
  
  if (!navbar) {
    console.warn('Navbar element not found');
    return;
  }
  
  // 开始监听滚动
  if (banner && navbar) {
    let ticking = false;
    const bannerHeight = window.innerHeight; // 100vh
    
    // 监听滚动事件
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          const scrolled = window.pageYOffset;
          
          // 计算滚动进度（0到1）
          const progress = Math.min(scrolled / bannerHeight, 1);
          
          // 1. 导航栏：滚动超过50px后添加模糊效果
          if (scrolled > 50) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
          
          // 2. Banner效果：虚化
          if (scrolled > 0) {
            // 虚化效果：0-10px
            const blurValue = progress * 10;
            
            // 降低亮度：100% -> 70%
            const brightness = 1 - (progress * 0.3);
            
            // 只对banner应用滤镜
            banner.style.filter = `blur(${blurValue}px) brightness(${brightness})`;
            banner.style.webkitFilter = `blur(${blurValue}px) brightness(${brightness})`;
            
            // 强制确保背景图片不被改变
            if (bannerBg) {
              bannerBg.style.transform = 'none';
              bannerBg.style.webkitTransform = 'none';
            }
            
            // Banner内的文字和遮罩逐渐消失
            const bannerText = banner.querySelector('.banner-text');
            const bannerMask = banner.querySelector('.mask');
            
            if (bannerText) {
              bannerText.style.opacity = 1 - (progress * 1.5);
            }
            
            if (bannerMask) {
              bannerMask.style.opacity = 1 - (progress * 1.5);
            }
          } else {
            // 回到顶部时恢复原状
            banner.style.filter = 'blur(0px) brightness(1)';
            banner.style.webkitFilter = 'blur(0px) brightness(1)';
            
            if (bannerBg) {
              bannerBg.style.transform = 'none';
              bannerBg.style.webkitTransform = 'none';
            }
            
            const bannerText = banner.querySelector('.banner-text');
            const bannerMask = banner.querySelector('.mask');
            
            if (bannerText) {
              bannerText.style.opacity = '1';
            }
            
            if (bannerMask) {
              bannerMask.style.opacity = '1';
            }
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    });
  }
  
  // 平滑滚动到文章列表
  const scrollDownBar = document.querySelector('.scroll-down-bar');
  if (scrollDownBar) {
    scrollDownBar.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    });
    
    // 滚动时隐藏下拉提示
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 100) {
        scrollDownBar.style.opacity = '0';
        scrollDownBar.style.pointerEvents = 'none';
      } else {
        scrollDownBar.style.opacity = '1';
        scrollDownBar.style.pointerEvents = 'auto';
      }
    });
  }
});