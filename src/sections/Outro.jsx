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
    const setOverlayY = gsap.quickSetter(overlay, "y", "px");
    const footer = document.querySelector(".outro-footer");
    const content = document.querySelector(".outro-content");
    const fit = document.querySelector(".outro-fit");
    const logo = content.firstElementChild;
    const platforms = content.lastElementChild;
    const setFitScale = gsap.quickSetter(fit, "scale");
    gsap.set(fit, { scale: 1, transformOrigin: "50% 50%" });
    const followFooter = () => {
      const currentY = Number(gsap.getProperty(overlay, "y")) || 0;
      const currentScale = Number(gsap.getProperty(fit, "scale")) || 1;
      const center = overlay.clientHeight / 2;
      const artworkTop = center + (logo.getBoundingClientRect().top - currentY - center) / currentScale;
      const artworkBottom = center + (platforms.getBoundingClientRect().bottom - currentY - center) / currentScale;
      const artworkHeight = artworkBottom - artworkTop;
      if (artworkHeight <= 0) return;
      const gap = window.innerWidth < 768 ? 24 : 36;
      const safeTop = 24;
      const availableBottom = Math.min(overlay.clientHeight - 24, footer.getBoundingClientRect().top - gap);
      const scale = Math.min(1, Math.max(0.05, (availableBottom - safeTop) / artworkHeight));
      const fittedBottom = center + (artworkBottom - center) * scale;
      setFitScale(scale);
      setOverlayY(Math.min(0, availableBottom - fittedBottom));
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
      onUpdate: followFooter,
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
      <div className="outro-fit h-full">
      <div className="outro-content h-full col-center">
        <img src="/images/logo.webp" alt="Grand Theft Auto VI" className="outro-logo" />

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
      </div>
    </>
  );
};

export default Outro;
