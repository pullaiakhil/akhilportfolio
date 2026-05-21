
import { useState, useEffect, useRef } from "react";
import { FaLinkedinIn, FaGithub, FaInstagram } from "react-icons/fa";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import emailjs from "@emailjs/browser";


/* ─────────────────────────── GOOGLE FONT ─────────────────────────── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800;900&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { background: #0C0C0C; font-family: 'Kanit', sans-serif; }
    .hero-heading {
      background: linear-gradient(180deg, #646973 0%, #BBCCD7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
  `}</style>
);

/* ─────────────────────────── FADE IN ─────────────────────────── */
function FadeIn({ children, delay = 0, duration = 0.7, x = 0, y = 30, as = "div", className = "", style = {} }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
      style={style}
    >
      {children}
    </Tag>
  );
}

/* ─────────────────────────── MAGNET ─────────────────────────── */
function Magnet({ children, padding = 150, strength = 3, activeTransition = "transform 0.3s ease-out", inactiveTransition = "transform 0.6s ease-in-out" }) {
  const ref = useRef(null);
  const [style, setStyle] = useState({ transition: inactiveTransition, willChange: "transform" });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const inRange =
        e.clientX > rect.left - padding &&
        e.clientX < rect.right + padding &&
        e.clientY > rect.top - padding &&
        e.clientY < rect.bottom + padding;
      if (inRange) {
        setStyle({ transform: `translate3d(${dx / strength}px,${dy / strength}px,0)`, transition: activeTransition, willChange: "transform" });
      } else {
        setStyle({ transform: "translate3d(0,0,0)", transition: inactiveTransition, willChange: "transform" });
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [padding, strength, activeTransition, inactiveTransition]);

  return <div ref={ref} style={style}>{children}</div>;
}

/* ─────────────────────────── ANIMATED TEXT ─────────────────────────── */
function AnimatedText({ text, className = "" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.2"] });
  const chars = text.split("");

  return (
    <p ref={ref} className={className} style={{ position: "relative" }}>
      {chars.map((char, i) => {
        const start = i / chars.length;
        const end = (i + 1) / chars.length;
        return (
          <CharSpan key={i} char={char} start={start} end={end} scrollYProgress={scrollYProgress} />
        );
      })}
    </p>
  );
}

function CharSpan({ char, start, end, scrollYProgress }) {
  const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);
  return (
    <span style={{ position: "relative", display: "inline" }}>
      <span style={{ opacity: 0.15 }}>{char}</span>
      <motion.span style={{ opacity, position: "absolute", left: 0, top: 0 }}>{char}</motion.span>
    </span>
  );
}

/* ─────────────────────────── CONTACT BUTTON ─────────────────────────── */
function ContactButton() {
  return (
    <a
      href="#contact-form"
      style={{ textDecoration: "none" }}
    >
      <button
        style={{
          background:
            "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
          boxShadow:
            "0px 4px 4px rgba(181,1,167,0.25), inset 4px 4px 12px #7721B1",
          outline: "2px solid white",
          outlineOffset: "-3px",
          borderRadius: "9999px",
          color: "white",
          fontFamily: "Kanit, sans-serif",
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          border: "none",
          cursor: "pointer",
          padding: "clamp(10px,1.5vw,16px) clamp(28px,4vw,48px)",
          fontSize: "clamp(0.7rem, 1.1vw, 1rem)",
        }}
      >
        Contact Me
      </button>
    </a>
  );
}

function LiveProjectButton({ link }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        borderRadius: "9999px",
        border: "2px solid #D7E2EA",
        color: "#D7E2EA",
        background: "transparent",
        fontFamily: "Kanit, sans-serif",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        cursor: "pointer",
        padding: "clamp(8px,1.2vw,14px) clamp(24px,3.5vw,40px)",
        fontSize: "clamp(0.75rem, 1vw, 0.95rem)",
        transition: "background 0.2s",
        textDecoration: "none",
        display: "inline-block",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "rgba(215,226,234,0.1)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "transparent")
      }
    >
      LIVE PROJECT
    </a>
  );
}

