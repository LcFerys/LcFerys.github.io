function loadFullVideo() {
  const videos = document.querySelectorAll('video[data-src]');
  videos.forEach(video => {
    // 修改为绝对路径（添加仓库名前缀）
    const repoName = 'https://cdn.jsdelivr.net/gh/LcFerys/LcFerys.github.io@latest'; // 根据实际仓库名修改
    const src = `${repoName}/${video.dataset.src}`;
    console.log('src:', src);
    
    // 添加时间锚点避免Safari的Range请求问题
    video.querySelector('source').src = `${src}`;
    video.load();

    // 添加加载状态监听
    video.addEventListener('loadeddata', () => {
      video.setAttribute('data-loaded', 'true');
    });

    // 添加错误处理
    video.addEventListener('error', (e) => {
      console.error('视频加载失败:', e.target.error);
    });
  });
}

// 改为滚动到可视区域后加载
window.addEventListener('scroll', loadFullVideo, { once: true, passive: true });