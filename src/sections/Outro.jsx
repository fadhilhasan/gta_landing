import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createPortal } from "react-dom";

const Outro = () => {
  useGSAP(() => {
    // The portal is fixed, so give it a scroll-bound visibility limit separate
    // from the time-based entrance/reverse animation. Fast scrolling must not
    // carry a still-fading outro back over the postcard.
    const overlay = document.querySelector(".outro-overlay");
    gsap.set(overlay, { opacity: 0 });
    const setOverlayOpacity = gsap.quickSetter(overlay, "opacity");
    const updateVisibility = (self) => {
      const fadeDistance = Math.max(1, window.innerHeight * 0.2);
      setOverlayOpacity(gsap.utils.clamp(0, 1, (self.scroll() - self.start) / fadeDistance));
    };
    ScrollTrigger.create({
      trigger: ".final",
      start: "top top",
      end: "max",
      onUpdate: updateVisibility,
      onRefresh: updateVisibility,
    });

    const stage = document.querySelector(".final-stage");
    if (stage) {
      gsap.set(stage, { y: 0 });
      const setY = gsap.quickSetter(stage, "y", "px");
      ScrollTrigger.create({
        trigger: ".final-message",
        start: "top top",
        end: "+=80%",
        onUpdate: (self) => setY(self.progress * (self.end - self.start)),
        onRefresh: (self) => setY(self.progress * (self.end - self.start)),
      });
    }
    gsap.set(".outro-content", {
      autoAlpha: 0,
      scale: 1.16,
      transformOrigin: "50% 50%",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".final-message",
        start: "top top",
        end: "+=80%",
        toggleActions: "play none none reverse",
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    tl.to(
      ".final-content",
      {
        opacity: 0,
        duration: 0.35,
        ease: "power1.inOut",
      },
      0,
    )
      .to(
        ".outro-content",
        {
          autoAlpha: 1,
          duration: 0.45,
          ease: "power1.inOut",
        },
        0,
      )
      .to(
        ".outro-content",
        {
          scale: 0.9,
          duration: 1,
          ease: "none",
        },
        0,
      );
  });

  return (
    <>
      <section className="final-message" aria-hidden="true" />
      {createPortal(
      <div className="outro-overlay">
      <div className="outro-content h-full col-center gap-10">
        <img src="/images/logo.webp" alt="logo" className="md:w-72 w-52" />

        <div>
          <h3 className="gradient-title">
            Coming <br /> November 19th <br /> 2026
          </h3>
        </div>

        <div className="flex-center gap-10">
          <img
            src="/images/ps-logo.svg"
            alt="ps logo"
            className="md:w-32 w-20"
          />
          <img src="/images/x-logo.svg" alt="x logo" className="md:w-52 w-40" />
        </div>
      </div>
      </div>,
      document.body,
      )}
    </>
  );
};

export default Outro;
