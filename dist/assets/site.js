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

document.querySelectorAll('.work-filters').forEach((filterGroup) => {
  const archive = filterGroup.closest('.identity-archive');
  const buttons = [...filterGroup.querySelectorAll('.filter')];
  const cards = [...(archive || document).querySelectorAll('[data-category]')];

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      buttons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-pressed', String(isActive));
      });
      cards.forEach((card) => {
        const matches = filter === 'all' || card.dataset.category.split(' ').includes(filter);
        card.classList.toggle('hidden', !matches);
        card.setAttribute('aria-hidden', String(!matches));
      });
    });
  });
});

const motionVideos = [...document.querySelectorAll('.motion-video-card video, .social-card video, .work-motion-grid video')];
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

document.querySelectorAll('[data-service-finder]').forEach((finder) => {
  const tabs = [...finder.querySelectorAll('[data-finder-tab]')];
  const panels = [...finder.querySelectorAll('.finder-panel')];
  const activate = (tab) => {
    const targetId = tab.dataset.finderTab;
    tabs.forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
    panels.forEach((panel) => {
      const active = panel.id === targetId;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[nextIndex].focus();
      activate(tabs[nextIndex]);
    });
  });
});

document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
