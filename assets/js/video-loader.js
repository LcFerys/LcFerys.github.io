// 使用 IntersectionObserver 实现懒加载 (推荐)
function initLazyLoad() {
  // 配置多个仓库基地址（可扩展）
  const repoBases = [
    'https://bgithub.xyz',
    'https://kkgithub.com',
    'https://gitclone.como',
    'https://git.homegu.com',
    'https://github.hscsec.cn',
    'https://github.ur1.fun'
  ];

  // 轮询计数器
  let repoIndex = 0;

  const getNextRepoBase = () => {
    const base = `${repoBases[repoIndex]}/LcFerys/LcFerys.github.io`;
    repoIndex = (repoIndex + 1) % repoBases.length;
    return base;
  };

  // 增强版加载方法
  const loadVideoElement = (target, retryCount = 0) => {
    try {
      const repoBase = getNextRepoBase();
      if (!repoBase) {
        console.error('无可用仓库地址');
        return;
      }

      // 处理两种元素类型
      const isVideoTag = target.tagName === 'VIDEO';
      const originalPath = isVideoTag ?
        target.dataset.src.replace(/^\//, '') :
        target.getAttribute('src').replace(/^\//, '');

      // 构建完整URL
      const fullUrl = new URL(`${repoBase}/${originalPath}`);
      fullUrl.hash = '#t=0.1'; // Safari修复

      // 创建新的source元素
      const source = document.createElement('source');
      source.src = fullUrl.href;
      // source.type = `video/${originalPath.split('.').pop().toLowerCase()}`;
      source.type = `video/mp4`;

      // 获取父级video元素
      const videoElement = target.closest('video');

      // 清空原有内容并插入新元素
      if (isVideoTag) {
        target.innerHTML = '';
        target.appendChild(source);
      } else {
        target.parentElement.replaceChild(source, target);
      }

      // 事件监听器
      const handleSuccess = () => {
        console.log(`视频加载成功: ${fullUrl}`);
        videoElement.setAttribute('data-loaded', 'true');
      };

      const handleError = (e) => {
        console.error(`尝试 ${repoBase} 失败 (重试 ${retryCount + 1}/${repoBases.length * 3})`);

        if (retryCount < repoBases.length * 3 - 1) {
          setTimeout(() => loadVideoElement(target, retryCount + 1), 500);
        } else {
          console.error('所有仓库尝试失败:', fullUrl);
          videoElement.setAttribute('data-error', 'true');
        }
      };

      videoElement.addEventListener('loadeddata', handleSuccess, { once: true });
      videoElement.addEventListener('error', handleError, { once: true });

      videoElement.load();
    } catch (e) {
      console.error('视频处理异常:', e);
    }
  };

  // 观察器配置
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const container = entry.target;

        // 处理两种视频元素
        const videoWithDataSrc = container.querySelector('video[data-src]');
        const sourceWithSrc = container.querySelector('source[src]');

        if (videoWithDataSrc) {
          loadVideoElement(videoWithDataSrc);
        } else if (sourceWithSrc) {
          loadVideoElement(sourceWithSrc);
        }

        observer.unobserve(container);
      }
    });
  }, {
    rootMargin: '200px',
    threshold: 0.1
  });

  // 初始化观察
  document.querySelectorAll('.portfolio-item').forEach(container => {
    observer.observe(container);
  });
}

// 初始化加载（根据需求选择其中一种方式）
window.addEventListener('DOMContentLoaded', () => {
  initLazyLoad(); // 方案1：懒加载
});