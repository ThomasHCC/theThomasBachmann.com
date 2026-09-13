import { profile, links } from "./links.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/linktree/") {
      return Response.redirect(`${url.origin}/linktree`, 301);
    }
    if (url.pathname === "/linktree") {
      return new Response(renderLinktree(), {
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

const svg = (path) =>
  `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;

const ICONS = {
  website: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
  mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  instagram: svg('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>'),
  linkedin: svg('<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>'),
  github: svg('<path d="M9 19c-4 1.5-4-2-6-2.5m12 5v-3.5a3 3 0 0 0-.9-2.3c3-.3 6-1.5 6-6.5a5 5 0 0 0-1.4-3.5 4.6 4.6 0 0 0-.1-3.5s-1.1-.3-3.6 1.4a12.4 12.4 0 0 0-6.5 0C6.1 2.2 5 2.5 5 2.5a4.6 4.6 0 0 0-.1 3.5A5 5 0 0 0 3.5 9.5c0 5 3 6.2 6 6.5a3 3 0 0 0-.9 2.3V22"/>'),
  youtube: svg('<rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="m10 9 5 3-5 3z" fill="currentColor"/>'),
  x: svg('<path d="M4 4l16 16M20 4 4 20"/>'),
  tiktok: svg('<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.5 3 2.5 5 5.5 5"/>'),
  link: svg('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
};

function renderLinktree() {
  const initials = profile.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  // Initialen liegen unter dem Foto und bleiben sichtbar, falls es fehlt.
  const photo = profile.avatar
    ? `<img src="${escape(profile.avatar)}" alt="${escape(profile.name)}" onerror="this.remove()">`
    : "";
  const avatar = `<div class="avatar"><span aria-hidden="true">${escape(initials)}</span>${photo}</div>`;

  const items = links
    .map((l) => {
      const external = /^https?:/.test(l.url);
      return `<li><a href="${escape(l.url)}"${external ? ' target="_blank" rel="noopener"' : ""}>
        <span class="icon">${ICONS[l.icon] ?? ICONS.link}</span>
        <span class="title">${escape(l.title)}</span>
        <span class="arrow" aria-hidden="true">→</span>
      </a></li>`;
    })
    .join("");

  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(profile.name)} · Links</title>
<meta name="description" content="${escape(profile.tagline)}">
<meta property="og:title" content="${escape(profile.name)}">
<meta property="og:description" content="${escape(profile.tagline)}">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔗</text></svg>">
<style>
  :root {
    --bg: #f4f2ee; --card: #ffffff; --text: #1b1a18; --muted: #6d6a64;
    --line: #e3dfd8; --accent: #c2410c; --accent-soft: #fbe9df;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #121110; --card: #1c1b19; --text: #f1eee9; --muted: #a29d95;
      --line: #2e2c29; --accent: #fb923c; --accent-soft: #2f1f14;
    }
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; background: var(--bg); color: var(--text);
    font: 16px/1.5 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    display: flex; justify-content: center; padding: 64px 20px 40px;
  }
  main { width: 100%; max-width: 480px; text-align: center; }
  .avatar {
    position: relative; overflow: hidden;
    width: 120px; height: 120px; border-radius: 50%; margin: 0 auto 18px;
    display: grid; place-items: center; background: var(--accent-soft); color: var(--accent);
    font-size: 40px; font-weight: 650; letter-spacing: .02em;
  }
  .avatar img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  h1 { font-size: 26px; margin: 0 0 6px; letter-spacing: -.01em; }
  .tagline { color: var(--muted); margin: 0 0 32px; }
  ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
  a {
    display: flex; align-items: center; gap: 14px; padding: 16px 18px;
    background: var(--card); border: 1px solid var(--line); border-radius: 14px;
    color: inherit; text-decoration: none; font-weight: 550;
    transition: transform .15s ease, border-color .15s ease, box-shadow .15s ease;
  }
  a:hover, a:focus-visible {
    transform: translateY(-2px); border-color: var(--accent);
    box-shadow: 0 6px 20px -10px var(--accent); outline: none;
  }
  .icon { color: var(--accent); display: grid; }
  .title { flex: 1; text-align: left; }
  .arrow { color: var(--muted); transition: transform .15s ease; }
  a:hover .arrow { transform: translateX(3px); color: var(--accent); }
  footer { margin-top: 40px; font-size: 13px; color: var(--muted); }
  footer a { display: inline; padding: 0; border: 0; background: none; color: inherit; font-weight: 400; text-decoration: underline; }
  footer a:hover { transform: none; box-shadow: none; }
  @media (prefers-reduced-motion: reduce) { a, .arrow { transition: none; } }
</style>
</head>
<body>
<main>
  ${avatar}
  <h1>${escape(profile.name)}</h1>
  <p class="tagline">${escape(profile.tagline)}</p>
  <ul>${items}</ul>
  <footer><a href="/">thethomasbachmann.com</a></footer>
</main>
</body>
</html>`;
}
