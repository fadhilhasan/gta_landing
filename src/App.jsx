import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import FirstVideo from "./sections/FirstVideo";
import Jason from "./sections/Jason";
import SecondVideo from "./sections/SecondVideo";
import Lucia from "./sections/Lucia";
import PostCard from "./sections/PostCard";
import Final from "./sections/Final";
import Outro from "./sections/Outro";

gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(0);

const App = () => {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.08,
      smoothWheel: true,
    });

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
    };
  }, []);

  return (
    <main>
      <Navbar />
      <Hero />
      <FirstVideo />
      <Jason />
      <SecondVideo />
      <Lucia />
      <PostCard />
      <Final />
      <Outro />
    </main>
  );
};

export default App;
