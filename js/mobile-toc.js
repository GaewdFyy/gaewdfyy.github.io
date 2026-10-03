(function () {

  'use strict';

  function initMobileTOC() {

    const toggle = document.querySelector('.mobile-toc-toggle');
    const close = document.querySelector('.mobile-toc-close');
    const mask = document.querySelector('.mobile-toc-mask');
    const panel = document.querySelector('.mobile-toc-panel');
    const container = document.querySelector('.mobile-toc-content');

    if (!toggle || !close || !mask || !panel || !container) {
      return;
    }


    /*
     * 找到 Fluid 原本的 TOC
     *
     * Fluid 使用 Tocbot 生成目录，
     * 因此我们直接复用它，不重新生成。
     */

    const originalTOC =
      document.querySelector(
        '.post-toc .tocbot-list'
      ) ||
      document.querySelector(
        '.post-toc'
      );


    if (!originalTOC) {
      return;
    }


    /*
     * clone 一份 TOC
     *
     * 不移动原来的节点，
     * 避免影响 Fluid 自己的 Tocbot。
     */

    const clonedTOC = originalTOC.cloneNode(true);

    container.appendChild(clonedTOC);


    /*
     * 打开目录
     */

    function openTOC() {

      document.body.classList.add(
        'mobile-toc-open'
      );

      toggle.setAttribute(
        'aria-expanded',
        'true'
      );

      panel.setAttribute(
        'aria-hidden',
        'false'
      );

    }


    /*
     * 关闭目录
     */

    function closeTOC() {

      document.body.classList.remove(
        'mobile-toc-open'
      );

      toggle.setAttribute(
        'aria-expanded',
        'false'
      );

      panel.setAttribute(
        'aria-hidden',
        'true'
      );

    }


    toggle.addEventListener(
      'click',
      openTOC
    );


    close.addEventListener(
      'click',
      closeTOC
    );


    mask.addEventListener(
      'click',
      closeTOC
    );


    /*
     * 点击目录中的项目后关闭抽屉
     */

    container.addEventListener(
      'click',
      function (event) {

        const link =
          event.target.closest('a');

        if (!link) {
          return;
        }

        closeTOC();

      }
    );


    /*
     * ESC 关闭
     */

    document.addEventListener(
      'keydown',
      function (event) {

        if (
          event.key === 'Escape' &&
          document.body.classList.contains(
            'mobile-toc-open'
          )
        ) {

          closeTOC();

        }

      }
    );

  }


  /*
   * 页面加载完成
   */

  if (
    document.readyState === 'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      initMobileTOC
    );

  } else {

    initMobileTOC();

  }

})();