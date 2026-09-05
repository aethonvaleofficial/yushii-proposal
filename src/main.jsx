import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { content } from "./content";
import "./styles.css";
import "./reaction.css";

const stars = Array.from({ length: 72 }, (_, i) => ({ id: i, x: (i * 37.31) % 100, y: (i * 61.17) % 100, size: 1 + ((i * 13) % 4), delay: (i % 11) * -0.45 }));

function Sparkle({ className = "" }) { return <span className={`sparkle ${className}`}>✦</span>; }

function Kitty({ onClick, hint, className = "" }) {
  return <button className={`kitty ${className}`} onClick={onClick} aria-label="A tiny cosmic kitty. Tap for a secret.">
    <span className="kitty-ear left" /><span className="kitty-ear right" />
    <span className="kitty-face"><i className="eye l" /><i className="eye r" /><b>ᴗ</b></span><span className="kitty-bow">✦</span>
    {hint && <span className="kitty-hint">{hint}</span>}
  </button>;
}

function MediaFrame({ memory, index }) {
  if (memory.video) return <video className="memory-media" muted loop controls playsInline preload="metadata" src={memory.video} />;
  if (memory.image) return <img className="memory-media" src={memory.image} alt={memory.title || "A memory of Yushii"} loading="lazy" />;
  return <div className={`media-placeholder ${memory.accent || "rose"}`}><span>{["♡", "✦", "☾"][index % 3]}</span><em>your photo</em></div>;
}

function HeartBurst({ active }) {
  if (!active) return null;
  return <div className="heart-burst" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ "--i": i }}>♥</i>)}</div>;
}

function VanScene() {
  return <div className="van-scene" aria-label="An illustrated tiny home on wheels under a pink cosmic sky">
    <div className="moon">☾<span>🐱</span></div><div className="mountain m-one" /><div className="mountain m-two" /><div className="road" />
    <div className="van"><i className="van-window one" /><i className="van-window two" /><i className="van-light" /><i className="wheel left" /><i className="wheel right" /><span className="van-heart">♥</span></div>
  </div>;
}

