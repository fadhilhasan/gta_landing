import { useEffect, useRef, useState } from "react";
import Loader from "./sections/Loader";
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
import JasonLife from "./sections/JasonLife";
import SecondVideo from "./sections/SecondVideo";
import Lucia from "./sections/Lucia";
import PostCard from "./sections/PostCard";
import Final from "./sections/Final";
import Outro from "./sections/Outro";
import LeonidaExplorer from "./sections/LeonidaExplorer";

gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(0);

const App = () => {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const pendingNavigation = useRef(null);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [explorerOpen, setExplorerOpen] = useState(false);
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
    if (loading || trailerOpen || explorerOpen || menuOpen) lenisRef.current?.stop();
    else {
      lenisRef.current?.start();
      if (pendingNavigation.current !== null) {
        lenisRef.current?.scrollTo(pendingNavigation.current);
        pendingNavigation.current = null;
      }
    }
  }, [loading, trailerOpen, explorerOpen, menuOpen]);

  return (
    <>
    {loading && <Loader onComplete={setLoading} />}
    <main inert={loading} aria-busy={loading}>
      <Navbar open={menuOpen} onOpen={() => setMenuOpen(true)} onClose={(target) => {
        pendingNavigation.current = target ?? null;
        setMenuOpen(false);
      }} />
      <Hero onOpenTrailer={() => setTrailerOpen(true)} />
      <FirstVideo />
      <Jason />
      <MiddleVideo />
      <JasonLife />
      <SecondVideo />
      <Lucia />
      <PostCard onExplore={() => setExplorerOpen(true)} />
      <Final />
      <Outro />
      {trailerOpen && <TrailerModal onClose={() => setTrailerOpen(false)} />}
      {explorerOpen && <LeonidaExplorer onClose={() => setExplorerOpen(false)} />}
    </main>
    </>
  );
};

export default App;
