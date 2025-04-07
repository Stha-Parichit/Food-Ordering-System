export const getYouTubeVideoId = (url) => {
  const regex = /(?:v=|\/)([a-zA-Z0-9_-]{11})(?:[?&]|$)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const getYouTubeThumbnail = (videoId) => {
  if (!videoId) return '/fallback-thumbnail.jpg';
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

export const addPassiveTouchListener = (element, handler) => {
  const supportsPassive = () => {
    let passiveSupported = false;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get() { passiveSupported = true; }
      });
      window.addEventListener('test', null, opts);
      window.removeEventListener('test', null, opts);
    } catch (e) {}
    return passiveSupported;
  };

  element.addEventListener('touchstart', handler, supportsPassive() ? { passive: true } : false);
};

export const getYouTubeWatchUrl = (videoId) => {
  return `https://www.youtube.com/watch?v=${videoId}`;
};