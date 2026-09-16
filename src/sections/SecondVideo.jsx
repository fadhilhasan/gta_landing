import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

const SecondVideo = () => {
  const videoRef = useRef();

  useGSAP(() => {
    gsap.set(".lucia", {
      marginTop: "-60vh",
      opacity: 0,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".lucia",
        start: "top top",
        end: "bottom top",
        scrub: true,
        pin: true,
      },
    });

    tl.to(".lucia", { opacity: 1, duration: 1, ease: "power1.inOut" });

    const video = videoRef.current;
    const setupVideo = () => {
      tl.to(
        video,
        {
          currentTime: video.duration,
          duration: 2,
          ease: "power1.inOut",
        },
        "<",
      );
    };
    if (video.readyState >= 1) setupVideo();
    else video.addEventListener("loadedmetadata", setupVideo, { once: true });
    return () => video.removeEventListener("loadedmetadata", setupVideo);
  });

  return (
    <section className="lucia">
      <div className="h-dvh">
        <video
          ref={videoRef}
          src="/videos/output2-1.mp4"
          muted
          playsInline
          preload="auto"
          className="size-full object-cover second-vd"
          style={{ objectPosition: "15% 0%" }}
        />
      </div>
    </section>
  );
};

export default SecondVideo;