/* ─────────────────────────── HERO SECTION ─────────────────────────── */
function HeroSection() {
  // Akhil's photo uploaded by user
  const portraitUrl = "/profile.jpg";

  return (
    <section style={{ height: "100vh", display: "flex", flexDirection: "column", overflowX: "clip", position: "relative", background: "#0C0C0C" }}>
      {/* Navbar */}
      <FadeIn delay={0} y={-20}>
        <nav style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "clamp(18px,3vw,32px) clamp(20px,5vw,48px) 0",
        }}>
          {["About", "Skills", "Projects", "Contact"].map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} style={{
              color: "#D7E2EA",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontSize: "clamp(0.75rem,1.4vw,1.4rem)",
              textDecoration: "none",
              transition: "opacity 0.2s",
              fontFamily: "Kanit, sans-serif",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >{link}</a>
          ))}
        </nav>
      </FadeIn>

      {/* Hero Heading */}
      <div style={{ overflow: "hidden" }}>
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading" style={{
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            whiteSpace: "nowrap",
            width: "100%",
            fontSize: "clamp(5rem,10vw,9rem)",
            marginTop: "clamp(-20px,-2vw,0px)",
            paddingLeft: "clamp(10px,2vw,24px)",
          }}>
            Hi, i&apos;m Akhil
          </h1>
        </FadeIn>
      </div>

      {/* Bottom bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        flex: 1,
        padding: "0 clamp(20px,4vw,48px) clamp(28px,3vw,40px)",
        position: "relative",
        zIndex: 20,
      }}>
        <FadeIn delay={0.35} y={20}>
          <p style={{
            color: "#D7E2EA",
            fontWeight: 300,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            lineHeight: 1.35,
            fontSize: "clamp(0.72rem,1.4vw,1.5rem)",
            maxWidth: "clamp(160px,22vw,260px)",
          }}>
            I'm PULLAI AKHIL, a B.Tech CSE student passionate about futuristic web development, AI-powered applications, and premium user experiences.
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>

      {/* PHOTO*/}
<div
  style={{
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    bottom: 0,
    zIndex: 10,
    display: "flex",
    gap: "30px",
    alignItems: "center",
  }}
>
  
  {/* Real Photo */}
  <FadeIn delay={0.6} y={30}>
    <Magnet padding={150} strength={3}>
      <img
        src={portraitUrl}
        alt="Akhil"
        style={{
          width: "240px",
          height: "420px",
          objectFit: "cover",
          borderRadius: "30px",
          border: "2px solid rgba(255,255,255,0.1)",
          boxShadow: "0 0 30px rgba(139,92,246,0.3)",
        }}
      />
    </Magnet>
  </FadeIn>

  

</div>
    </section>
  );
}

/* ─────────────────────────── MARQUEE SECTION ─────────────────────────── */
const MARQUEE_GIFS = [
  "/hire.gif",
  "/html.gif",
  "/python.gif",
  "/regulax.gif",
  "/samvaad.gif",
  "/nasa.gif",
  "/front.gif",
  "/back.gif",
  "/full.gif",
  "/ai.gif",
  "/ui.gif",
  "/c.gif",
  "/java.gif",
  "/sql.gif",
];

