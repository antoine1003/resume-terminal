import confetti from "canvas-confetti";
import { Fireworks } from "fireworks-js";
import { stringToDom } from "./utils";

/**
 * Affiche des confettis sur la page
 */
export function pif() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
  };

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      })
    );
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

export function setDarkMode(value) {
  if (value) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}

export function getCV() {
  const a = document.createElement("a");
  a.href = "https://my-resume.adautry.fr/download-latest";
  a.setAttribute("download", "CV - Antoine DAUTRY.pdf");
  a.click();
}

export function rmRf() {
  if (document.body.classList.contains("firework")) return;
  setDarkMode(true);
  document.body.classList.add("firework");
  const fireworks = new Fireworks(document.body, {
    mouse: { click: true, move: false, max: 7 },
  });
  fireworks.start();
}

export function setHalloweenTheme() {
  const isActive = document.querySelector(".halloween-bg");
  if (isActive) return;
  // add image
  const imageUrl = new URL(
    'images/halloween-bg.jpg',
    import.meta.url
  );
  const html = `<img src="${imageUrl}" class="halloween-bg" alt="Halloween background" />`;
  document.body.prepend(stringToDom(html));
  document.body.classList.add("halloween");
  setDarkMode(true);
}

/**
 * Shows Santa on the page and remove the listener
 * This function is needed to properly remove listener
 * with removeEventListener function
 */
export function showSantaAndRemoveListener() {
  showSanta(true);
}

export function showSanta(removeOnClickListener = false) {
  if (removeOnClickListener) {
    document.removeEventListener('click', showSantaAndRemoveListener);
  }
  let santaEl = document.getElementById('santa');

  if (santaEl)
    return;

  const imageUrl = new URL(
    'images/santa.gif',
    import.meta.url
  );
  const html = `<img src="${imageUrl}" alt="Santa with his deers" id="santa">`
  document.body.prepend(stringToDom(html));
  santaEl = document.getElementById('santa')

  const santaOptions = {
    animationId: requestAnimationFrame(animateSanta),
    amountOfPixelsToAnimate: window.innerWidth + 200,
    duration: 5000,
    imageAngleCorrection: 6.0382, // In radian
    angleAtenuation: 4,
    topOffset: '5vh'
  }

  let right = 0;
  let startTime = null;
  const jingleBellsSoundUrl = new URL(
    'sound/jingle-bells.mp3',
    import.meta.url
  );

  let jingleBellsSound = new Audio(jingleBellsSoundUrl);
  jingleBellsSound.play();


  function animateSanta(timestamp) {
    if (!startTime) {
      startTime = timestamp;
    }

    const runtime = timestamp - startTime;
    const relativeProgress = runtime / santaOptions.duration;

    right = santaOptions.amountOfPixelsToAnimate * Math.min(relativeProgress, 1);

    const { top, radian } = getAnimationData(relativeProgress);

    const angle = (radian + santaOptions.imageAngleCorrection);

    santaEl.style.transform = `translateX(-${right}px) translateY(calc(${santaOptions.topOffset} - ${top * 100}px)) rotate(${angle}rad)`;

    // We want to request another frame when our desired duration isn't met yet
    if (runtime < santaOptions.duration) {
      requestAnimationFrame(animateSanta);
    } else {
      santaEl.remove();
      jingleBellsSound.pause();
      cancelAnimationFrame(santaOptions.animationId);
    }
  }

  /**
   * Returns calculated fields needed for animation
   * @param {number} progress
   * @returns {top: number, radian: number}
   */
  function getAnimationData(progress) {
    progress = Math.max(0, Math.min(1, progress));

    // Calculate derivate and get the angle to calculate image rotation
    const derivate = -8 * progress + 4;
    const radian = Math.atan(derivate) / santaOptions.angleAtenuation

    return {
      top: 1 - 4 * (progress - 0.5) ** 2, // Parabol function
      radian
    };
  }
}
