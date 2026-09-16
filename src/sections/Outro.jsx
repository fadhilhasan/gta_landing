import { useEffect } from "react";
import Footer from "./Footer";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Outro = () => {
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const glow = document.querySelector(".outro-cursor-glow");
      const scene = document.querySelector(".outro-scene");
      const moveX = gsap.quickTo(glow, "x", { duration: 0.6, ease: "power3.out" });
      const moveY = gsap.quickTo(glow, "y", { duration: 0.6, ease: "power3.out" });
      const fade = gsap.quickTo(glow, "opacity", { duration: 0.35 });
      let positioned = false;
      const hide = () => { fade(0); positioned = false; };
      const move = (event) => {
        if (document.querySelector("dialog[open]") || Number(gsap.getProperty(scene, "opacity")) < 0.95) {
          hide();
          return;
        }
        if (!positioned) {
          moveX(event.clientX, event.clientX);
          moveY(event.clientY, event.clientY);
          positioned = true;
        } else {
          moveX(event.clientX);
          moveY(event.clientY);
        }
        fade(1);
      };
      window.addEventListener("pointermove", move, { passive: true });
      document.documentElement.addEventListener("pointerleave", hide);
      window.addEventListener("blur", hide);
      return () => {
        window.removeEventListener("pointermove", move);
        document.documentElement.removeEventListener("pointerleave", hide);
        window.removeEventListener("blur", hide);
        moveX.tween.kill(); moveY.tween.kill(); fade.tween.kill();
      };
    });
    return () => media.revert();
  }, []);

  useGSAP(() => {
    // The portal is fixed, so give it a scroll-bound visibility limit separate
    // from the time-based entrance/reverse animation. Fast scrolling must not
    // carry a still-fading outro back over the postcard.
    const overlay = document.querySelector(".outro-overlay");
    const scene = document.querySelector(".outro-scene");
    gsap.set(scene, { opacity: 0 });
    const setOverlayOpacity = gsap.quickSetter(scene, "opacity");
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
    // Once the pin ends, move the fixed artwork with the incoming footer.
    const setOverlayY = gsap.quickSetter(overlay, "y", "px");
    const footer = document.querySelector(".outro-footer");
    const platforms = document.querySelector(".outro-content").lastElementChild;
    const followFooter = () => {
      // Use the visible artwork edge, not the full-height centering wrapper.
      const currentY = Number(gsap.getProperty(overlay, "y")) || 0;
      const artworkBottom = platforms.getBoundingClientRect().bottom - currentY;
      const gap = window.innerWidth < 768 ? 28 : 48;
      const availableBottom = footer.getBoundingClientRect().top - gap;
      setOverlayY(Math.min(0, availableBottom - artworkBottom));
    };
    ScrollTrigger.create({
      trigger: ".outro-footer",
      start: "top bottom",
      end: "bottom top",
      onUpdate: followFooter,
      onRefresh: followFooter,
    });
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

    tl.fromTo(".outro-backdrop", { opacity: 0 }, { opacity: 1, duration: 0.45 }, 0).to(
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
      <Footer />
      <div className="outro-scene">
      <div className="outro-backdrop" aria-hidden="true" />
      <div className="outro-cursor-glow" aria-hidden="true" />
      <div className="outro-overlay">
      <div className="outro-content h-full col-center gap-10">
        <img src="/images/logo.webp" alt="logo" className="md:w-72 w-52" />

        <div>
          <h3 className="gradient-title outro-title">
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
      </div>
      </div>
    </>
  );
};

export default Outro;
