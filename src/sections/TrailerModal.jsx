import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const videos = [
  {
    id: "tJbzMqJGH4k",
    title: "Grand Theft Auto VI: An Extended Look",
    date: "August 27, 2026",
    isoDate: "2026-08-27",
    duration: "26:48",
  },
  {
    id: "VQRLujxTm3c",
    title: "Grand Theft Auto VI Trailer 2",
    date: "May 6, 2025",
    isoDate: "2025-05-06",
    duration: "2:47",
  },
  {
    id: "QdBZY2fkU-0",
    title: "Grand Theft Auto VI Trailer 1",
    date: "December 4, 2023",
    isoDate: "2023-12-04",
    duration: "1:31",
  },
];

const TrailerModal = ({ onClose }) => {
  const dialogRef = useRef(null);
  const panelRef = useRef(null);
  const playerRef = useRef(null);
  const [activeVideo, setActiveVideo] = useState(videos[2]);

  const selectVideo = (video) => {
    if (video.id === activeVideo.id) return;
    setActiveVideo(video);
    panelRef.current.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
    playerRef.current.focus({ preventScroll: true });
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    dialog.showModal();

    return () => {
      dialog.close();
      document.documentElement.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, []);

  return createPortal(
    <dialog
      ref={dialogRef}
      className="trailer-modal"
      aria-labelledby="trailer-title"
      data-lenis-prevent
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        type="button"
        className="trailer-close"
        aria-label="Close trailer"
        onClick={onClose}
        autoFocus
      >
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="m6 6 12 12M18 6 6 18"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </button>
      <article ref={panelRef} className="trailer-panel" data-lenis-prevent>
        <iframe
          ref={playerRef}
          className="trailer-player"
          src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=1&rel=0&playsinline=1`}
          title={`${activeVideo.title} by Rockstar Games`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
        <div className="trailer-details">
          <div>
            <h2 id="trailer-title">{activeVideo.title}</h2>
            <time dateTime={activeVideo.isoDate}>{activeVideo.date}</time>
          </div>
          <p>
            {activeVideo.id === videos[0].id ? (
              "Explore Grand Theft Auto VI in this extended look from Rockstar Games."
            ) : (
              <>
                Jason and Lucia have always known the deck is stacked against
                them. But when an easy score goes wrong, they find themselves on
                the darkest side of the sunniest place in America, in the middle
                of a criminal conspiracy stretching across the state of Leonida
                — forced to rely on each other more than ever if they want to
                make it out alive.
              </>
            )}
          </p>
        </div>
        <section className="watch-more" aria-labelledby="watch-more-title">
          <h3 id="watch-more-title">Watch More</h3>
          <div className="watch-more-grid">
            {videos.map((video) => {
              const isActive = video.id === activeVideo.id;
              return (
                <button
                  key={video.id}
                  type="button"
                  className="watch-more-card"
                  aria-pressed={isActive}
                  aria-label={`${video.title}${isActive ? ", now playing" : ""}`}
                  onClick={() => selectVideo(video)}
                >
                  <span className="watch-more-image">
                    <img
                      src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                      alt=""
                      loading="lazy"
                    />
                    {isActive ? (
                      <span className="now-playing">Now Playing</span>
                    ) : (
                      <span className="watch-more-play" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="26" height="26">
                          <path d="M8 4v16l12-8z" fill="currentColor" />
                        </svg>
                      </span>
                    )}
                    <span className="watch-more-duration">
                      {video.duration}
                    </span>
                  </span>
                  <span className="watch-more-info">
                    <span className="watch-more-name">{video.title}</span>
                    <time dateTime={video.isoDate}>{video.date}</time>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </article>
    </dialog>,
    document.body,
  );
};

export default TrailerModal;
