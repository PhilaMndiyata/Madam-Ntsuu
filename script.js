"use strict";

/* ============================================================
   PERSONALIZE THIS
   ------------------------------------------------------------
   1. reasons        -> replace the placeholders with real moments.
   2. typewriterText -> the line typed out after "My Dearest".
   3. envelopeName   -> shown on the envelope front.
   4. signatureName  -> how you sign the letter.
   ============================================================ */

const herName = "MaNtsubane";

const reasons = [
  "The way your laugh lights up the whole room",
  "How safe and at home I feel whenever I'm with you",
  "The way you care so deeply for everyone you love",
  "Your smile — my favourite thing in the whole world",
  "The way you make ordinary days feel like magic",
  "How you believe in me, even when I doubt myself",
];

const typewriterText = `Every single day with you is my favourite day — so I wrote this little letter to remind you exactly how much I love you.`;

const envelopeName = "For MaNtsubane";
const signatureName = "Your name goes here";

/* ---------- Heart SVG helper ---------- */
function heartSVG(size, color) {
  const fill = color ? ` fill="${color}"` : "";
  return `<svg viewBox="0 0 512 512" width="${size}" height="${size}"${fill} aria-hidden="true">
    <path d="M256 448l-30.2-27.4C101.6 312.4 48 264.6 48 204.6 48 156 86 118 134.6 118c26.6 0 52.1 10.6 70.9 29.5L256 198l50.5-50.5C325.3 128.6 350.8 118 377.4 118 426 118 464 156 464 204.6c0 60-53.6 107.8-177.8 216L256 448z"/>
  </svg>`;
}

/* ---------- Apply personalized text ---------- */
document.querySelector(".envelope__name").textContent = envelopeName;
document.querySelector(".letter__signature").textContent = signatureName;
document.querySelector(".letter__greeting").textContent = `My Dearest ${herName},`;

/* ---------- Floating hearts ---------- */
const floaters = document.getElementById("floaters");
const HEART_COLORS = ["#e75480", "#f19cbb", "#e6b15c", "#d67ba8", "#f4a7c0"];

function spawnFloater(burst = false) {
  const size = burst ? 18 + Math.random() * 34 : 14 + Math.random() * 22;
  const el = document.createElement("div");
  el.innerHTML = heartSVG(Math.round(size));
  el.style.left = `${Math.random() * 100}vw`;
  el.style.setProperty("--s", 0.6 + Math.random() * 0.9);
  el.style.setProperty("--o", 0.25 + Math.random() * 0.45);
  el.querySelector("svg").style.fill = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
  el.style.animationDuration = `${7 + Math.random() * 8}s`;
  el.style.animationDelay = `${Math.random() * 4}s`;
  floaters.appendChild(el);
  el.addEventListener("animationend", () => el.remove());
}

for (let i = 0; i < 16; i++) spawnFloater();

function heartBurst(count = 26) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    const size = 16 + Math.random() * 30;
    el.innerHTML = heartSVG(Math.round(size));
    el.style.left = "50vw";
    el.style.top = "50vh";
    el.style.position = "fixed";
    el.style.zIndex = "99";
    el.style.pointerEvents = "none";
    el.querySelector("svg").style.fill = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
    const dx = (Math.random() - 0.5) * 70;
    const dy = (Math.random() - 0.5) * 70;
    el.animate(
      [
        { transform: "translate(-50%, -50%) scale(0.2)", opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}vw), calc(-50% + ${dy}vh)) scale(1)`, opacity: 0 },
      ],
      { duration: 1200 + Math.random() * 900, easing: "cubic-bezier(0.2, 0.8, 0.4, 1)" }
    ).onfinish = () => el.remove();
    document.body.appendChild(el);
  }
}

/* ---------- Envelope open ---------- */
const envelope = document.getElementById("envelope");
const scene = document.getElementById("scene");
const letter = document.getElementById("letter");

envelope.addEventListener("click", () => {
  envelope.classList.add("open");
  setTimeout(() => scene.classList.add("hidden"), 850);
  setTimeout(() => {
    scene.style.display = "none";
    letter.setAttribute("aria-hidden", "false");
    letter.classList.add("visible");
    startTypewriter();
    revealObserver.observe(document.querySelector(".letter__head"));
    document.querySelectorAll(".letter__head, .reasons, .meter, .letter__close").forEach((s) => {
      if (!s.classList.contains("reveal")) s.classList.add("reveal");
    });
    window.scrollTo({ top: 0, behavior: "instant" });
    revealObserver.observe(document.querySelector(".letter__head"));
  }, 900);
});

/* ---------- Typewriter ---------- */
let typed = false;

function startTypewriter() {
  if (typed) return;
  typed = true;
  const el = document.getElementById("typewriter");
  const text = typewriterText;
  let i = 0;
  function tick() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(tick, 28);
    }
  }
  tick();
}

/* ---------- Reasons flip cards ---------- */
const grid = document.getElementById("reasonsGrid");

reasons.forEach((reason, idx) => {
  const card = document.createElement("div");
  card.className = "flip";
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Reason ${idx + 1}: ${reason}`);
  card.innerHTML = `
    <div class="flip__inner">
      <div class="flip__face flip__front">
        ${heartSVG(34)}
        <span class="flip__num">0${idx + 1}</span>
        <span class="flip__prompt">tap to reveal</span>
      </div>
      <div class="flip__face flip__back">${reason}</div>
    </div>`;
  const toggle = () => card.classList.toggle("flipped");
  card.addEventListener("click", toggle);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  });
  grid.appendChild(card);
});

/* ---------- Heart meter ---------- */
const meterHearts = document.getElementById("meterHearts");
const meterText = document.getElementById("meterText");
const meterBtn = document.getElementById("meterBtn");

const METER_TEXTS = [
  "Tap the button to fill my heart…",
  "I love you a little bit",
  "I love you some more",
  "I love you quite a lot",
  "I love you even more than that",
  "I love you halfway to the stars",
  "I love you most of the way to the moon",
  "Almost there, my love…",
  "I love you almost to the moon",
  "One more heart to go…",
  "I love you to the moon and back — and still counting.",
];

const TOTAL_HEARTS = 10;
let filled = 0;

for (let i = 0; i < TOTAL_HEARTS; i++) {
  const el = document.createElement("div");
  el.innerHTML = heartSVG(30);
  meterHearts.appendChild(el);
}

meterBtn.addEventListener("click", () => {
  if (filled >= TOTAL_HEARTS) return;
  const heart = meterHearts.children[filled];
  heart.firstElementChild.classList.add("lit");
  filled++;
  meterText.textContent = METER_TEXTS[filled];
  if (filled === TOTAL_HEARTS) {
    meterBtn.style.opacity = "0";
    meterBtn.style.pointerEvents = "none";
    heartBurst(30);
    document.getElementById("finalNote").textContent = "This little heart is yours forever. I love you, my love.";
  }
});

/* ---------- Reveal on scroll ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);
