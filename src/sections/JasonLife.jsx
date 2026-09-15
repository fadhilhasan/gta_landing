import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const Photo = ({ src, alt, className }) => (
  <a
    className={`jason-life-photo ${className}`}
    href={src}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`View full image: ${alt}`}
  >
    <img src={src} alt={alt} loading="lazy" width="3840" height="2160" />
    <span className="jason-photo-expand" aria-hidden="true">
      ⤢
    </span>
  </a>
);

const JasonLife = () => {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const stage = document.querySelector(".middle-video-stage");
      if (stage) {
        // Once the sequence unpins, compensate for page movement. Only the
        // background stays in the viewport; the quote and story scroll normally.
        const setY = gsap.quickSetter(stage, "y", "px");
        gsap.set(stage, { y: 0 });
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: () => ScrollTrigger.getById("middle-video-sequence").end,
          end: "bottom top",
          onUpdate: (self) => setY(self.progress * (self.end - self.start)),
          onRefresh: (self) => setY(self.progress * (self.end - self.start)),
        });
      }
      // Fade the image only, so the quote stays readable as both sections scroll.
      const video = document.querySelector(".middle-video-visual");
      if (video) {
        gsap.fromTo(
          video,
          {
            opacity: 1,
          },
          {
            opacity: 0,
            immediateRender: false,
            duration: 1,
            ease: "power1.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              end: "10% center",
              scrub: 2,
              invalidateOnRefresh: true,
            },
          },
        );
      }
      gsap.to(".jason-life-left", {
        y: -300,
        duration: 1,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "80% center",
          scrub: 2,
          invalidateOnRefresh: true,
        },
      });
      // Animate the quote's inner span so its entrance animation stays separate.
      const right = sectionRef.current.querySelector(".jason-life-right");
      const quote = document.querySelector(".middle-video-quote-content");
      const storyContent = [right, quote].filter(Boolean);
      const media = gsap.matchMedia();
      media.add("(min-width: 768px)", () => {
        gsap.to(storyContent, {
          y: -500,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            end: "80% center",
            scrub: 2,
            invalidateOnRefresh: true,
          },
        });
      });
      media.add("(max-width: 767px)", () => {
        gsap.to(storyContent, {
          y: -100,
          ease: "none",
          scrollTrigger: {
            trigger: right,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
            invalidateOnRefresh: true,
          },
        });
      });
      return () => media.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="jason-life"
      aria-labelledby="jason-life-title"
    >
      <div className="jason-life-grid">
        <div className="jason-life-left">
          <h2 id="jason-life-title">
            Another day in
            <br />
            paradise, right?
          </h2>
          <Photo
            src="/images/jason-5.jpg"
            alt="Jason overlooking the city at night"
            className="jason-life-night"
          />
          <Photo
            src="/images/jason-6.jpg"
            alt="Jason fishing from a boat"
            className="jason-life-boat"
          />
        </div>
        <div className="jason-life-right">
          <p>
            Meeting Lucia could be the best or worst thing to ever happen to
            him. Jason knows how he'd like it to turn out but right now, it's
            hard to tell.
          </p>
          <Photo
            src="/images/jason-4.jpg"
            alt="Jason holding his phone outside a hotel"
            className="jason-life-hotel"
          />
        </div>
      </div>
    </section>
  );
};

export default JasonLife;
