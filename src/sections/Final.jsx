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

    const video = videoRef.current;
    const setupVideo = () => {
      tl.to(
        video,
        {
          currentTime: video.duration,
          duration: 3,
          ease: "none",
        },
        "<",
      );
    };
    if (video.readyState >= 1) setupVideo();
    else video.addEventListener("loadedmetadata", setupVideo, { once: true });
    return () => video.removeEventListener("loadedmetadata", setupVideo);
  });

  return (
    <section className="final">
      <div className="final-stage size-full">
        <div className="final-content size-full">
          <video
            ref={videoRef}
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
