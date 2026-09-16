export function attachScrollVideo(video, timeline, { duration, ease }) {
  const playhead = { time: 0 };
  let disposed = false;
  let primed = false;
  let priming = false;
  let initialized = false;

  const seek = () => {
    if (disposed || priming || video.readyState < 2 || video.seeking) return;
    const target = Math.min(playhead.time, Math.max(0, video.duration - 0.04));
    if (!Number.isFinite(target) || Math.abs(video.currentTime - target) < 0.015) return;
    video.currentTime = target;
  };

  const prime = () => {
    if (disposed || primed || priming) return;
    priming = true;
    video.muted = true;
    video.defaultMuted = true;
    video.play().then(() => {
      video.pause();
      priming = false;
      if (disposed) return;
      primed = true;
      document.removeEventListener("touchstart", prime);
      document.removeEventListener("pointerdown", prime);
      seek();
    }).catch(() => {
      priming = false;
      if (!disposed) seek();
    });
  };

  const setup = () => {
    if (initialized || !Number.isFinite(video.duration) || video.duration <= 0) return;
    initialized = true;
    timeline.to(playhead, {
      time: video.duration,
      duration,
      ease,
      onUpdate: seek,
    }, "<");
    seek();
  };

  video.addEventListener("loadedmetadata", setup);
  video.addEventListener("loadeddata", seek);
  video.addEventListener("canplay", seek);
  video.addEventListener("seeked", seek);
  document.addEventListener("touchstart", prime, { passive: true });
  document.addEventListener("pointerdown", prime, { passive: true });
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) prime();
  }, { rootMargin: "600px 0px" });
  observer.observe(video);
  if (video.readyState >= 1) setup();

  return () => {
    disposed = true;
    observer.disconnect();
    video.pause();
    video.removeEventListener("loadedmetadata", setup);
    video.removeEventListener("loadeddata", seek);
    video.removeEventListener("canplay", seek);
    video.removeEventListener("seeked", seek);
    document.removeEventListener("touchstart", prime);
    document.removeEventListener("pointerdown", prime);
  };
}