function App() {
  const [entered, setEntered] = useState(false);
  const [scene, setScene] = useState(0);
  const [kittyClicks, setKittyClicks] = useState(0);
  const [burst, setBurst] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [postAnswer, setPostAnswer] = useState("idle");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isAccepting, setIsAccepting] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!entered || !content.media.music || !audioRef.current) return;
    audioRef.current.volume = 0.22;
    audioRef.current.play().catch(() => {});
  }, [entered]);

  useEffect(() => {
    const updateScene = () => {
      const sections = [...document.querySelectorAll("[data-scene]")];
      if (!sections.length) return;
      const marker = window.innerHeight * 0.4;
      const current = sections.reduce((best, item) => Math.abs(item.getBoundingClientRect().top - marker) < Math.abs(best.getBoundingClientRect().top - marker) ? item : best, sections[0]);
      setScene(Number(current.dataset.scene));
    };
    updateScene(); window.addEventListener("scroll", updateScene, { passive: true });
    return () => window.removeEventListener("scroll", updateScene);
  }, []);

  useEffect(() => {
    if (postAnswer !== "reaction") return undefined;
    const finaleTimer = window.setTimeout(() => setPostAnswer("finale"), 4200);
    return () => window.clearTimeout(finaleTimer);
  }, [postAnswer]);

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const enter = () => { setEntered(true); go("world"); };
  const kittyClick = () => { setKittyClicks((clicks) => clicks + 1); setBurst(true); window.setTimeout(() => setBurst(false), 900); };
  const accept = (answer) => {
    if (postAnswer !== "idle" || isAccepting) return;
    setIsAccepting(true);
    setSelectedAnswer(answer);
    setBurst(true);
    window.setTimeout(() => { setBurst(false); setPostAnswer("reaction"); }, 600);
  };
  const toggleAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted; setIsMuted(!isMuted); audioRef.current.play().catch(() => {});
  };

  return <main className={`experience ${entered ? "entered" : ""} ${postAnswer !== "idle" ? "has-answer" : ""} ${postAnswer === "finale" ? "is-final" : ""}`}>
    {content.media.music && <audio ref={audioRef} src={content.media.music} loop muted />}
    <div className="noise" /><div className="orb orb-one" /><div className="orb orb-two" /><div className="orb orb-three" />
    <div className="starfield" aria-hidden="true">{stars.map((star) => <i key={star.id} style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size, animationDelay: `${star.delay}s` }} />)}</div>
    <HeartBurst active={burst} />
    {entered && <nav className="topbar" aria-label="Journey progress"><button className="brand" onClick={() => go("opening")} aria-label="Back to the beginning">Y <Sparkle /></button><span>{String(scene + 1).padStart(2, "0")} / 07</span>{content.media.music ? <button className="sound" onClick={toggleAudio}>{isMuted ? "sound off" : "sound on"}</button> : <span className="sound dim">made with ♡</span>}</nav>}

    <section id="opening" data-scene="0" className="arrival section" aria-label="Opening">
      <div className="arrival-copy"><p className="eyebrow">{content.opening.eyebrow}</p><h1>{content.opening.title}</h1><p className="intro-sub">{content.opening.subtitle}</p><button className="enter-button" onClick={enter}>{content.opening.button} <Sparkle /></button></div>
      <div className="arrival-constellation" aria-hidden="true"><span /><span /><span /><span /><b>♡</b></div><p className="scroll-cue">made for one very special girl</p>
    </section>

    <div className="journey" aria-hidden={!entered}>
      <section id="world" data-scene="1" className="section world-section"><div className="section-number">02 — THE LITTLE UNIVERSE</div><p className="eyebrow">WELCOME, YUSHII</p><div className="world-copy">{content.universeLines.map((line, i) => <p key={line} className={`reveal reveal-${i}`}>{line}</p>)}</div><button className="soft-link" onClick={() => go("memories")}>follow the stardust <span>↓</span></button></section>

      <section id="memories" data-scene="2" className="section memories-section"><div className="section-number">03 — LITTLE MEMORIES</div><div className="section-heading"><div><p className="eyebrow">A CONSTELLATION OF US</p><h2>Little places<br />to keep forever.</h2></div><p className="side-note">REAL MOMENTS<br />GO HERE ✦</p></div><div className="memory-grid">{content.memories.map((memory, index) => <article className={`memory-card card-${index}`} key={memory.id}><div className="polaroid"><MediaFrame memory={memory} index={index} /><div className="tape" /></div>{(memory.date || memory.title || memory.description) && <div className="memory-caption">{memory.date && <p className="memory-date">{memory.date}</p>}{memory.title && <h3>{memory.title}</h3>}{memory.description && <p className="memory-description">{memory.description}</p>}</div>}</article>)}</div></section>

      <section id="letter" data-scene="3" className="section letter-section"><div className="section-number">04 — THINGS I WANT YOU TO KNOW</div><div className="letter-card"><div className="letter-stamp">TO YUSHII<br />WITH ♡</div><p className="eyebrow">{content.letter.intro}</p><h2>{content.letter.heading}</h2><div className="letter-lines">{content.letter.paragraphs.map((line, index) => <p key={`${index}-${line}`} style={{ "--d": `${Math.min(index * 0.04, 1.3)}s` }}>{line}</p>)}</div><p className="signed">{content.letter.signature}</p></div></section>

      <section id="kitty-zone" data-scene="4" className="kitty-section section" aria-label="A tiny kitty guide"><div className="section-number">05 — A LITTLE MAGIC</div><div className="kitty-glow" /><Kitty onClick={kittyClick} hint={kittyClicks >= 5 ? content.kitty.secret : "tap me"} /><div className="kitty-copy"><p className="eyebrow">YOUR LITTLE COMPANION</p><h2>{kittyClicks >= 3 ? content.kitty.baun : content.kitty.greeting}</h2><p>{kittyClicks >= 5 ? content.kitty.karate : "She has a soft spot for pink stardust and secret messages."}</p></div><span className="paw p1">♥</span><span className="paw p2">♥</span><span className="paw p3">♥</span></section>

      <section id="adventures" data-scene="5" className="section adventure-section"><div className="section-number">06 — THE WORLD AHEAD</div><div className="adventure-copy"><p className="eyebrow">{content.adventures.eyebrow}</p><h2>{content.adventures.title}</h2><p>{content.adventures.copy}</p><div className="adventure-tags">{content.adventures.items.map((item) => <span key={item}>{item}</span>)}</div></div><VanScene /></section>

      <section id="proposal" data-scene="6" className="section proposal-section"><div className="section-number">07 — ONE LAST QUESTION</div><div className="proposal-halo" /><div className="proposal-content"><p className="eyebrow">ONE LAST QUESTION</p><p className="her-name">{content.names.her}...</p><h2>{content.proposal.question}</h2><div className="choice-row"><button className={`yes-button ${selectedAnswer === "yes" ? "chosen" : ""}`} onClick={() => accept("yes")} disabled={isAccepting}>{content.proposal.yes}</button><button className={`yes-button secondary ${selectedAnswer === "of-course" ? "chosen" : ""}`} onClick={() => accept("of-course")} disabled={isAccepting}>{content.proposal.ofCourse}</button></div><p className="choice-note">two beautiful answers, whenever you’re ready</p></div><Kitty onClick={kittyClick} className="proposal-kitty" /></section>
    </div>

    <section className={`reaction ${postAnswer === "reaction" ? "show" : ""}`} aria-live="assertive" aria-hidden={postAnswer !== "reaction"}><div className="reaction-glow" /><div className="reaction-hearts" aria-hidden="true">♥　✦　♥</div><p>{content.reaction}</p></section>
    <section className={`finale ${postAnswer === "finale" ? "show" : ""}`} aria-live="polite" aria-hidden={postAnswer !== "finale"}><div className="finale-glow" /><div className="final-copy"><p className="eyebrow">OUR LITTLE UNIVERSE</p>{content.finale.lines.map((line, index) => <p className={`final-line f${index}`} key={line}>{line}</p>)}<p className="final-sign">{content.finale.signature}</p></div><div className="moon-kitty" aria-hidden="true">☾<span>🐱</span></div><div className="final-paws" aria-hidden="true">♥　♥　♥</div></section>
  </main>;
}

createRoot(document.getElementById("root")).render(<App />);
