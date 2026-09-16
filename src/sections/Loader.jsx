import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

// Outline from the official Rockstar asset used by the footer.
const logoPath = "M6.46158 8.24829H9.43888C10.7887 8.24829 11.9568 7.83799 11.9568 6.33698C11.9568 5.14605 10.9311 4.89311 9.94489 4.89311H7.1748L6.46158 8.24829ZM18.252 16.2711H23L18.7152 19.2304L19.4081 23.8935L15.6956 21.0792L10.7134 24L13.0429 19.0576C13.0429 19.0576 10.3333 16.2384 10.3355 16.2384C10.1533 15.9985 10.0924 15.3804 10.0924 15.1145C10.0924 14.7783 10.114 14.4378 10.1369 14.0751C10.163 13.6619 10.1909 13.2199 10.1909 12.7227C10.1909 11.4958 9.64767 10.8542 8.31965 10.8542H5.82976L4.74562 15.9186H1L3.97871 2H11.0275C13.6468 2 15.646 2.64299 15.646 5.60795C15.646 7.69498 14.6166 9.17746 12.3456 9.48874V9.52873C13.4135 9.78202 13.8135 10.5027 13.8135 11.8459C13.8135 12.3821 13.7972 12.8526 13.7818 13.2953C13.7681 13.6882 13.7553 14.0592 13.7553 14.4344C13.7553 14.9154 13.8805 15.7015 14.196 16.2384H14.7164L17.4989 11.6004L18.252 16.2711ZM17.6626 16.9514H20.8136L17.9728 18.9127L18.4804 22.3323L15.747 20.2582L12.2768 22.2913L13.8654 18.9255L11.9338 16.9183H15.1096L17.1185 13.5697L17.6626 16.9514Z";

// Two open routes along opposite sides of the R, meeting at the star's lower tip.
const glowPaths = [
  "M3.97871 2H11.0275C13.6468 2 15.646 2.64299 15.646 5.60795C15.646 7.69498 14.6166 9.17746 12.3456 9.48874V9.52873C13.4135 9.78202 13.8135 10.5027 13.8135 11.8459C13.8135 12.3821 13.7972 12.8526 13.7818 13.2953C13.7681 13.6882 13.7553 14.0592 13.7553 14.4344C13.7553 14.9154 13.8805 15.7015 14.196 16.2384H14.7164L17.4989 11.6004L18.252 16.2711H23L18.7152 19.2304L19.4081 23.8935L15.6956 21.0792L10.7134 24",
  "M3.97871 2L1 15.9186H4.74562L5.82976 10.8542H8.31965C9.64767 10.8542 10.1909 11.4958 10.1909 12.7227C10.1909 13.2199 10.163 13.6619 10.1369 14.0751C10.114 14.4378 10.0924 14.7783 10.0924 15.1145C10.0924 15.3804 10.1533 15.9985 10.3355 16.2384L13.0429 19.0576L10.7134 24",
];

export default function Loader({ onComplete }) {
  const root = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let tween;
    const timers = [];
    const delay = (ms) => new Promise((resolve) => timers.push(setTimeout(resolve, ms)));
    const images = ["hero-bg.webp", "hero-text.webp", "watch-trailer.png", "play.png"];
    const ready = images.map((name) => {
      const image = new Image();
      image.src = `/images/${name}`;
      return image.decode().catch(() => {});
    });
    ready.push(document.fonts.ready);

    Promise.all([
      delay(2200),
      Promise.race([Promise.all(ready), delay(8000)]),
    ]).then(() => {
      if (cancelled) return;
      ScrollTrigger.refresh();
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const background = root.current.querySelector(".startup-loader-background");
      const logo = root.current.querySelector(".startup-loader-logo");
      // Blur the viewport through the overlay, keeping pinned page elements intact.
      tween = gsap.timeline({
        onComplete: () => onComplete(false),
      });
      tween
        .set(root.current, {
          backdropFilter: reducedMotion ? "none" : "blur(18px)",
          webkitBackdropFilter: reducedMotion ? "none" : "blur(18px)",
        })
        .to(logo, {
          opacity: 0,
          filter: reducedMotion ? "none" : "blur(8px)",
          duration: reducedMotion ? 0 : 0.35,
          ease: "power2.in",
        })
        .to(background, {
          opacity: 0,
          duration: reducedMotion ? 0 : 0.65,
          ease: "power2.inOut",
        }, reducedMotion ? 0 : 0.15)
        .to(root.current, {
          backdropFilter: "blur(0px)",
          webkitBackdropFilter: "blur(0px)",
          duration: reducedMotion ? 0 : 1.1,
          ease: "power2.out",
        }, reducedMotion ? 0 : 0.5);
    });
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      tween?.kill();
    };
  }, [onComplete]);

  return (
    <div ref={root} className="startup-loader" role="status" aria-label="Loading page">
      <div className="startup-loader-background" aria-hidden="true" />
      <svg className="startup-loader-logo" viewBox="-1 0 26 26" fill="none" aria-hidden="true">
        <path d={logoPath} className="startup-loader-outline" />
        {glowPaths.map((path, index) => (
          <g key={index} className="startup-loader-glow">
            <path d={path} pathLength="100" className="startup-loader-trace startup-loader-halo" />
            <path d={path} pathLength="100" className="startup-loader-trace" />
          </g>
        ))}
      </svg>
    </div>
  );
}
