const menu = document.querySelector('.menu');
const nav = document.querySelector('.nav-links');
if (menu && nav) {
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

document.querySelectorAll('.filter').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-category]').forEach((card) => {
      card.classList.toggle('hidden', filter !== 'all' && !card.dataset.category.includes(filter));
    });
  });
});

const motionVideos = [...document.querySelectorAll('.motion-video-card video, .social-card video')];
if (motionVideos.length) {
  motionVideos.slice(1).forEach((video) => video.pause());
  motionVideos.forEach((video, index) => {
    video.tabIndex = 0;
    const activate = () => {
      motionVideos.forEach((item) => { if (item !== video) item.pause(); });
      if (video.paused) video.play().catch(() => {});
    };
    video.addEventListener('mouseenter', activate);
    video.addEventListener('focus', activate);
    video.addEventListener('click', () => {
      if (video.paused) activate(); else video.pause();
    });
    video.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (video.paused) activate(); else video.pause();
      }
    });
    if (index > 0) video.removeAttribute('autoplay');
  });
}

document.querySelectorAll('[data-social-feed]').forEach((feed) => {
  const section = feed.closest('.social-studio');
  const previous = section?.querySelector('[data-feed-prev]');
  const next = section?.querySelector('[data-feed-next]');
  const step = () => {
    const card = feed.querySelector('.social-card');
    const gap = Number.parseFloat(getComputedStyle(feed).columnGap || getComputedStyle(feed).gap) || 18;
    return (card?.getBoundingClientRect().width || feed.clientWidth * 0.8) + gap;
  };
  previous?.addEventListener('click', () => feed.scrollBy({ left: -step(), behavior: 'smooth' }));
  next?.addEventListener('click', () => feed.scrollBy({ left: step(), behavior: 'smooth' }));
});

document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
