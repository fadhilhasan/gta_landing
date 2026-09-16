import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

const PostCard = ({ onExplore }) => {
  const videoRef = useRef(null);

  useGSAP(() => {
    gsap.timeline({
      scrollTrigger: {
        trigger: ".post-card",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.3,
        invalidateOnRefresh: true,
      },
    })
      .to("main", { "--postcard-background-opacity": 1, duration: 1, ease: "none" })
      .to("main", { "--postcard-background-opacity": 1, duration: 1, ease: "none" })
      .to("main", { "--postcard-background-opacity": 0, duration: 1, ease: "none" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".post-card",
        start: "top center",
        end: "bottom center",
        scrub: true,
      },
    });

    const video = videoRef.current;
    const setupVideo = () => {
      tl.to(
        video,
        {
          currentTime: video.duration,
          duration: 3,
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
    <section className="post-card">
      <div className="post-card-wrapper group hover:rotate-1 transition duration-700">
        <img src="/images/overlay.webp" alt="overlay" />

        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          src="/videos/postcard-vd.mp4"
        />

        <button type="button" onClick={onExplore} aria-haspopup="dialog" className="group-hover:bg-yellow transition duration-700 cursor-pointer">
          Explore Leonida Keys
        </button>
      </div>
    </section>
  );
};

export default PostCard;
