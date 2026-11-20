(() => {
  const loader = document.getElementById("loader");
  if (!loader) return;

  const bar = loader.querySelector(".loader-bar span");
  const percent = loader.querySelector(".loader-percent");

  const MIN_TIME = 1600; // always show the loader at least this long (ms)
  const MAX_TIME = 8000; // stop waiting after this long (ms)

  const startTime = performance.now();
  let last = startTime;
  let progress = 0;
  let pageLoaded = document.readyState === "complete";

  document.body.classList.add("loading");

  if (!pageLoaded) {
    window.addEventListener("load", () => (pageLoaded = true), { once: true });
  }

  function finish() {
    loader.classList.add("loader-hide");
    document.body.classList.remove("loading");
    setTimeout(() => loader.remove(), 900);
  }

  function tick(now) {
    const elapsed = now - startTime;
    const dt = Math.max(0, now - last);
    last = now;

    const ready = (pageLoaded && elapsed >= MIN_TIME) || elapsed >= MAX_TIME;

    // Climb to 90% while the page loads, then jump to 100% when it's ready
    const target = ready ? 100 : Math.min(90, (elapsed / MIN_TIME) * 90);

    progress += (target - progress) * (1 - Math.exp(-dt / 120));
    if (ready && progress > 99.4) progress = 100;

    bar.style.width = progress + "%";
    percent.textContent = Math.round(progress) + "%";

    if (progress < 100) {
      requestAnimationFrame(tick);
    } else {
      setTimeout(finish, 250);
    }
  }

  requestAnimationFrame(tick);
})();
