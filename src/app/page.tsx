import { Runway } from "./runway";
import { VideoBackdrop } from "./videoBackdrop";

const clips = {
  // Pexels 8575032: a couple walking through a city plaza at sunset.
  hero: {
    src: "https://videos.pexels.com/video-files/8575032/8575032-hd_1920_1080_30fps.mp4",
    poster: "https://images.pexels.com/videos/8575032/administration-adult-architecture-battle-8575032.jpeg?auto=compress&dpr=1&h=750&w=1260",
  },
  // Pexels 4730979: still image of a couple embracing by the ocean.
  place: {
    image: "https://images.pexels.com/videos/4730979/pexels-photo-4730979.jpeg?auto=compress&dpr=1&h=750&w=1260",
  },
  // Pexels 6028850: still image of a couple strolling beside the ocean.
  hello: {
    image: "https://images.pexels.com/videos/6028850/pexels-photo-6028850.jpeg?auto=compress&dpr=1&h=750&w=1260",
  },
  // Pexels 7767968: still image of a couple walking along the beach.
  together: {
    image: "https://images.pexels.com/videos/7767968/at-the-beach-beach-beach-lovers-beach-sand-7767968.jpeg?auto=compress&dpr=1&h=750&w=1260",
  },
};

function Brand() {
  return (
    <span className="brand">
      <img src="/gogter.png" alt="" />
      <span>Gogter</span>
    </span>
  );
}

export default function Home() {
  return (
    <main className="gogter-film">
      <header className="film-nav">
        <Brand />
        <a className="nav-cta" href="#get">GET THE APP</a>
      </header>

      <section className="film-hero">
        <VideoBackdrop src={clips.hero.src} poster={clips.hero.poster} />
        <div className="hero-image-wash" />
        <div className="hero-image-stack" aria-hidden="true">
          <img className="hero-photo hero-photo-main" src={clips.place.image} alt="" />
          <img className="hero-photo hero-photo-side" src={clips.hello.image} alt="" />
        </div>
        <div className="hero-copy">
          <h1 className="film-title reveal">
            REAL-LIFE<br />
            <span>CONNECTIONS.</span>
          </h1>
        </div>
      </section>

      <Runway
        id="story"
        slides={[
          { image: clips.place.image, title: "A PLACE" },
          { image: clips.hello.image, title: "A HELLO" },
          { image: clips.together.image, title: "TOGETHER" },
        ]}
      />

      <section className="poster-break" data-dark>
        <p className="poster-word">LOOK<br /><span>UP.</span></p>
      </section>

      <section className="photo-finale" id="get">
        <img className="finale-image" src={clips.hero.poster} alt="A couple walking together in the city at sunset" />
        <div className="finale-copy">
          <h2>OUT<br /><em>THERE.</em></h2>
          <a className="final-cta" href="mailto:hello@gogter.com">CONTACT GOGTER</a>
        </div>
      </section>

      <footer className="film-footer">
        <nav aria-label="Legal"><a href="/terms">TERMS</a><a href="/privacy">PRIVACY</a></nav>
      </footer>
    </main>
  );
}
