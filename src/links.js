// Inhalte des Linktrees – hier anpassen. Texte passend zur Website und Instagram-Bio halten.
// Bilder liegen in ./public. Fehlt eine Datei, greift `fallback` bzw. das Bild wird ausgeblendet.

export const profile = {
  firstName: "Thomas",
  lastName: "Bachmann",
  role: "Geschäftsführer Hep Cat Club · Unternehmer & Speaker",
  claim: "Echte Communities. Echte Begegnungen. In der echten Welt.",
  places: ["München", "Augsburg", "Weltweit"],
  cover: {
    src: "/img/me/wald-portrait.jpg",
    fallback: "/img/thomas-stage.jpg",
    alt: "Porträt von Thomas Bachmann",
    position: "50% 25%",
  },
};

// Großer Bild-Link.
export const featured = {
  eyebrow: "Geschäftsführer",
  title: "Hep Cat Club",
  subtitle: "Swing-Community · München & Augsburg",
  url: "https://hepcatclub.com",
  image: "/img/hcc-community.jpg",
};

// icon: einer der Schlüssel aus ICONS in src/index.js
// (website, mail, instagram, linkedin, github, youtube, x, tiktok, calendar, mic, link)
export const links = [
  { title: "LinkedIn", subtitle: "Unternehmer & Speaker", url: "https://www.linkedin.com/in/thethomasbachmann/", icon: "linkedin" },
  { title: "Instagram", subtitle: "@thethomasbachmann", url: "https://www.instagram.com/thethomasbachmann/", icon: "instagram" },
  { title: "Website", subtitle: "thethomasbachmann.com", url: "/", icon: "website" },
];

// Fotostreifen „On the road“ – fehlende Dateien werden ausgeblendet.
export const gallery = [
  { src: "/img/me/panel.jpg", alt: "Thomas Bachmann bei einer Podiumsdiskussion" },
  { src: "/img/thomas-stage.jpg", alt: "Thomas Bachmann moderiert ein Open-Air-Event" },
  { src: "/img/me/venedig.jpg", alt: "Thomas Bachmann in Venedig" },
  { src: "/img/me/see-sw.jpg", alt: "Thomas Bachmann im See, schwarz-weiß" },
  { src: "/img/me/tokyo.jpg", alt: "Thomas Bachmann im Regen in Tokyo" },
];
