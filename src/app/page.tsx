import type { CSSProperties } from "react";

/*
 * The landing page.
 *
 * It reads as a stack of posters on warm paper: the collage hero, a strip of
 * people, three steps, the ink banner the name crashes through, and what the
 * app actually does. Sections are colour bands rather than boxes, which is
 * what makes the scroll feel like turning pages.
 *
 * The rule the page is written to: show it, do not explain it. Every block
 * is a picture and a handful of words — the longest sentence here is one
 * line, because nobody reads a landing page, they look at one.
 */

const photos = {
  hero: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=88",
  cafe: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=85",
  park: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=700&q=85",

  /* The strip: couples, candid, cut out and pinned at angles. */
  strip: [
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=560&q=80",
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=560&q=80",
    "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=560&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=560&q=80",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=560&q=80",
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=560&q=80",
    "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=560&q=80",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=560&q=80",
  ],

  /* The row that runs the other way. */
  stripB: [
    "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=560&q=80",
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=560&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=560&q=80",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=560&q=80",
    "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=560&q=80",
    "https://images.unsplash.com/photo-1524293581917-878a6d017c71?auto=format&fit=crop&w=560&q=80",
    "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=560&q=80",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=560&q=80",
  ],

  /* One picture per thing the app does. */
  hearts: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=760&q=85",
  paths: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=760&q=85",
  coffee: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=760&q=85",

  faces: [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=96&h=96&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&h=96&q=80",
    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=96&h=96&q=80",
  ],
};

/** A delay for the staggered reveals, typed so the custom property passes. */
const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

function Arrow() {
  return (
    <span className="btn-arrow" aria-hidden="true">
      ↗
    </span>
  );
}

function Brand() {
  return (
    <a className="brand" href="/" aria-label="Gogter home">
      <span className="brand-mark">
        <img src="/gogter.png" alt="" />
      </span>
      <span className="brand-word">gogter</span>
    </a>
  );
}

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <>
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, copy) => (
            <span key={copy}>
              LEAVE A HEART SOMEWHERE REAL · MEET WHOEVER PICKS IT UP · GOOD THINGS HAPPEN CLOSE ·
              LEAVE A HEART SOMEWHERE REAL · MEET WHOEVER PICKS IT UP · GOOD THINGS HAPPEN CLOSE ·
            </span>
          ))}
        </div>
      </div>

      <header className="nav-shell">
        <nav className="nav" aria-label="Main">
          <Brand />
          <div className="nav-links">
            <a href="#how">How it works</a>
            <a href="#what">What you get</a>
          </div>
          <a className="btn btn-red" href="#get">
            <span>Get the app</span>
            <Arrow />
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="wrap hero">
          <div className="hero-copy">
            <p className="eyebrow reveal">Good things happen close</p>

            <h1 className="display reveal" style={delay(60)}>
              Say hello,
              <br />
              right <em>around</em>
              <br />
              you.
            </h1>

            <p className="lede reveal" style={delay(140)}>
              Leave a heart where you are. Meet whoever picks it up.
            </p>

            <div className="hero-actions reveal" style={delay(200)}>
              <a className="btn btn-red" href="#get">
                <span>Get the app</span>
                <Arrow />
              </a>
              <a className="btn" href="#how">
                <span>See how it works</span>
              </a>
            </div>

            <div className="proof reveal" style={delay(260)}>
              <div className="faces" aria-hidden="true">
                {photos.faces.map((src) => (
                  <img key={src} src={src} alt="" />
                ))}
                <span>+</span>
              </div>
              <span>A good hello can change your day.</span>
            </div>
          </div>

          <div className="collage reveal" style={delay(120)}>
            <div
              className="photo photo-a"
              data-parallax="-0.03"
              style={{ translate: "0 var(--shift, 0px)" }}
            >
              <img src={photos.hero} alt="Two friends laughing together outdoors" />
            </div>

            <div
              className="photo photo-b float-slow"
              data-parallax="0.05"
              style={{ translate: "0 var(--shift, 0px)" }}
            >
              <img src={photos.cafe} alt="People sharing a table at a warm café" />
            </div>

            <div className="photo photo-c float">
              <img src={photos.park} alt="A couple close together outside" />
            </div>

            <span className="sticker sticker-sun sticker-1 float" aria-hidden="true">
              ⌖ 30 metres away
            </span>
            <span className="sticker sticker-red sticker-2 float-slow" aria-hidden="true">
              ♥ Heart left here
            </span>
            <span className="sticker sticker-mint sticker-3 float" aria-hidden="true">
              ✓ Picked up
            </span>
          </div>
        </section>

{/* People, passing. No caption — the pictures are the point. */}
        <div className="strip" aria-hidden="true">
          <div className="strip-track">
            {[...photos.strip, ...photos.strip].map((src, i) => (
              <figure key={`a-${src}-${i}`}>
                <img src={src} alt="" loading="lazy" />
              </figure>
            ))}
          </div>

          <div className="strip-track back">
            {[...photos.stripB, ...photos.stripB].map((src, i) => (
              <figure key={`b-${src}-${i}`}>
                <img src={src} alt="" loading="lazy" />
              </figure>
            ))}
          </div>
        </div>

        <section className="section band-white" id="how">
          <div className="wrap">
            <div className="head">
              <p className="eyebrow reveal">How it works</p>
              <h2 className="display-sm reveal" style={delay(60)}>
                Three steps,
                <br />
                <em>no small talk.</em>
              </h2>
            </div>

            <div className="steps">
              {[
                { n: "01", title: "Leave a heart", body: "Somewhere you actually like." },
                { n: "02", title: "Someone picks it up", body: "Only people standing there can." },
                { n: "03", title: "Take it from there", body: "You already have somewhere in common." },
              ].map((step, i) => (
                <article className="step reveal" key={step.n} style={delay(i * 90)}>
                  <span className="step-no">{step.n}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* The broadsheet moment: the name, at the size of the page. */}
        <section className="banner">
          <div className="wrap">
            <p className="display reveal">gogter</p>
            <p className="reveal" style={delay(120)}>
              For the people already near you.
            </p>
          </div>
        </section>

        <section className="section" id="what">
          <div className="wrap">
            <div className="head">
              <p className="eyebrow reveal">What you get</p>
              <h2 className="display-sm reveal" style={delay(60)}>
                Three ways to
                <br />
                <em>actually meet.</em>
              </h2>
            </div>

            <div className="features">
              {[
                { title: "Hearts at places", tag: "The main thing", img: photos.hearts },
                { title: "Paths crossed", tag: "Quietly uncanny", img: photos.paths },
                { title: "Coffee dates", tag: "Straight to it", img: photos.coffee },
              ].map((f, i) => (
                <article className="feature reveal" key={f.title} style={delay(i * 90)}>
                  <div className="feature-photo">
                    <img src={f.img} alt="" />
                  </div>
                  <h3>{f.title}</h3>
                  <span className="tag">{f.tag}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section band-sand" id="get">
          <div className="wrap closing">
            <img className="logo-big reveal" src="/gogter.png" alt="Gogter" />
            <h2 className="display reveal" style={delay(60)}>
              Go on. <em>Say hello.</em>
            </h2>
            <div className="hero-actions reveal" style={delay(140)}>
              <a className="btn btn-red" href="#top">
                <span>Get the app</span>
                <Arrow />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <Brand />
          <nav className="footer-links" aria-label="Legal">
            <a href="/terms">Terms of Use</a>
            <a href="/privacy">Privacy Policy</a>
          </nav>
          <small>© {year} Gogter</small>
        </div>
      </footer>
    </>
  );
}
