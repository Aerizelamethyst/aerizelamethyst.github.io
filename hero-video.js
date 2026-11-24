function setupFilm(videoId, buttonId, label) {
  const video = document.getElementById(videoId);
  const button = document.getElementById(buttonId);
  if (!video || !button) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let wantsPlayback = !reducedMotion.matches && !navigator.connection?.saveData;
  let inView = !('IntersectionObserver' in window);
  video.muted = true;
  button.hidden = false;
  function updateButton() {
    const playing = !video.paused;
    button.classList.toggle('is-playing', playing);
    button.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} ${label}`);
    button.querySelector('.video-toggle-label').textContent = playing ? 'Pause film' : 'Play film';
  }
  async function syncPlayback() {
    if (!wantsPlayback || !inView || document.hidden) {
      video.pause();
      return;
    }
    if (!video.hasAttribute('src')) video.src = video.dataset.src;
    try { await video.play(); } catch { updateButton(); }
  }
  video.addEventListener('playing', () => {
    video.classList.add('is-ready');
    updateButton();
  });
  video.addEventListener('pause', updateButton);
  video.addEventListener('error', () => {
    video.classList.remove('is-ready');
    button.hidden = true;
  });
  button.addEventListener('click', () => {
    wantsPlayback = video.paused;
    syncPlayback();
  });
  reducedMotion.addEventListener('change', () => {
    wantsPlayback = !reducedMotion.matches && !navigator.connection?.saveData;
    syncPlayback();
  });
  document.addEventListener('visibilitychange', syncPlayback);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0 }).observe(video);
  }
  syncPlayback();
}
setupFilm('hero-video', 'hero-video-toggle', 'background video');
setupFilm('about-video', 'about-video-toggle', 'artist film');
