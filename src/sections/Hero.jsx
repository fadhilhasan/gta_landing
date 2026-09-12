import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { useMaskSettings } from "../../constants";
import ComingSoon from "./ComingSoon";
import TextReveal from "./TextReveal";

const Hero = () => {
  const { initialMaskPos, initialMaskSize, maskSize } = useMaskSettings();

  useGSAP(() => {
    gsap.set(".mask-wrapper", {
      maskPosition: initialMaskPos,
      maskSize: initialMaskSize,
    });

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
      },
    });

    tl.to(".fade-out", {
      opacity: 0,
      ease: "power1.inOut",
    })
      .to(".scale-out", { scale: 1, ease: "power1.inOut" })
      .to(".mask-wrapper", { maskSize: maskSize, ease: "power1.inOut" }, "<")
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
      tl.to(content, { y: () => -getOverflow(), duration: 0.5, ease: "none" });
    }
  });

  return (
    <section className="hero-section">
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
        <div className="play-img fade-out">
          <img src="/images/play.png" alt="play" className="w-7 ml-1" />
        </div>
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
