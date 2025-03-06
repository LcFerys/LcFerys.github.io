function verifyVideoSource(sources) {
  if (!Array.isArray(sources)) {
    console.error('视频源必须为数组，当前为:', typeof sources);
    return false;
  }
  return sources.some(source => 
    source.includes('.mp4') || source.includes('.webm')
  );
}

function loadFullVideo(videoElement) {
  try {
    const rawSources = videoElement.dataset.videoSources;
    const sources = rawSources ? JSON.parse(rawSources) : [];
    console.log('加载视频源:', sources);

    if (verifyVideoSource(sources)) {
      // 替换视频源或加载逻辑
      const sourceElements = sources.map(src => {
        const source = document.createElement('source');
        source.src = src;
        source.type = `video/${src.split('.').pop()}`; // 例如 video/mp4
        return source;
      });
      videoElement.innerHTML = ''; // 清空现有子元素
      sourceElements.forEach(source => videoElement.appendChild(source));
      videoElement.load(); // 重新加载视频
    } else {
      console.warn('无有效视频源，元素ID:', videoElement.id);
    }
  } catch (e) {
    console.error('加载视频失败:', e);
  }
}

// IntersectionObserver 初始化
document.querySelectorAll('.lazy-video').forEach(video => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadFullVideo(entry.target);
        observer.unobserve(entry.target); // 加载后停止观察
      }
    });
  }, { rootMargin: '200px' }); // 提前200px触发加载

  observer.observe(video);
});