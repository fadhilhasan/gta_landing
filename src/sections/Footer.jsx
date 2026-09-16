const socials = [
  ["X", "https://x.com/rockstargames"],
  ["Instagram", "https://instagram.com/rockstargames"],
  ["YouTube", "https://www.youtube.com/rockstargames"],
  ["TikTok", "https://www.tiktok.com/@rockstargames"],
  ["Facebook", "https://www.facebook.com/rockstargames"],
  ["Twitch", "https://twitch.tv/rockstargames"],
  ["Discord", "https://discord.gg/rockstargames"],
];

export default function Footer() {
  return (
    <footer className="outro-footer" aria-label="Rockstar Games links">
      <a
        className="footer-newsletter"
        href="https://www.rockstargames.com/newswire"
        target="_blank"
        rel="noreferrer"
      >
        <strong className="md:text-lg">
          <span className="footer-rockstar-icon" aria-hidden="true" />{" "}
          GET ROCKSTAR PROPAGANDA
        </strong>
        <span className="footer-newsletter-description">
          Discover the latest game announcements, events and updates from
          Rockstar Games.
        </span>
      </a>
      <div className="footer-socials" aria-label="Social media">
        {socials.map(([name, href]) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={name}
            title={name}
          >
            <span
              className="footer-social-icon"
              aria-hidden="true"
              style={{
                maskImage: `url(/images/footer/${name.toLowerCase()}.svg)`,
                WebkitMaskImage: `url(/images/footer/${name.toLowerCase()}.svg)`,
              }}
            />
          </a>
        ))}
      </div>
      <div className="footer-legal">
        <a
          href="https://www.rockstargames.com/"
          target="_blank"
          rel="noreferrer"
        >
          Corporate
        </a>
        <a
          href="https://www.rockstargames.com/privacy"
          target="_blank"
          rel="noreferrer"
        >
          Privacy
        </a>
        <a
          href="https://www.rockstargames.com/cookies"
          target="_blank"
          rel="noreferrer"
        >
          Cookie Policy
        </a>
        <a
          href="https://www.rockstargames.com/legal"
          target="_blank"
          rel="noreferrer"
        >
          Legal
        </a>
      </div>
      <p className="footer-rating">
        This website is part of Hasan's journey in learning GSAP
        <br />
        16 September 2026
      </p>
    </footer>
  );
}
