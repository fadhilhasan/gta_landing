import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

const menus = {
  people: [
    { label: "Jason Duval", target: ".jason", preview: "jason" },
    { label: "Lucia Caminos", target: ".lucia-life", preview: "lucia" },
  ],
  places: [{ label: "Leonida Keys", target: ".post-card", preview: "keys" }],
};

const previews = [
  { id: "jason", src: "/images/jason-1.webp", position: "50% 35%" },
  { id: "lucia", src: "/images/lucia-1.webp", position: "50% 30%" },
  { id: "keys", src: "/images/keys-1.jpg", position: "50% 50%" },
];

function NavigationMenu({ onClose }) {
  const dialog = useRef(null);
  const close = useRef(null);
  const onCloseRef = useRef(onClose);

  useLayoutEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);
  const [preview, setPreview] = useState(null);
  const [page, setPage] = useState("root");
  const [motion] = useState(
    () => localStorage.getItem("menu-motion") !== "off",
  );
  useLayoutEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement;
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    element.showModal();
    const reduced =
      !motion || matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timeline;
    let closing = false;
    let destination;
    const context = gsap.context(() => {
      timeline = gsap.timeline({
        onReverseComplete: () => onCloseRef.current(destination),
      });
      timeline
        .fromTo(
          ".navigation-surface",
          {
            opacity: 0,
            backdropFilter: "blur(0px)",
            webkitBackdropFilter: "blur(0px)",
          },
          {
            opacity: 1,
            backdropFilter: "blur(2rem)",
            webkitBackdropFilter: "blur(2rem)",
            duration: reduced ? 0 : 0.5,
            ease: "power2.out",
          },
          0,
        )
        .fromTo(
          ".navigation-panel",
          { xPercent: 100 },
          { xPercent: 0, duration: reduced ? 0 : 0.65, ease: "power3.inOut" },
          0,
        )
        .fromTo(
          ".navigation-brand",
          { opacity: 0 },
          { opacity: 1, duration: reduced ? 0 : 0.5 },
          0,
        )
        .fromTo(
          ".navigation-mark",
          { opacity: 0, filter: "blur(16px)" },
          { opacity: 1, filter: "blur(0px)", duration: reduced ? 0 : 0.7 },
          reduced ? 0 : 0.15,
        )
        .fromTo(
          ".navigation-toggle-line:first-child",
          { y: -5, rotation: 0 },
          { y: 0, rotation: 45, duration: reduced ? 0 : 0.35 },
          0,
        )
        .fromTo(
          ".navigation-toggle-line:last-child",
          { y: 5, rotation: 0 },
          { y: 0, rotation: -45, duration: reduced ? 0 : 0.35 },
          0,
        );
    }, element);
    close.current = (target) => {
      if (closing) return;
      closing = true;
      destination = target;
      if (reduced || timeline.time() === 0) onCloseRef.current(target);
      else timeline.reverse();
    };
    return () => {
      gsap.killTweensOf(element);
      context.revert();
      element.close();
      document.documentElement.style.overflow = overflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [motion]);

  return createPortal(
    <dialog
      ref={dialog}
      className="navigation-menu"
      data-motion={motion ? "on" : "off"}
      aria-label="Main navigation"
      data-lenis-prevent
      onCancel={(event) => {
        event.preventDefault();
        close.current();
      }}
    >
      <div className="navigation-surface" aria-hidden="true" />
      <button
        className="navigation-close navigation-toggle"
        onClick={() => close.current()}
        aria-label="Close navigation"
      >
        <span className="navigation-toggle-line" />
        <span className="navigation-toggle-line" />
      </button>
      <div className="navigation-brand" data-preview={Boolean(preview)}>
        <div className="navigation-previews" aria-hidden="true">
          {previews.map(({ id, src, position }) => (
            <div
              key={id}
              className="navigation-preview"
              data-active={preview === id}
            >
              <img
                src={src}
                alt=""
                style={{ objectPosition: position }}
                decoding="async"
              />
            </div>
          ))}
        </div>
        <img
          className="navigation-mark"
          src="/images/logo.webp"
          alt="Grand Theft Auto VI"
        />
        <div className="navigation-release">
          <p>
            COMING
            <br />
            NOVEMBER 19, 2026
          </p>
          <a
            className="navigation-order"
            href="https://www.rockstargames.com/VI"
            target="_blank"
            rel="noreferrer"
          >
            Pre-Order Now
          </a>
          <div className="navigation-platforms">
            <img src="/images/ps-logo.svg" alt="PlayStation 5" />
            <img src="/images/x-logo.svg" alt="Xbox Series X|S" />
          </div>
        </div>
      </div>
      <div className="navigation-panel">
        <header className="navigation-heading">
          <button
            onClick={() =>
              page === "root"
                ? close.current()
                : (setPage("root"), setPreview(null))
            }
            aria-label={page === "root" ? "Back to page" : "Back to main menu"}
          >
            ← Back
          </button>
          <span>|</span>
          <span>
            {page === "root"
              ? "Only In Leonida"
              : page === "people"
                ? "People"
                : "Places"}
          </span>
        </header>
        <div className="navigation-links" key={page}>
          {page === "root" ? (
            <>
              <button
                className="navigation-featured"
                onMouseEnter={() => setPreview(null)}
                onFocus={() => setPreview(null)}
                onClick={() => close.current(0)}
              >
                Explore All
              </button>
              <button
                onClick={() => {
                  setPage("people");
                  setPreview(null);
                }}
              >
                People <span>›</span>
              </button>
              <button
                onClick={() => {
                  setPage("places");
                  setPreview(null);
                }}
              >
                Places <span>›</span>
              </button>
            </>
          ) : (
            menus[page].map(({ label, target, preview: image }) => (
              <button
                key={target}
                data-selected={preview === image}
                onMouseEnter={() => setPreview(image)}
                onMouseLeave={() => setPreview(null)}
                onFocus={(event) => {
                  if (event.currentTarget.matches(":focus-visible"))
                    setPreview(image);
                }}
                onBlur={() => setPreview(null)}
                onClick={() => close.current(target)}
              >
                {label}
                <span>↗</span>
              </button>
            ))
          )}
        </div>
      </div>
    </dialog>,
    document.body,
  );
}

export default function Navbar({ open, onOpen, onClose }) {
  return (
    <>
      <nav aria-label="Site header">
        <a href="#" aria-label="Back to top">
          <img src="/images/nav-logo.svg" className="scale-90" alt="VI" />
        </a>
        <button
          className="navigation-toggle"
          onClick={onOpen}
          aria-label="Open navigation"
          aria-expanded={open}
        >
          <span className="navigation-toggle-line" />
          <span className="navigation-toggle-line" />
        </button>
      </nav>
      {open && <NavigationMenu onClose={onClose} />}
    </>
  );
}
