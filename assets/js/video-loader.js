function loadFullVideo() {
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    video.preload = 'auto';
    video.load();
  });
}
// 在用户交互后触发
window.addEventListener('click', loadFullVideo);
