document.documentElement.classList.add("js");

// Navigation: Hintergrund beim Scrollen, Mobile-Menü
const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav-toggle");

const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const setMenu = (open) => {
  nav.classList.toggle("is-open", open);
  toggle?.setAttribute("aria-expanded", String(open));
  toggle?.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
  document.body.style.overflow = open ? "hidden" : "";
};
toggle?.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
document.querySelectorAll(".menu a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

// Elemente beim Scrollen einblenden
const revealed = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    }),
    { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
  );
  revealed.forEach((el) => io.observe(el));
} else {
  revealed.forEach((el) => el.classList.add("is-visible"));
}

document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
