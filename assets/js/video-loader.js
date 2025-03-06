const SAFETY_OPTIONS = {
  maxRetries: 3,
  timeout: 10000,
  allowedHosts: ['githubusercontent.com']
};

function verifyVideoSource(src) {
  return SAFETY_OPTIONS.allowedHosts.some(host => src.includes(host));
}

async function loadFullVideo() {
  const videos = document.querySelectorAll('video[data-src]');
  
  for (const video of videos) {
    try {
      if (!verifyVideoSource(video.dataset.src)) {
        console.warn('非法视频源:', video.dataset.src);
        continue;
      }

      const source = video.querySelector('source');
      const realSrc = `${video.dataset.src}?${Date.now()}`; // 防止缓存投毒
      
      // 带超时和重试的加载
      await Promise.race([
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('加载超时')), SAFETY_OPTIONS.timeout)
        ),
        (async () => {
          for (let i = 0; i < SAFETY_OPTIONS.maxRetries; i++) {
            try {
              source.src = `${realSrc}#t=0.1`;
              video.load();
              await video.play();
              return;
            } catch (error) {
              if (i === SAFETY_OPTIONS.maxRetries - 1) throw error;
              await new Promise(res => setTimeout(res, 2000 * (i + 1)));
            }
          }
        })()
      ]);
      
      video.setAttribute('data-loaded', 'true');
    } catch (error) {
      console.error('视频加载失败:', error);
      video.parentElement.innerHTML = `<div class="video-error">视频加载失败，请<a href="${video.dataset.src}" rel="noopener noreferrer">点击下载</a></div>`;
    }
  }
}

// 使用 Intersection Observer 替代 scroll 事件
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadFullVideo();
      observer.unobserve(entry.target);
    }
  });
});

document.querySelectorAll('video').forEach(video => observer.observe(video));