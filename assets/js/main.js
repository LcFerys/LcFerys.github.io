// 时间线动画
function checkTimeline() {
  // 添加备用选择器
  const timelineItems = document.querySelectorAll('.timeline-item, .experience-item');

  // 修改后统一使用卡片检测
  const experienceCards = document.querySelectorAll('.experience-card');

  // 修改卡片动画检测逻辑
  function checkCards() {
    experienceCards.forEach(card => {
      const cardTop = card.getBoundingClientRect().top;
      if (cardTop < window.innerHeight * 0.85) {
        card.style.opacity = 1;
        card.style.transform = 'translateY(0)';
      }
    });
  }

  timelineItems.forEach(item => {
    const itemTop = item.getBoundingClientRect().top;
    if (itemTop < window.innerHeight * 0.85) {
      item.classList.add('visible');
    }
  });
}

// 技能进度条动画
function animateSkills() {
  const meters = document.querySelectorAll('.skill-meter');
  meters.forEach(meter => {
    const percent = meter.dataset.percent;
    meter.style.width = percent;
  });
}

// 新增导航栏滚动监听
function updateNavbar() {
  const nav = document.querySelector('.main-nav');
  if (window.scrollY > 100) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', () => {
  updateNavbar();
  checkTimeline(); // 保留原有时间线检测
});

// 新增卡片悬停效果
function initCardHover() {
  document.querySelectorAll('.timeline-item, .skill-item').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// 初始化所有效果
window.addEventListener('load', () => {
  animateSkills();
  initCardHover();
  checkTimeline();
});