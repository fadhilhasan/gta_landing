import { useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import Lenis from "lenis";

const Photo = ({ number, alt, className }) => (
  <div className={`keys-photo ${className}`}>
    <img src={`/images/keys-${number}.jpg`} alt={alt} draggable="false" />
  </div>
);

export default function LeonidaExplorer({ onClose }) {
  const dialogRef = useRef(null);
  const scrollRef = useRef(null);
  const requestCloseRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useLayoutEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const scroller = scrollRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    dialog.showModal();

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lenis = new Lenis({
      wrapper: scroller,
      content: scroller.firstElementChild,
      orientation: "horizontal",
      gestureOrientation: "both",
      autoRaf: false,
      lerp: reducedMotion.matches ? 1 : 0.08,
      smoothWheel: true,
    });
    const updateScroll = (time) => lenis.raf(time * 1000);
    const updateBackground = () => {
      dialog.style.setProperty(
        "--keys-art-offset",
        `${reducedMotion.matches ? 0 : -lenis.animatedScroll * 0.35}px`,
      );
    };
    lenis.on("scroll", updateBackground);
    updateBackground();
    gsap.ticker.add(updateScroll);
    lenis.stop();
    let closing = false;
    let transition;
    const entrance = gsap.context(() => {
      const postcard = document.querySelector(".post-card-wrapper");
      const duration = reducedMotion.matches ? 0 : 0.9;
      if (postcard)
        gsap.set(postcard, {
          transition: "none",
          transformOrigin: "50% 50%",
        });
      gsap.set(dialog, { "--keys-background-opacity": 0 });
      gsap.set(scroller, { xPercent: reducedMotion.matches ? 0 : 100 });
      const back = dialog.querySelector(".keys-back");
      gsap.set(back, { autoAlpha: 0 });
      const timeline = gsap.timeline({
        onComplete: () => {
          if (!closing) lenis.start();
        },
        onReverseComplete: () => {
          if (closing) onCloseRef.current();
        },
      });
      transition = timeline;
      if (postcard && !reducedMotion.matches) {
        timeline.to(
          postcard,
          {
            x: -window.innerWidth,
            rotation: -8,
            duration,
            ease: "power3.inOut",
          },
          0,
        );
      }
      timeline.to(
        dialog,
        {
          "--keys-background-opacity": 1,
          duration,
          ease: "power1.inOut",
        },
        0,
      );
      timeline.to(
        scroller,
        {
          xPercent: 0,
          duration,
          ease: "power3.inOut",
        },
        reducedMotion.matches ? 0 : 0.12,
      );
      timeline.to(
        back,
        {
          autoAlpha: 1,
          duration: reducedMotion.matches ? 0 : 0.3,
        },
        reducedMotion.matches ? 0 : 0.6,
      );
    });
    requestCloseRef.current = () => {
      if (closing) return;
      closing = true;
      lenis.stop();
      if (reducedMotion.matches || transition.time() === 0) {
        onCloseRef.current();
      } else {
        transition.reverse();
      }
    };
    const move = (delta) =>
      lenis.scrollTo(lenis.targetScroll + delta, {
        immediate: reducedMotion.matches,
      });
    const key = (event) => {
      if (closing) return;
      if (event.altKey || event.metaKey || event.ctrlKey) return;
      const steps = {
        ArrowRight: 160,
        ArrowLeft: -160,
        ArrowDown: 160,
        ArrowUp: -160,
        PageDown: scroller.clientWidth * 0.8,
        PageUp: -scroller.clientWidth * 0.8,
        Home: -scroller.scrollWidth,
        End: scroller.scrollWidth,
      };
      if (steps[event.key] !== undefined) {
        event.preventDefault();
        move(steps[event.key]);
      }
    };
    dialog.addEventListener("keydown", key);
    return () => {
      requestCloseRef.current = null;
      entrance.revert();
      gsap.ticker.remove(updateScroll);
      lenis.off("scroll", updateBackground);
      lenis.destroy();
      dialog.removeEventListener("keydown", key);
      dialog.close();
      document.documentElement.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  return createPortal(
    <dialog
      ref={dialogRef}
      className="keys-explorer"
      aria-labelledby="keys-title"
      onCancel={(event) => {
        event.preventDefault();
        requestCloseRef.current?.();
      }}
      data-lenis-prevent
    >
      <button
        type="button"
        className="keys-back"
        onClick={() => requestCloseRef.current?.()}
        autoFocus
      >
        <span aria-hidden="true">←</span> Back
      </button>
      <div
        ref={scrollRef}
        className="keys-scroll"
        tabIndex={0}
        aria-label="Leonida Keys horizontal gallery"
      >
        <div className="keys-track">
          <section className="keys-intro">
            <div className="keys-postcard">
              <img
                className="keys-postcard-image"
                src="/images/keys-1.jpg"
                alt="Islands and turquoise waters of Leonida Keys"
              />
              <img
                className="keys-postcard-overlay"
                src="/images/keys-overlay.png"
                alt="Leonida Keys — Visit Leonida"
              />
            </div>
            <div className="keys-copy">
              <h1 id="keys-title">
                Gateway to
                <br />
                Paradise
              </h1>
              <h2>The dress code is casual, the bars are loaded.</h2>
              <p>
                Life in this tropical archipelago isn’t flashy but it’s easy.
                Get your buzz on and pull up a deck chair but look out — you are
                right on the doorstep of some of the most beautiful and
                dangerous waters in all of America.
              </p>
            </div>
          </section>
          <section className="keys-collage" aria-label="Life in the Keys">
            <Photo
              number={2}
              alt="An iguana crossing in front of a mobility scooter"
              className="keys-scooter"
            />
            <Photo
              number={1}
              alt="A seaplane above the islands and bridges"
              className="keys-plane"
            />
            <Photo
              number={3}
              alt="Locals outside the Rusty Anchor bar"
              className="keys-bar"
            />
          </section>
          <Photo
            number={4}
            alt="A diver and sea turtle exploring the reef"
            className="keys-reef"
          />
          <Photo
            number={5}
            alt="Boats and jet skis gathering on the water"
            className="keys-party"
          />
        </div>
      </div>
    </dialog>,
    document.body,
  );
}
