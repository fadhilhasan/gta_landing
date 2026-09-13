import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const FRAME_COUNT = 59;

const MiddleVideo = () => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const frames = [];
      const playhead = { frame: 0 };
      let disposed = false;

      const render = () => {
        if (disposed) return;
        const index = Math.round(playhead.frame);
        let image = frames[index];
        if (!image?.naturalWidth) {
          image = frames.reduce((nearest, candidate, candidateIndex) => {
            if (!candidate.complete || !candidate.naturalWidth) return nearest;
            return !nearest ||
              Math.abs(candidateIndex - index) <
                Math.abs(frames.indexOf(nearest) - index)
              ? candidate
              : nearest;
          }, null);
        }
        if (!image?.complete || !image.naturalWidth) return;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const scale = Math.max(
          width / image.naturalWidth,
          height / image.naturalHeight,
        );
        const drawWidth = image.naturalWidth * scale;
        const drawHeight = image.naturalHeight * scale;
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(
          image,
          (width - drawWidth) / 2,
          (height - drawHeight) / 2,
          drawWidth,
          drawHeight,
        );
      };

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(canvas.clientWidth * dpr);
        canvas.height = Math.round(canvas.clientHeight * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        render();
      };

      for (let i = 1; i <= FRAME_COUNT; i++) {
        const image = new Image();
        image.onload = render;
        frames.push(image);
        image.src = `/frames/first-video/frame-${String(i).padStart(3, "0")}.webp`;
      }

      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(canvas);

      gsap.set(section, { opacity: 0 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=150%",
            scrub: 0.2,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        .to(section, { opacity: 1, duration: 0.45, ease: "power1.inOut" }, 0)
        .to(
          playhead,
          {
            frame: FRAME_COUNT - 1,
            duration: 1,
            ease: "none",
            snap: "frame",
            onUpdate: render,
          },
          0,
        )
        .fromTo(
          ".middle-video-quote",
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, duration: 0.2, ease: "power1.out" },
          0.35,
        )
        .to(
          ".middle-video-quote",
          { autoAlpha: 0, duration: 0.15, ease: "none" },
          1.05,
        );

      return () => {
        disposed = true;
        observer.disconnect();
        frames.forEach((image) => {
          image.onload = null;
        });
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="middle-video"
      aria-label="Jason in action"
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        aria-hidden="true"
      />
      <blockquote className="middle-video-quote">
        “If anything happens,
        <br />
        I'm right behind you.”
      </blockquote>
    </section>
  );
};

export default MiddleVideo;
