import { Runway } from "./runway";
import { VideoBackdrop } from "./videoBackdrop";

const MEDIA_BUCKET = process.env.NEXT_PUBLIC_SITE_MEDIA_BUCKET ?? "gogter-site-media";

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

type LandingAsset = {
  path: string;
  name: string;
  kind: "image" | "video";
  contentType: string;
  altText: string;
};

type LandingManifest = {
  assets: LandingAsset[];
  slots: Record<string, string | undefined>;
};

async function loadLandingMedia(): Promise<LandingManifest | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!supabaseUrl) return null;

  try {
    const response = await fetch(
      `${supabaseUrl}/storage/v1/object/public/${MEDIA_BUCKET}/site-media.json`,
      { next: { revalidate: 30 } },
    );
    if (!response.ok) return null;

    return (await response.json()) as LandingManifest;
  } catch {
    return null;
  }
}

function mediaUrl(asset: LandingAsset | undefined, fallback: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!asset || !supabaseUrl) return fallback;

  const path = asset.path.split("/").map(encodeURIComponent).join("/");
  return `${supabaseUrl}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`;
}

function Brand() {
  return (
    <span className="brand">
      <img src="/gogter.png" alt="" />
      <span>Gogter</span>
    </span>
  );
}

export default async function Home() {
  const manifest = await loadLandingMedia();
  const assigned = (slot: string) => {
    const path = manifest?.slots?.[slot];
    return path ? manifest?.assets?.find((asset) => asset.path === path) : undefined;
  };

  return (
    <main className="gogter-film">
      <header className="film-nav">
        <Brand />
        <a className="nav-cta" href="#get">GET THE APP</a>
      </header>

      <section className="film-hero">
        <VideoBackdrop
          src={mediaUrl(assigned("hero_video"), clips.hero.src)}
          poster={mediaUrl(assigned("hero_photo_main"), clips.hero.poster)}
        />
        <div className="hero-image-wash" />
        <div className="hero-image-stack" aria-hidden="true">
          <img
            className="hero-photo hero-photo-main"
            src={mediaUrl(assigned("hero_photo_main"), clips.place.image)}
            alt=""
          />
          <img
            className="hero-photo hero-photo-side"
            src={mediaUrl(assigned("hero_photo_side"), clips.hello.image)}
            alt=""
          />
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
          { image: mediaUrl(assigned("story_place"), clips.place.image), title: "A PLACE" },
          { image: mediaUrl(assigned("story_hello"), clips.hello.image), title: "A HELLO" },
          { image: mediaUrl(assigned("story_together"), clips.together.image), title: "TOGETHER" },
        ]}
      />

      <section className="poster-break" data-dark>
        <p className="poster-word">LOOK<br /><span>UP.</span></p>
      </section>

      <section className="photo-finale" id="get">
        <img
          className="finale-image"
          src={mediaUrl(assigned("finale_image"), clips.hero.poster)}
          alt={assigned("finale_image")?.altText ?? "A couple walking together in the city at sunset"}
        />
        <div className="finale-copy">
          <h2>OUT<br /><em>THERE.</em></h2>
        </div>
      </section>

      <footer className="film-footer">
        <nav aria-label="Legal"><a href="/terms">TERMS</a><a href="/privacy">PRIVACY</a></nav>
      </footer>
    </main>
  );
}
