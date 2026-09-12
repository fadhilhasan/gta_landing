import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

const FirstVideo = () => {
  const videoRef = useRef(null);

  useGSAP(() => {
    gsap.set(".first-vd-wrapper", {
      marginTop: "-100dvh",
      opacity: 0,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".first-vd-wrapper",
        start: "top top",
        end: "+=200% top",
        scrub: true,
        pin: true,
      },
    });

    tl.to(".hero-section", { opacity: 0, duration: 0.5, ease: "power1.inOut" });
    tl.to(
      ".first-vd-wrapper",
      {
        opacity: 1,
        duration: 0.5,
        ease: "power1.inOut",
      },
      "<",
    );

    videoRef.current.onloadedmetadata = () => {
      tl.to(
        videoRef.current,
        {
          currentTime: videoRef.current.duration,
          duration: 3,
          ease: "none",
        },
        "<",
      );
    };
  }, []);

  return (
    <section className="first-vd-wrapper">
      <div className="h-dvh">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          src="/videos/output1-1.mp4"
          className="first-vd"
        />
      </div>
    </section>
  );
};

export default FirstVideo;
