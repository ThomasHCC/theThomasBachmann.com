import { profile, featured, links, gallery } from "./links.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Nur eine Adresse: www → ohne www
    if (url.hostname.startsWith("www.")) {
      url.hostname = url.hostname.slice(4);
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === "/linktree/") {
      return Response.redirect(`${url.origin}/linktree`, 301);
    }
    if (url.pathname === "/linktree") {
      return new Response(renderLinktree(url.origin), {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "public, max-age=300",
          "x-content-type-options": "nosniff",
          "referrer-policy": "strict-origin-when-cross-origin",
        },
      });
    }

    return env.ASSETS.fetch(request);
  },
};

const escape = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const svg = (path) => `<svg viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`;

const ICONS = {
  website: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
  mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  instagram: svg('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8"/>'),
  linkedin: svg('<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>'),
  github: svg('<path d="M9 19c-4 1.5-4-2-6-2.5m12 5v-3.5a3 3 0 0 0-.9-2.3c3-.3 6-1.5 6-6.5a5 5 0 0 0-1.4-3.5 4.6 4.6 0 0 0-.1-3.5s-1.1-.3-3.6 1.4a12.4 12.4 0 0 0-6.5 0C6.1 2.2 5 2.5 5 2.5a4.6 4.6 0 0 0-.1 3.5A5 5 0 0 0 3.5 9.5c0 5 3 6.2 6 6.5a3 3 0 0 0-.9 2.3V22"/>'),
  youtube: svg('<rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/>'),
  x: svg('<path d="M4 4l16 16M20 4 4 20"/>'),
  tiktok: svg('<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.5 3 2.5 5 5.5 5"/>'),
  mic: svg('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'),
  calendar: svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
  link: svg('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
  arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  share: svg('<path d="M12 3v13M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/>'),
};

const isExternal = (url) => /^https?:/.test(url);
const target = (url) => (isExternal(url) ? ' target="_blank" rel="noopener"' : "");

function renderLinktree(origin) {
  const name = `${profile.firstName} ${profile.lastName}`;
  const { cover } = profile;

  const coverImg = `<img src="${escape(cover.src)}" alt="${escape(cover.alt)}" fetchpriority="high"
      style="object-position:${escape(cover.position)}"
      onerror="this.onerror=null;this.src='${escape(cover.fallback)}'">`;

  const items = links
    .map(
      (l, i) => `<li class="reveal" style="--i:${i + 2}"><a class="row" href="${escape(l.url)}"${target(l.url)}>
        <span class="row-icon">${ICONS[l.icon] ?? ICONS.link}</span>
        <span class="row-text"><strong>${escape(l.title)}</strong><small>${escape(l.subtitle)}</small></span>
        <span class="row-arrow">${ICONS.arrow}</span>
      </a></li>`,
    )
    .join("");

  const photos = gallery
    .map(
      (g) => `<figure><img src="${escape(g.src)}" alt="${escape(g.alt)}" loading="lazy" onerror="this.parentNode.remove()"></figure>`,
    )
    .join("");

  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${escape(name)} · Links</title>
<meta name="description" content="${escape(`${profile.claim} ${profile.role}`)}">
<meta property="og:title" content="${escape(name)}">
<meta property="og:description" content="${escape(profile.role)}">
<meta property="og:image" content="${escape(origin + cover.src)}">
<meta name="theme-color" content="#0c0c0b">
<link rel="canonical" href="${escape(origin)}/linktree">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='50' fill='%23ff5b2e'/><text x='50' y='68' font-size='50' font-family='Arial Black,sans-serif' font-weight='900' text-anchor='middle' fill='%230c0c0b'>TB</text></svg>">
<link rel="preload" href="/fonts/anton.woff2" as="font" type="font/woff2" crossorigin>
<style>
  @font-face { font-family: "Anton"; src: url("/fonts/anton.woff2") format("woff2"); font-display: swap; }
  @font-face { font-family: "Inter"; src: url("/fonts/inter.woff2") format("woff2"); font-weight: 100 900; font-display: swap; }

  /* Farben identisch mit der Website (public/style.css) */
  :root {
    --bg: #0c0c0b; --card: #151412; --fg: #f5efe6; --muted: #a39d94; --line: #2a2825;
    --accent: #ff5b2e; --accent-ink: #0c0c0b;
    --display: "Anton", "Impact", "Arial Narrow", sans-serif;
    --body: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  }
  * { box-sizing: border-box; }
  html { color-scheme: dark; }
  body {
    margin: 0; min-height: 100svh; background: var(--bg); color: var(--fg);
    font: 400 16px/1.5 var(--body); -webkit-font-smoothing: antialiased;
  }
  a { color: inherit; text-decoration: none; }
  img { display: block; max-width: 100%; }
  svg { width: 1em; height: 1em; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  ::selection { background: var(--accent); color: var(--accent-ink); }
  main { max-width: 480px; margin: 0 auto; padding-bottom: max(32px, env(safe-area-inset-bottom)); }

  /* ---------- Cover ---------- */
  .cover { position: relative; aspect-ratio: 4 / 5; max-height: 74svh; width: 100%; overflow: hidden; }
  .cover img {
    width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.05);
    -webkit-mask-image: linear-gradient(#000 45%, #0000 98%); mask-image: linear-gradient(#000 45%, #0000 98%);
    animation: zoom 1.6s cubic-bezier(.2,.7,.2,1) both;
  }
  .share {
    position: absolute; top: max(16px, env(safe-area-inset-top)); right: 16px;
    display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%;
    background: #0c0c0b88; border: 1px solid #f5efe633; color: var(--fg); font-size: 18px; cursor: pointer;
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); transition: background .2s, color .2s;
  }
  .share:hover, .share:focus-visible { background: var(--accent); color: var(--accent-ink); outline: none; }
  .share-toast {
    position: absolute; top: max(24px, calc(env(safe-area-inset-top) + 8px)); right: 68px;
    font-size: 12px; font-weight: 650; letter-spacing: .1em; text-transform: uppercase;
    color: var(--accent-ink); background: var(--accent); padding: 4px 10px; border-radius: 999px;
    opacity: 0; transition: opacity .2s;
  }
  .share-toast.is-on { opacity: 1; }

  /* ---------- Header ---------- */
  header { position: relative; margin-top: -120px; padding: 0 22px; }
  h1 {
    margin: 0; font: 400 clamp(64px, 20vw, 96px)/.86 var(--display); text-transform: uppercase; letter-spacing: .005em;
  }
  h1 span { display: block; animation: rise .9s cubic-bezier(.2,.7,.2,1) both; }
  h1 span + span { color: var(--accent); animation-delay: .1s; }
  .role { margin: 18px 0 6px; font-size: 13px; font-weight: 650; letter-spacing: .14em; text-transform: uppercase; }
  .places { display: flex; flex-wrap: wrap; gap: 4px 14px; margin: 0; padding: 0; list-style: none; color: var(--muted); font-size: 14px; }
  .places li::before { content: "●"; color: var(--accent); font-size: 8px; margin-right: 6px; vertical-align: 2px; }
  .claim {
    margin: 20px 0 0; padding-left: 14px; border-left: 3px solid var(--accent);
    font-size: 21px; line-height: 1.3; font-weight: 550; letter-spacing: -.01em; color: #ece6dc; max-width: 26ch;
  }

  /* ---------- Sections ---------- */
  .stack { padding: 28px 16px 0; display: grid; gap: 12px; }
  .reveal { animation: rise .7s cubic-bezier(.2,.7,.2,1) both; animation-delay: calc(.25s + var(--i, 0) * .06s); }

  .feature {
    position: relative; isolation: isolate; overflow: hidden; display: block;
    aspect-ratio: 16 / 10; border-radius: 18px; border: 1px solid var(--line);
  }
  .feature img {
    position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: -2;
    filter: grayscale(.3) brightness(.7); transition: transform .7s cubic-bezier(.2,.7,.2,1), filter .4s;
  }
  .feature::after { content: ""; position: absolute; inset: 0; z-index: -1; background: linear-gradient(170deg, #0c0c0b00 30%, #0c0c0bee); }
  .feature-body { position: absolute; left: 20px; right: 20px; bottom: 18px; display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; }
  .feature-eyebrow { font-size: 12px; font-weight: 650; letter-spacing: .14em; text-transform: uppercase; color: var(--accent); }
  .feature-title { display: block; font: 400 40px/.95 var(--display); text-transform: uppercase; margin: 4px 0 4px; }
  .feature-sub { color: #d6d0c6; font-size: 14px; }
  .feature-arrow {
    flex: none; display: grid; place-items: center; width: 48px; height: 48px; border-radius: 50%;
    background: var(--accent); color: var(--accent-ink); font-size: 20px; transition: transform .3s;
  }
  .feature:hover img, .feature:focus-visible img { transform: scale(1.05); filter: none; }
  .feature:hover .feature-arrow { transform: rotate(-45deg); }
  .feature:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

  ul.rows { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
  .row {
    display: flex; align-items: center; gap: 14px; padding: 14px 16px 14px 14px;
    background: var(--card); border: 1px solid var(--line); border-radius: 16px;
    transition: border-color .2s, background .2s, transform .2s;
  }
  .row-icon {
    flex: none; display: grid; place-items: center; width: 44px; height: 44px; border-radius: 12px;
    background: #1f1d1a; color: var(--accent); font-size: 21px; transition: background .2s, color .2s;
  }
  .row-text { flex: 1; min-width: 0; display: grid; }
  .row-text strong { font-weight: 650; font-size: 16px; }
  .row-text small { color: var(--muted); font-size: 13.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .row-arrow { color: #5e5952; font-size: 18px; transition: transform .2s, color .2s; }
  .row:hover, .row:focus-visible { border-color: var(--accent); outline: none; transform: translateY(-1px); }
  .row:hover .row-icon, .row:focus-visible .row-icon { background: var(--accent); color: var(--accent-ink); }
  .row:hover .row-arrow, .row:focus-visible .row-arrow { color: var(--accent); transform: translateX(3px); }

  /* ---------- Gallery ---------- */
  .gallery { padding: 40px 0 0; }
  .gallery h2 {
    display: flex; align-items: baseline; justify-content: space-between;
    margin: 0 22px 14px; font: 400 30px/1 var(--display); text-transform: uppercase;
  }
  .gallery h2 small { font: 650 12px/1 var(--body); letter-spacing: .14em; color: var(--muted); }
  .strip {
    display: flex; gap: 10px; overflow-x: auto; padding: 0 16px 6px;
    scroll-snap-type: x mandatory; scroll-padding: 16px; scrollbar-width: none;
  }
  .strip::-webkit-scrollbar { display: none; }
  .strip figure { flex: none; width: 62%; margin: 0; aspect-ratio: 4 / 5; border-radius: 14px; overflow: hidden; scroll-snap-align: start; background: var(--card); }
  .strip img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s cubic-bezier(.2,.7,.2,1); }
  .strip figure:hover img { transform: scale(1.04); }

  /* ---------- Footer ---------- */
  footer { margin: 40px 22px 0; padding-top: 22px; border-top: 1px solid var(--line); display: flex; flex-wrap: wrap; gap: 8px 16px; justify-content: space-between; color: var(--muted); font-size: 13px; }
  footer nav { display: flex; gap: 16px; }
  footer a:hover { color: var(--accent); }

  @keyframes rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
  @keyframes zoom { from { transform: scale(1.08); } to { transform: none; } }

  @media (min-width: 560px) {
    body { padding: 32px 0; background: radial-gradient(60% 50% at 50% 0%, #2a1509 0%, var(--bg) 70%); }
    main { border: 1px solid var(--line); border-radius: 28px; overflow: hidden; background: var(--bg); }
    .strip figure { width: 46%; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition: none !important; }
  }
</style>
</head>
<body>
<main>
  <div class="cover">
    ${coverImg}
    <button class="share" type="button" aria-label="Seite teilen">${ICONS.share}</button>
    <span class="share-toast" role="status" aria-live="polite"></span>
  </div>

  <header>
    <h1><span>${escape(profile.firstName)}</span><span>${escape(profile.lastName)}</span></h1>
    <p class="role">${escape(profile.role)}</p>
    <ul class="places">${profile.places.map((p) => `<li>${escape(p)}</li>`).join("")}</ul>
    <p class="claim">${escape(profile.claim)}</p>
  </header>

  <div class="stack">
    <a class="feature reveal" style="--i:1" href="${escape(featured.url)}"${target(featured.url)}>
      <img src="${escape(featured.image)}" alt="" loading="lazy">
      <span class="feature-body">
        <span>
          <span class="feature-eyebrow">${escape(featured.eyebrow)}</span>
          <strong class="feature-title">${escape(featured.title)}</strong>
          <span class="feature-sub">${escape(featured.subtitle)}</span>
        </span>
        <span class="feature-arrow">${ICONS.arrow}</span>
      </span>
    </a>

    <ul class="rows">${items}</ul>
  </div>

  <section class="gallery" aria-label="On the road">
    <h2>On the road <small>Swipe →</small></h2>
    <div class="strip">${photos}</div>
  </section>

  <footer>
    <span>© ${new Date().getFullYear()} ${escape(name)}</span>
    <nav><a href="/impressum">Impressum</a><a href="/datenschutz">Datenschutz</a></nav>
  </footer>
</main>
<script>
  document.querySelector(".share").addEventListener("click", async () => {
    const data = { title: document.title, url: location.href };
    const toast = document.querySelector(".share-toast");
    try {
      if (navigator.share) return await navigator.share(data);
      await navigator.clipboard.writeText(data.url);
      toast.textContent = "Link kopiert";
    } catch (e) {
      if (e.name === "AbortError") return;
      toast.textContent = location.host + "/linktree";
    }
    toast.classList.add("is-on");
    setTimeout(() => toast.classList.remove("is-on"), 1800);
  });
</script>
</body>
</html>`;
}