function MarqueeSection() {
  const sectionRef = useRef(null);
  const [offset, setOffset] = useState(200);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const raw = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(raw);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const row1 = [...MARQUEE_GIFS.slice(0, 11), ...MARQUEE_GIFS.slice(0, 11), ...MARQUEE_GIFS.slice(0, 11)];
  const row2 = [...MARQUEE_GIFS.slice(11), ...MARQUEE_GIFS.slice(11), ...MARQUEE_GIFS.slice(11)];

  return (
    <section ref={sectionRef} style={{ background: "#0C0C0C", paddingTop: "clamp(80px,12vw,160px)", paddingBottom: 40, overflow: "hidden" }}>
      {/* Row 1 – moves right */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12, transform: `translateX(${offset - 200}px)`, willChange: "transform", transition: "transform 0.05s linear" }}>
        {row1.map((src, i) => (
          <img key={i} src={src} alt="" loading="lazy"
            style={{ width: 420, height: 270, borderRadius: 16, objectFit: "cover", flexShrink: 0 }} />
        ))}
      </div>
      {/* Row 2 – moves left */}
      <div style={{ display: "flex", gap: 12, transform: `translateX(${-(offset - 200)}px)`, willChange: "transform", transition: "transform 0.05s linear" }}>
        {row2.map((src, i) => (
          <img key={i} src={src} alt="" loading="lazy"
            style={{ width: 420, height: 270, borderRadius: 16, objectFit: "cover", flexShrink: 0 }} />
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── ABOUT SECTION ─────────────────────────── */
function AboutSection() {
  return (
    <section id="about" style={{
      minHeight: "100vh",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "clamp(60px,10vw,120px) clamp(20px,5vw,48px)",
      background: "#0C0C0C",
      overflow: "hidden",
    }}>
      {/* Decorative images */}
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9}>
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
          alt="" style={{ width: "clamp(80px,14vw,210px)", position: "absolute", top: "4%", left: "clamp(8px,4%,48px)" }} />
      </FadeIn>
      <FadeIn delay={0.25} x={-80} y={0} duration={0.9}>
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
          alt="" style={{ width: "clamp(70px,12vw,180px)", position: "absolute", bottom: "8%", left: "clamp(16px,10%,80px)" }} />
      </FadeIn>
      <FadeIn delay={0.15} x={80} y={0} duration={0.9}>
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
          alt="" style={{ width: "clamp(80px,14vw,210px)", position: "absolute", top: "4%", right: "clamp(8px,4%,48px)" }} />
      </FadeIn>
      <FadeIn delay={0.3} x={80} y={0} duration={0.9}>
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
          alt="" style={{ width: "clamp(90px,15vw,220px)", position: "absolute", bottom: "8%", right: "clamp(16px,10%,80px)" }} />
      </FadeIn>

      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(32px,6vw,64px)", zIndex: 10, textAlign: "center" }}>
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading" style={{
            fontWeight: 900, textTransform: "uppercase", lineHeight: 1, letterSpacing: "-0.02em",
            fontSize: "clamp(3rem,12vw,160px)",
          }}>About me</h2>
        </FadeIn>

        <p
  style={{
    color: "#D7E2EA",
    fontWeight: 500,
    lineHeight: 1.8,
    maxWidth: "700px",
    fontSize: "clamp(1rem,2vw,1.35rem)",
    fontFamily: "Kanit, sans-serif",
    textAlign: "center",
    opacity: 0.9,
  }}
>
  With a strong foundation in Computer Science, I focus on
  Python, AI, machine learning, and web development.
  I enjoy building futuristic projects.
  Let’s build something incredible together!
</p>

        <div style={{ marginTop: "clamp(24px,4vw,48px)" }}>
          <ContactButton />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── SERVICES / SKILLS SECTION ─────────────────────────── */
const SERVICES = [
  { num: "01", name: "Python & AI", desc: "Expert in Python programming with hands-on experience in machine learning, data science, and AI algorithms — applied to real-world projects like asteroid classification systems." },
  { num: "02", name: "Web Development", desc: "Building responsive and clean web interfaces using HTML, CSS, and JavaScript. Focused on intuitive UI design and smooth user experiences across devices." },
  { num: "03", name: "Machine Learning", desc: "Applying scikit-learn, data analysis, and AI algorithms to build predictive models and classification systems from real datasets like NASA's asteroid catalog." },
  { num: "04", name: "Database & Backend", desc: "Proficient in SQL, Oracle, and MongoDB for data management, combined with core programming skills in C, C++, Java, and JavaScript for full-stack development." },
  { num: "05", name: "AI-Powered Apps", desc: "Developing enterprise-grade AI applications like Samvaad AI (NLP chatbot) and RegulaX AI (compliance platform) with dashboards, automation, and voice/text interfaces." },
];

function ServicesSection() {
  return (
    <section id="skills" style={{
      background: "#FFFFFF",
      borderRadius: "clamp(32px,6vw,60px) clamp(32px,6vw,60px) 0 0",
      padding: "clamp(60px,8vw,128px) clamp(20px,5vw,48px)",
    }}>
      <FadeIn delay={0} y={40}>
        <h2 style={{
          color: "#0C0C0C", fontWeight: 900, textTransform: "uppercase",
          fontSize: "clamp(3rem,12vw,160px)", lineHeight: 1, letterSpacing: "-0.02em",
          textAlign: "center", marginBottom: "clamp(48px,8vw,112px)",
        }}>Skills</h2>
      </FadeIn>

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {SERVICES.map(({ num, name, desc }, i) => (
          <FadeIn key={num} delay={i * 0.1} y={30}>
            <div style={{
              display: "flex", alignItems: "flex-start", gap: "clamp(16px,3vw,40px)",
              padding: "clamp(24px,4vw,48px) 0",
              borderBottom: i < SERVICES.length - 1 ? "1px solid rgba(12,12,12,0.15)" : "none",
              borderTop: i === 0 ? "1px solid rgba(12,12,12,0.15)" : "none",
            }}>
              <span style={{
                fontWeight: 900, color: "#0C0C0C",
                fontSize: "clamp(3rem,10vw,140px)", lineHeight: 1, flexShrink: 0,
              }}>{num}</span>
              <div style={{ paddingTop: "clamp(8px,1.5vw,20px)" }}>
                <div style={{
                  fontWeight: 500, textTransform: "uppercase",
                  fontSize: "clamp(1rem,2.2vw,2.1rem)", color: "#0C0C0C", marginBottom: 8,
                }}>{name}</div>
                <div style={{
                  fontWeight: 300, lineHeight: 1.6, maxWidth: 560,
                  fontSize: "clamp(0.85rem,1.6vw,1.25rem)", color: "#0C0C0C", opacity: 0.6,
                }}>{desc}</div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── PROJECT CARD ─────────────────────────── */
function ProjectCard({ project, index, totalCards, scrollProgress }) {
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollProgress, [index / totalCards, 1], [1, targetScale]);

  return (
    <div style={{ height: "85vh", display: "flex", alignItems: "flex-start", justifyContent: "center", position: "sticky", top: `${24 + index * 28}px` }}>
      <motion.div style={{
        scale,
        width: "100%",
        maxWidth: 1100,
        borderRadius: "clamp(24px,5vw,60px)",
        border: "2px solid #D7E2EA",
        background: "#0C0C0C",
        padding: "clamp(16px,3vw,32px)",
        transformOrigin: "top center",
      }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "clamp(12px,2vw,24px)", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(12px,2vw,28px)" }}>
            <span className="hero-heading" style={{ fontWeight: 900, fontSize: "clamp(3rem,8vw,100px)", lineHeight: 1 }}>
              {project.num}
            </span>
            <div>
              <div style={{ color: "#D7E2EA", opacity: 0.5, fontSize: "clamp(0.7rem,1.2vw,1rem)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                {project.category}
              </div>
              <div style={{ color: "#D7E2EA", fontWeight: 700, fontSize: "clamp(1rem,2.5vw,2rem)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {project.name}
              </div>
            </div>
          </div>
          <LiveProjectButton link={project.liveLink} />
        </div>

        {/* Images */}
        <div style={{ display: "flex", gap: "clamp(8px,1.2vw,16px)" }}>
          {/* Left col */}
          <div style={{ flex: "0 0 40%", display: "flex", flexDirection: "column", gap: "clamp(8px,1.2vw,16px)" }}>
            <img src={project.col1img1} alt="" loading="lazy"
              style={{ width: "100%", height: "clamp(130px,16vw,230px)", objectFit: "cover", borderRadius: "clamp(16px,4vw,50px)" }} />
            <img src={project.col1img2} alt="" loading="lazy"
              style={{ width: "100%", height: "clamp(160px,22vw,340px)", objectFit: "cover", borderRadius: "clamp(16px,4vw,50px)" }} />
          </div>
          {/* Right col */}
          <div style={{ flex: "0 0 60%" }}>
            <img src={project.col2img} alt="" loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "clamp(16px,4vw,50px)" }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const PROJECTS = [
  {
    num: "01", name: "Portfolio",
       liveLink: "https://your-portfolio.vercel.app",
    col1img1: "/portfolio.jpeg",
    col1img2: "/portfolio1.jpeg",
    col2img: "/portfolio2.jpeg",
  },
  {
    num: "02", name: "NASA Asteroid Classification System",
       liveLink: "https://nasa-aestroids-classification.vercel.app/",
    col1img1: "/nasa.jpg",
    col1img2: "/nasa1.jpg",
    col2img: "/nasa2.jpg",
  },
 {
  num: "03",
  name: "RegulaX AI",
     liveLink: "https://regulax-regulax-chzcootv1-pullaiakhils-projects.vercel.app/",
  col1img1: "/regulax.jpeg",
  col1img2: "/regulax1.jpeg",
  col2img: "/regulax2.jpeg",
},
  {
    num: "04", name: "Samvaad AI",
       liveLink: "https://huggingface.co/spaces/SiddharthKotnaka/samvaad-ai-final",
    col1img1: "/samvaad.jpeg",
    col1img2: "/samvaad1.jpeg",
    col2img: "/samvaad2.jpeg",
  },
];

/* ─────────────────────────── PROJECTS SECTION ─────────────────────────── */
function ProjectsSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section id="projects" ref={ref} style={{
      background: "#0C0C0C",
      borderRadius: "clamp(32px,6vw,60px) clamp(32px,6vw,60px) 0 0",
      marginTop: "clamp(-40px,-5vw,-56px)",
      zIndex: 10,
      position: "relative",
      padding: "clamp(60px,8vw,120px) clamp(20px,5vw,48px) clamp(60px,8vw,120px)",
    }}>
      <FadeIn delay={0} y={40}>
        <h2 className="hero-heading" style={{
          fontWeight: 900, textTransform: "uppercase", lineHeight: 1, letterSpacing: "-0.02em",
          fontSize: "clamp(3rem,12vw,160px)", textAlign: "center",
          marginBottom: "clamp(40px,6vw,80px)",
        }}>Project</h2>
      </FadeIn>

      {PROJECTS.map((project, i) => (
        <ProjectCard key={project.num} project={project} index={i} totalCards={PROJECTS.length} scrollProgress={scrollYProgress} />
      ))}
    </section>
  );
}

/* ─────────────────────────── CERTIFICATIONS SECTION ─────────────────────────── */

const CERTS = [
  {
    name: "Google AI Essentials",
    link: "https://drive.google.com/file/d/1lR2QeURJh-VabRbJTnvt-xnPOSuBVP4S/view?usp=sharing",
  },
  {
    name: "Introduction to Data Science",
    link: "https://drive.google.com/file/d/1FVRtCkovD789kBn7mFdOiXmULkVnvaaT/view?usp=sharing",
  },
  {
    name: "Introduction to IOT",
    link: "https://drive.google.com/file/d/1Jk9EBkEtEq-awp9MasbsqaZmpKDmN8jZ/view?usp=sharing",
  },
  {
    name: "Python Essentials",
    link: "https://drive.google.com/file/d/1SctAUr01aeGJfHTSbEgg1TRGE21Hetah/view?usp=sharing",
  },
  {
    name: "Introduction to Modern AI",
    link: "https://drive.google.com/file/d/1wcGAF3Xulqw5O2vfhHGAsMn6rRUcAMOA/view?usp=sharing",
  },
  {
    name: "Introduction to Cybersecurity",
    link: "https://drive.google.com/file/d/1aqVYSs9kgmJA8i9yJh5soLBnfLcUE8jh/view?usp=sharing",
  },
  {
    name: "Networking Basics",
    link: "https://drive.google.com/file/d/1rG41yIExwJngon9SqDISAnWAWP59xF7S/view?usp=sharing",
  },
  {
    name: "Elements of AI",
    link: "https://drive.google.com/file/d/1SpuoxWct-uSqm4Gtt1hfTMl3Y8wJ_wNt/view?usp=sharing",
  },
];


const socialBtn = {
  width: "60px",
  height: "60px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#D7E2EA",
  textDecoration: "none",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.04)",
  transition: "all 0.3s ease",
  fontSize: "20px",
};
const contactInput = {
  width: "100%",
  padding: "16px 20px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "999px",
  color: "#D7E2EA",
  fontSize: "16px",
  outline: "none",
  fontFamily: "Kanit, sans-serif",
};
function CertificationsSection() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_hjjlm4d",
        "template_yrazsgs",
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
        "Am3yDXJzxMQJy31mf"
      )
      .then(() => {
        alert("Message Sent Successfully!");

        setFormData({
          name: "",
          email: "",
          message: "",
        });
      })
      .catch((error) => {
        console.log(error);
        alert("Failed to send message");
      });
  };

  return (
    <section
      id="contact"
      style={{
        background: "#0C0C0C",
        padding: "clamp(60px,8vw,120px) clamp(20px,5vw,48px)",
        textAlign: "center",
      }}
    >

      <FadeIn delay={0} y={40}>
        <h2
          className="hero-heading"
          style={{
            fontWeight: 900,
            textTransform: "uppercase",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            fontSize: "clamp(2.5rem,10vw,130px)",
            marginBottom: "clamp(40px,6vw,80px)",
          }}
        >
          Certifications
        </h2>
      </FadeIn>

      {/* Social Icons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "50px",
          flexWrap: "wrap",
        }}
      >
        <a
          href="https://www.linkedin.com/in/pullai-akhil-40495730b"
          target="_blank"
          rel="noreferrer"
          style={socialBtn}
        >
          <FaLinkedinIn size={20} />
        </a>

        <a
          href="https://github.com/pullaiakhil"
          target="_blank"
          rel="noreferrer"
          style={socialBtn}
        >
          <FaGithub size={20} />
        </a>

        <a
          href="https://www.instagram.com/mr.akhil_002"
          target="_blank"
          rel="noreferrer"
          style={socialBtn}
        >
          <FaInstagram size={20} />
        </a>
      </div>

      {/* Contact Form */}
      <form
        onSubmit={sendEmail}
        id="contact-form"
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          style={contactInput}
          required
        />

        <input
          type="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          style={contactInput}
          required
        />

        <textarea
          placeholder="Your Message"
          rows={6}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          style={{
            ...contactInput,
            resize: "none",
            borderRadius: "20px",
            paddingTop: "18px",
          }}
          required
        />

        <button
          type="submit"
          style={{
            background:
              "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
            border: "none",
            color: "white",
            padding: "16px 30px",
            borderRadius: "999px",
            fontSize: "16px",
            fontWeight: "600",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Send Message
        </button>
      </form>
    </section>
  );
}
/* ─────────────────────────── ROOT ─────────────────────────── */
export default function App() {
    useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  return (
    <>
      <FontLink />
      <div style={{ background: "#0C0C0C", overflowX: "clip", fontFamily: "Kanit, sans-serif" }}>
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <CertificationsSection />
      </div>
    </>
  );
}
