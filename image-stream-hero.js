// Port of ImageStreamHero's mirrored 3D path for this static site.
const hero = document.querySelector(".hero");
const rails = hero.querySelector(".stream-rails");
const toggle = hero.querySelector(".stream-toggle");
const cardCount = 12;
const duration = 24;
const stops = 24;

function corridorKeyframes(direction, name) {
  const frames = [];
  for (let step = 0; step <= stops; step += 1) {
    const progress = step / stops;
    const scale = (2.6 / 25) * (46 / 2.6) ** progress;
    const depth = 30 * (1 - 1 / scale);
    const rail = 44 - 55 * (1 - progress) ** 3.3;
    const turn = 6 + 22 * progress;
    frames.push(
      `${(progress * 100).toFixed(2)}% { transform: translate3d(${(direction * rail).toFixed(2)}cqw, 0, ${depth.toFixed(2)}cqw) rotateY(${(-direction * turn).toFixed(2)}deg); }`,
    );
  }
  return `@keyframes ${name} { ${frames.join("\n")} }`;
}

if (CSS.supports("width", "1cqw") && CSS.supports("transform-style", "preserve-3d")) {
  const style = document.createElement("style");
  const paths = [[1, "image-stream-right"], [-1, "image-stream-left"]];
  style.textContent = paths.map(([direction, name]) => corridorKeyframes(direction, name)).join("\n");
  document.head.append(style);

  const corridor = document.createElement("div");
  const decodedImages = [];
  for (const [, path] of paths) {
    for (let index = 0; index < cardCount; index += 1) {
      const card = document.createElement("div");
      card.className = "stream-card";
      card.style.setProperty("--stream-path", path);
      card.style.setProperty("--stream-offset", `${-(index * duration) / cardCount}s`);
      const image = new Image();
      image.src = `imagens-hero/${String(index + 1).padStart(2, "0")}.webp`;
      image.alt = "";
      image.decoding = "async";
      image.draggable = false;
      decodedImages.push(image.decode());
      card.append(image);
      corridor.append(card);
    }
  }
  // Start the corridor only after the covers have finished loading.
  Promise.allSettled(decodedImages).then(() => {
    rails.append(corridor);
    toggle.hidden = false;
  });
  toggle.addEventListener("click", () => {
    const paused = hero.classList.toggle("is-paused");
    toggle.textContent = paused ? "Retomar animação" : "Pausar animação";
  });
}
