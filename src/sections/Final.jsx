import { attachScrollVideo } from "../utils/scrollVideo";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

const Final = () => {
  const videoRef = useRef(null);

  useGSAP(() => {
    gsap.set(".final-content", { opacity: 0 });

    gsap.timeline({
      scrollTrigger: {
        trigger: ".final",
        start: "top top",
        end: "90% top",
        scrub: true,
        pin: true,
      },
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".final",
        start: "top 80%",
        end: "90% top",
        scrub: true,
      },
    });

    tl.to(".final-content", {
      opacity: 1,
      duration: 1,
      scale: 1,
      ease: "power1.inOut",
    });

    return attachScrollVideo(videoRef.current, tl, { duration: 3, ease: "none" });
  });

  return (
    <section className="final">
      <div className="final-stage size-full">
        <div className="final-content size-full">
          <video
            ref={videoRef}
          poster="/images/video-posters/final.webp"
            src="/videos/output3-1.mp4"
            muted
            playsInline
            preload="auto"
            className="size-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Final;
