"use client";

const APP_STORE_URL =
  process.env.NEXT_PUBLIC_APP_STORE_URL ?? "https://apps.apple.com/search?term=Gogter";
const PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL ??
  "https://play.google.com/store/apps/details?id=com.gogter.app";

export function StoreLinks({ appStoreUrl, googlePlayUrl }: { appStoreUrl?: string; googlePlayUrl?: string }) {
  const appStoreHref = appStoreUrl || APP_STORE_URL;
  const googlePlayHref = googlePlayUrl || PLAY_STORE_URL;

  return (
    <div className="store-downloads">
      <div className="store-market-links">
        <a className="store-market-link store-market-link-apple" href={appStoreHref} target="_blank" rel="noopener noreferrer" aria-label="Download Gogter from the Apple App Store">
          <svg className="store-brand-icon store-apple-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M16.37 12.58c.02 2.16 1.9 2.88 1.92 2.89-.02.05-.3 1.03-.99 2.04-.6.87-1.23 1.73-2.22 1.75-.97.02-1.28-.57-2.4-.57s-1.47.55-2.38.59c-.96.04-1.69-.94-2.3-1.8-1.25-1.77-2.2-5-.92-7.18.64-1.08 1.78-1.76 3.02-1.78.94-.02 1.82.63 2.4.63.58 0 1.67-.78 2.82-.67.48.02 1.83.19 2.7 1.45-.07.04-1.62.95-1.65 2.65ZM14.52 6.9c.5-.6.84-1.44.75-2.28-.72.03-1.59.48-2.1 1.08-.46.53-.87 1.38-.76 2.2.8.06 1.62-.4 2.11-1Z" />
          </svg>
          <span className="store-market-copy"><small>Download on the</small><strong>App Store</strong></span>
          <span className="store-market-arrow" aria-hidden="true">↗</span>
        </a>
        <a className="store-market-link store-market-link-google" href={googlePlayHref} target="_blank" rel="noopener noreferrer" aria-label="Get Gogter on Google Play">
          <svg className="store-brand-icon store-play-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#34A853" d="M2.7 2.4c-.4.4-.7 1-.7 1.8v15.6c0 .8.3 1.4.7 1.8L12 12 2.7 2.4Z" />
            <path fill="#4285F4" d="m15.1 8.8-3.1 3.2 3.1 3.2 4.1-2.3c1.1-.6 1.1-1.2 0-1.8l-4.1-2.3Z" />
            <path fill="#FBBC04" d="m2.7 2.4 9.3 9.6 3.1-3.2-9.8-5.5c-1-.6-1.9-.8-2.6-.9Z" />
            <path fill="#EA4335" d="m2.7 21.6 9.3-9.6 3.1 3.2-9.8 5.5c-1 .6-1.9.8-2.6.9Z" />
          </svg>
          <span className="store-market-copy"><small>GET IT ON</small><strong>Google Play</strong></span>
          <span className="store-market-arrow" aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}
