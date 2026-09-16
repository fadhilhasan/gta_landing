import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { useMaskSettings } from "../../constants";
import ComingSoon from "./ComingSoon";
import TextReveal from "./TextReveal";
import { useRef } from "react";

const Hero = ({ onOpenTrailer }) => {
  const buttonRef = useRef(null);
  const { compact, initialMaskPos, initialMaskSize, maskPos, maskSize } =
    useMaskSettings();

  const animateHover = (isHovered) => {
    gsap.to(buttonRef.current, {
      scale: isHovered ? 1.05 : 1,
      duration: 0.6,
      boxShadow: isHovered
        ? "0px 0px 30px 8px rgba(255, 255, 255, 0.7)"
        : "0px 0px 0px 0px rgba(255, 255, 255, 0)",
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  useGSAP(
    () => {
      const wrapper = document.querySelector(".mask-wrapper");
      const destination = document.querySelector(".overlay-logo");
      const initialGeometry = () => {
        const width = Math.max(wrapper.clientWidth * 40, wrapper.clientHeight * 16);
        const height = width * 150 / 224;
        const bounds = wrapper.getBoundingClientRect();
        const logo = destination.getBoundingClientRect();
        const centerX = logo.left - bounds.left + logo.width / 2;
        const centerY = logo.top - bounds.top + logo.width * 150 / 224 / 2;
        return {
          position: `${centerX - width / 2}px ${centerY - height / 2}px`,
          size: `${width}px ${height}px`,
        };
      };
      const targetGeometry = () => {
        const bounds = wrapper.getBoundingClientRect();
        const logo = destination.getBoundingClientRect();
        return {
          position: `${logo.left - bounds.left}px ${logo.top - bounds.top}px`,
          size: `${logo.width}px ${logo.width * 150 / 224}px`,
        };
      };
      const startMask = {
        maskPosition: compact ? () => initialGeometry().position : initialMaskPos,
        maskSize: compact ? () => initialGeometry().size : initialMaskSize,
      };
      gsap.set(wrapper, startMask);
      if (compact) {
        gsap.set(wrapper, { maskImage: "none" });
        gsap.set(".hero-mobile-fill", { opacity: 1 });
      }

      gsap.set(".mask-logo", {
        marginTop: "-100vh",
        opacity: 0,
      });

      gsap.set(".entrance-message", {
        marginTop: "0vh",
      });

      gsap.set(".text-reveal", { autoAlpha: 0, scale: 1 });
      gsap.set(".text-reveal .text-wrapper", {
        maskImage:
          "radial-gradient(circle at 50% 100%, black 0%, transparent 0%)",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          scrub: 0.3,
          end: "+=250%",
          pin: true,
          invalidateOnRefresh: true,
          refreshPriority: 1,
        },
      });

      if (compact) {
        tl.set(wrapper, { maskImage: 'url("/images/big-hero-text.svg")' }, 0.5);
        tl.to(".hero-mobile-fill", { opacity: 0, duration: 0.3, ease: "power1.inOut" }, 1.1);
      }
      tl.to(".fade-out", {
        autoAlpha: 0,
        ease: "power1.inOut",
      }, 0)
        .to(".scale-out", { scale: 1, ease: "power1.inOut" }, 0.5)
        .fromTo(
          wrapper,
          startMask,
          {
            maskPosition: compact ? () => targetGeometry().position : maskPos,
            maskSize: compact ? () => targetGeometry().size : maskSize,
            duration: 1,
            ease: "power1.inOut",
          },
          "<",
        )
        .to(".mask-wrapper", { opacity: 0 })
        .to(
          ".overlay-logo",
          {
            opacity: 1,
          },
          "<",
        )
        .addLabel("comingSoonReveal", "<")
        .to(
          ".entrance-message",
          {
            duration: 1,
            ease: "power1.inOut",
            maskImage:
              "radial-gradient(circle at 50% 0vh, black 50%, transparent 100%)",
          },
          "comingSoonReveal",
        )
        .to(".overlay-logo", { opacity: 0 }, "comingSoonReveal+=0.5")
        .to(
          ".entrance-message",
          {
            scale: 0.86,
            duration: 1.15,
            ease: "none",
          },
          "comingSoonReveal+=0.35",
        )
        .to(
          ".entrance-message",
          {
            autoAlpha: 0,
            duration: 0.5,
            ease: "power1.inOut",
          },
          "comingSoonReveal+=1",
        )
        .addLabel("textReveal")
        .set(".text-reveal", { autoAlpha: 1 })
        .to(".text-reveal .text-wrapper", {
          maskImage:
            "radial-gradient(circle at 50% 0%, black 50%, transparent 150%)",
          duration: 1,
          ease: "power1.inOut",
        })
        .to(
          ".text-reveal",
          { scale: 0.86, duration: 0.65, ease: "none" },
          "textReveal+=0.35",
        );

      const content = document.querySelector(".text-reveal .text-wrapper");
      const section = document.querySelector(".text-reveal");
      const getOverflow = () =>
        Math.max(0, content.offsetHeight - section.clientHeight + 128);
      if (getOverflow() > 0) {
        tl.to(content, {
          y: () => -getOverflow(),
          duration: 0.5,
          ease: "none",
        });
      }
    },
    {
      dependencies: [compact, initialMaskPos, initialMaskSize, maskPos, maskSize],
      revertOnUpdate: true,
    },
  );

  return (
    <section className="hero-section">
      {compact && (
        <div className="hero-mobile-fill" aria-hidden="true">
          <img src="/images/hero-bg.webp" alt="" className="scale-out" />
        </div>
      )}
      <div className="size-full mask-wrapper">
        <img
          src="/images/hero-bg.webp"
          alt="background"
          className="scale-out"
        />
        <img
          src="/images/hero-text.webp"
          alt="hero-logo"
          className="title-logo fade-out"
        />
        <img
          src="/images/watch-trailer.png"
          alt="trailer"
          className="trailer-logo fade-out"
        />
        <button
          ref={buttonRef}
          onClick={onOpenTrailer}
          onMouseEnter={() => animateHover(true)}
          onMouseLeave={() => animateHover(false)}
          type="button"
          aria-label="watch trailer"
          className="play-img fade-out cursor-pointer"
        >
          <img src="/images/play.png" alt="" className="w-7 ml-1" />
        </button>
      </div>

      <div>
        <img
          src="/images/big-hero-text.svg"
          alt="logo"
          className="size-full object-cover mask-logo"
        />
      </div>

      <div className="fake-logo-wrapper">
        <img
          src="/images/big-hero-text.svg"
          alt="hero logo"
          className="overlay-logo"
        />
      </div>

      <ComingSoon />
      <TextReveal />
    </section>
  );
};

export default Hero;
