import { useEffect, useRef, useState } from "react";
import TrailerModal from "./sections/TrailerModal";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import FirstVideo from "./sections/FirstVideo";
import Jason from "./sections/Jason";
import MiddleVideo from "./sections/MiddleVideo";
import SecondVideo from "./sections/SecondVideo";
import Lucia from "./sections/Lucia";
import PostCard from "./sections/PostCard";
import Final from "./sections/Final";
import Outro from "./sections/Outro";

gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(0);

const App = () => {
  const [trailerOpen, setTrailerOpen] = useState(false);
  const lenisRef = useRef(null);
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.08,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    const updateScroll = (time) => lenis.raf(time * 1000);
    const resizeScroll = () => lenis.resize();

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(updateScroll);
    ScrollTrigger.addEventListener("refresh", resizeScroll);
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(updateScroll);
      ScrollTrigger.removeEventListener("refresh", resizeScroll);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (trailerOpen) lenisRef.current?.stop();
    else lenisRef.current?.start();
  }, [trailerOpen]);

  return (
    <main>
      <Navbar />
      <Hero onOpenTrailer={() => setTrailerOpen(true)} />
      <FirstVideo />
      <Jason />
      <MiddleVideo />
      <SecondVideo />
      <Lucia />
      <PostCard />
      <Final />
      <Outro />
      {trailerOpen && <TrailerModal onClose={() => setTrailerOpen(false)} />}
    </main>
  );
};

export default App;
