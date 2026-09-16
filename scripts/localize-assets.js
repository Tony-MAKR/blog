/* global hexo */
'use strict';

/**
 * 把主题里指向国外免费资源库（unpkg.com）的文件，改为使用本站自带的副本。
 *
 * 【为什么要这么做】
 * 主题默认从国外网站加载「图表库」和「图片放大库」。国内访问这些国外地址
 * 实测需要 20 秒以上，甚至直接超时，访客打开文章时会长时间卡在空白页。
 *
 * 【这个脚本在网页生成后自动做两件事】
 * 1. 把国外地址换成本站地址
 *    —— 相关文件已下载到 source/lib/ 里，会随网站一起发布
 * 2. 页面里没有流程图时，不加载 2.7 MB 的图表库
 *    —— 一篇纯文字的文章不需要为图表付出等待代价
 */

// 图片放大库在本站的存放位置（与原始文件结构保持一致）
const LIGHTGALLERY_DIR = 'lib/lightgallery/';
// 图表库在本站的存放位置
const MERMAID_FILE = 'lib/mermaid/mermaid.min.js';

/**
 * 生成站内地址。会自动带上网站的子目录前缀
 * （比如网站放在 /blog/ 下时，返回 /blog/lib/...）
 */
function urlFor(path) {
  const root = hexo.config.root || '/';
  const base = root.endsWith('/') ? root : root + '/';
  return base + String(path).replace(/^\//, '');
}

hexo.extend.filter.register('after_render:html', function (html) {
  // ---- 1. 图片放大库：国外地址 -> 本站地址 ----
  html = html.replace(
    /(?:https?:)?\/\/unpkg\.com\/lightgallery@[\d.]+\//g,
    urlFor(LIGHTGALLERY_DIR)
  );

  // ---- 2. 图表库：只在页面里真的有流程图时加载 ----
  // 主题把流程图代码块渲染成 <code class="hljs mermaid">，据此判断
  if (/hljs mermaid/.test(html)) {
    const inject =
      '<script defer src="' + urlFor(MERMAID_FILE) + '"></script>' +
      '<script>window.addEventListener("DOMContentLoaded",function(){' +
      'if(window.mermaid&&typeof code!=="undefined")code.paintMermaid();' +
      '});</script>';
    html = html.replace(/<\/body>/i, inject + '</body>');
  }

  return html;
});
